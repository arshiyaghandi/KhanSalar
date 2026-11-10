import { useState, useEffect } from 'react';
import type { MenuItem, RestaurantTable, Customer } from '../types';
import { api } from '../services/api';
import { formatPrice, toPersianDigits } from '../utils/persianUtils';
import { soundManager } from '../utils/soundEffects';
import { ItemModifierModal } from './ItemModifierModal';
import { 
  Plus, 
  Minus, 
  Trash2, 
  Send, 
  ShoppingBag, 
  Utensils, 
  Coffee,
  CheckCircle,
  Search,
  Sliders,
  Crown
} from 'lucide-react';

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
  extraPrice?: number;
}

interface OrderPosViewProps {
  tables: RestaurantTable[];
  menu: MenuItem[];
  initialTableId?: number;
  onOrderCreated: (tableId: number, items: { menuItemId: number; quantity: number; notes?: string }[], notes?: string, customerId?: number) => Promise<void>;
}

export const OrderPosView: React.FC<OrderPosViewProps> = ({
  tables,
  menu,
  initialTableId,
  onOrderCreated,
}) => {
  const [selectedTableId, setSelectedTableId] = useState<number>(initialTableId || tables[0]?.id || 1);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [itemForModifier, setItemForModifier] = useState<MenuItem | null>(null);

  // Enterprise ERP - Customer Loyalty CRM
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  useEffect(() => {
    api.getCustomers().then(setCustomers).catch(() => {});
  }, []);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(menu.map((m) => m.category)))];

  const filteredMenu = menu.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.includes(searchQuery) || item.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const addToCartQuick = (item: MenuItem) => {
    soundManager.playItemAdd();
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id && !c.notes);
      if (existing) {
        return prev.map((c) =>
          c === existing ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const handleAddWithModifiers = (
    item: MenuItem,
    quantity: number,
    notes: string,
    extraPrice: number
  ) => {
    setCart((prev) => [
      ...prev,
      { menuItem: item, quantity, notes, extraPrice },
    ]);
  };

  const updateQuantity = (index: number, delta: number) => {
    soundManager.playClick();
    setCart((prev) =>
      prev
        .map((c, idx) => {
          if (idx === index) {
            const newQty = c.quantity + delta;
            return newQty > 0 ? { ...c, quantity: newQty } : null;
          }
          return c;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (index: number) => {
    soundManager.playClick();
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Financial calculations
  const subTotal = cart.reduce(
    (acc, c) => acc + (c.menuItem.price + (c.extraPrice || 0)) * c.quantity,
    0
  );
  
  // VIP Loyalty Discounts
  const discountRate =
    selectedCustomer?.tier === 'PLATINUM'
      ? 0.1
      : selectedCustomer?.tier === 'GOLD'
      ? 0.05
      : 0;
  const discountAmount = Math.round(subTotal * discountRate);

  const taxableAmount = Math.max(0, subTotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * 0.1);      // 10% VAT
  const serviceFee = Math.round(taxableAmount * 0.05);    // 5% Service fee
  const finalAmount = taxableAmount + taxAmount + serviceFee;

  const handleSubmitOrder = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      const payload = cart.map((c) => ({
        menuItemId: c.menuItem.id,
        quantity: c.quantity,
        notes: c.notes,
      }));
      await onOrderCreated(selectedTableId, payload, orderNotes, selectedCustomerId || undefined);
      soundManager.playKitchenAlert();
      setCart([]);
      setOrderNotes('');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
      {/* Item Customizer Modal */}
      <ItemModifierModal
        item={itemForModifier}
        onClose={() => setItemForModifier(null)}
        onAddWithModifiers={handleAddWithModifiers}
      />

      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl border border-emerald-400/40 animate-bounce">
          <CheckCircle className="w-6 h-6 text-emerald-200" />
          <div>
            <h4 className="font-bold text-sm">سفارش با موفقیت ثبت و مخابره شد!</h4>
            <p className="text-xs text-emerald-100">رویداد به تاپیک کافکا و آشپزخانه ارسال و پیش‌فاکتور صادر گردید.</p>
          </div>
        </div>
      )}

      {/* Menu Area (7 cols on Desktop) */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-4">
        
        {/* Search Bar & Quick Filters */}
        <div className="khansalar-panel rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3 border border-slate-700/60">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی سریع غذا، نوشیدنی، کباب، دسر..."
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-khansalar-gold transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-2.5 text-xs text-slate-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>یافت شده:</span>
            <span className="font-bold text-khansalar-gold">{toPersianDigits(filteredMenu.length)} آیتم</span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundManager.playClick();
                setActiveCategory(cat);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
                activeCategory === cat
                  ? 'bg-khansalar-gold text-slate-950 border-khansalar-gold shadow-gold-glow'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border-slate-700/60'
              }`}
            >
              {cat === 'all' ? 'همه خوراک‌ها و نوشیدنی‌ها' : cat}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredMenu.map((item) => {
            const countInCart = cart
              .filter((c) => c.menuItem.id === item.id)
              .reduce((sum, c) => sum + c.quantity, 0);

            return (
              <div
                key={item.id}
                className={`khansalar-panel rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 border group ${
                  countInCart > 0 ? 'border-khansalar-gold/70 bg-[#0e2249]' : 'border-slate-700/40 hover:border-khansalar-turquoise/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1 text-[11px] text-khansalar-turquoise font-medium">
                      <Coffee className="w-3 h-3" />
                      {item.category}
                    </span>
                    {countInCart > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] animate-pulse">
                        {toPersianDigits(countInCart)} در فیش
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-amber-100 group-hover:text-khansalar-gold transition">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-l from-amber-200 to-khansalar-gold font-mono">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Customizer button */}
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setItemForModifier(item);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold border border-slate-700 transition flex items-center gap-1"
                      title="سفارشی‌سازی دستور پخت و دورچین"
                    >
                      <Sliders className="w-3 h-3 text-khansalar-gold" />
                      <span>سفارشی</span>
                    </button>

                    {/* Quick Add */}
                    <button
                      onClick={() => addToCartQuick(item)}
                      className="w-8 h-8 rounded-xl bg-amber-500/15 hover:bg-khansalar-gold text-khansalar-gold hover:text-slate-950 border border-khansalar-gold/30 flex items-center justify-center transition shadow-sm active:scale-90"
                      title="افزودن سریع به فیش"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* POS Cart & Invoicing Drawer (5 cols on Desktop) */}
      <div className="lg:col-span-5 xl:col-span-4">
        <div className="khansalar-panel rounded-3xl p-6 border border-khansalar-gold/30 shadow-2xl sticky top-28 space-y-4">
          
          {/* Cart Header */}
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-khansalar-gold" />
              <h3 className="font-bold text-lg text-slate-100">فیش سفارش میز</h3>
            </div>
            {cart.length > 0 && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  setCart([]);
                }}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                خالی کردن
              </button>
            )}
          </div>

          {/* Table Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              انتخاب میز یا شاه‌نشین:
            </label>
            <select
              value={selectedTableId}
              onChange={(e) => {
                soundManager.playClick();
                setSelectedTableId(Number(e.target.value));
              }}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-khansalar-gold transition"
            >
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.tableNumber}) - {t.status === 'OCCUPIED' ? 'در حال پذیرایی' : 'خالی'}
                </option>
              ))}
            </select>
          </div>

          {/* Customer CRM Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-khansalar-gold" />
                <span>باشگاه مشتریان و وفاداری:</span>
              </span>
              {selectedCustomer && (
                <span className="text-[10px] text-amber-300 font-mono">
                  {selectedCustomer.loyaltyPoints} امتیاز
                </span>
              )}
            </label>
            <select
              value={selectedCustomerId || ''}
              onChange={(e) => {
                soundManager.playClick();
                setSelectedCustomerId(e.target.value ? Number(e.target.value) : null);
              }}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-khansalar-gold transition"
            >
              <option value="">مهمان عادی (بدون کارت باشگاه)</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} ({c.phoneNumber}) - {c.tier === 'PLATINUM' ? 'پلاتین سلطنتی 👑' : c.tier === 'GOLD' ? 'طلایی 🌟' : 'عضو باشگاه'}
                </option>
              ))}
            </select>

            {selectedCustomer && (
              <div className="mt-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 flex items-center justify-between">
                <span>سطح {selectedCustomer.tier === 'PLATINUM' ? 'پلاتین سلطنتی (۱۰٪ تخفیف VIP)' : selectedCustomer.tier === 'GOLD' ? 'طلایی (۵٪ تخفیف)' : 'نقره‌ای'}</span>
                <span className="text-emerald-400 font-bold">+{Math.floor(subTotal / 10000)} امتیاز خرید</span>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="max-h-[260px] overflow-y-auto space-y-2 pr-1">
            {cart.length === 0 ? (
              <div className="py-10 text-center text-slate-500">
                <Utensils className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-50" />
                <p className="text-xs">هیچ غذایی انتخاب نشده است</p>
                <p className="text-[11px] text-slate-600 mt-1">با کلیک روی منو، آیتم‌ها به این فیش اضافه می‌شوند</p>
              </div>
            ) : (
              cart.map((item, index) => {
                const singlePrice = item.menuItem.price + (item.extraPrice || 0);
                return (
                  <div
                    key={index}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <h5 className="text-xs font-bold text-slate-200">{item.menuItem.name}</h5>
                        <span className="text-[11px] text-amber-400 font-semibold font-mono">
                          {formatPrice(singlePrice * item.quantity)}
                        </span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 bg-slate-950 rounded-lg p-1 border border-slate-800">
                        <button
                          onClick={() => updateQuantity(index, -1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-slate-200 px-1 min-w-[16px] text-center font-mono">
                          {toPersianDigits(item.quantity)}
                        </span>
                        <button
                          onClick={() => updateQuantity(index, 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Modifiers Pill if added */}
                    {item.notes && (
                      <div className="text-[10px] text-khansalar-turquoise font-medium bg-khansalar-turquoise/10 px-2 py-0.5 rounded-lg border border-khansalar-turquoise/20">
                        {item.notes}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Notes */}
          <div>
            <textarea
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="توضیحات کلی سفارش میز (مثلاً: نان داغ، سرو همزمان چای و دسر...)"
              rows={2}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-khansalar-gold resize-none"
            />
          </div>

          {/* Financial Breakdown */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>جمع ناخالص اقلام:</span>
              <span className="font-mono">{formatPrice(subTotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>تخفیف وفاداری ({selectedCustomer?.tier === 'PLATINUM' ? '۱۰٪ سلطنتی' : '۵٪ طلایی'}):</span>
                <span className="font-mono">-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>مالیات بر ارزش افزوده (۱۰٪):</span>
              <span className="font-mono">{formatPrice(taxAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>حق سرویس پذیرایی (۵٪):</span>
              <span className="font-mono">{formatPrice(serviceFee)}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline text-sm font-black text-amber-200">
              <span>مبلغ نهایی فاکتور:</span>
              <span className="text-base text-transparent bg-clip-text bg-gradient-to-l from-amber-200 to-khansalar-gold font-mono">
                {formatPrice(finalAmount)}
              </span>
            </div>
          </div>

          {/* Action Button with Hotkey Hint */}
          <button
            disabled={cart.length === 0 || isSubmitting}
            onClick={handleSubmitOrder}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-gold-glow ${
              cart.length === 0 || isSubmitting
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-khansalar-gold via-amber-400 to-amber-500 text-slate-950 hover:brightness-110 active:scale-[0.98]'
            }`}
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'در حال مخابره به کافکا...' : 'ثبت نهایی و ارسال به آشپزخانه'}
            <kbd className="px-1.5 py-0.5 rounded bg-black/20 text-[10px] font-mono">F2</kbd>
          </button>
        </div>
      </div>
    </div>
  );
};
