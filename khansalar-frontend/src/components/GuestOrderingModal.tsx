import React, { useState } from 'react';
import {
  QrCode,
  Smartphone,
  Printer,
  X,
  Plus,
  Minus,
  CheckCircle2,
  UtensilsCrossed,
  BellRing,
  Sparkles,
  ShoppingBag,
  Send
} from 'lucide-react';
import type { RestaurantTable, MenuItem, GuestOrderItem } from '../types';
import { api } from '../services/api';
import { formatPrice, toPersianDigits } from '../utils/persianUtils';
import { soundManager } from '../utils/soundEffects';
import { ShamsehStar } from './GirihOrnament';

interface GuestOrderingModalProps {
  table: RestaurantTable;
  menu: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced?: () => void;
}

export const GuestOrderingModal: React.FC<GuestOrderingModalProps> = ({
  table,
  menu,
  isOpen,
  onClose,
  onOrderPlaced,
}) => {
  const [activeMode, setActiveMode] = useState<'STAND' | 'MOBILE_SIMULATOR'>('MOBILE_SIMULATOR');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [orderSubmitted, setOrderSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [waiterCalled, setWaiterCalled] = useState<boolean>(false);

  if (!isOpen) return null;

  const categories = ['ALL', ...Array.from(new Set(menu.map((m) => m.category)))];

  const handleAddToCart = (itemId: number) => {
    soundManager.playItemAdd();
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (itemId: number) => {
    soundManager.playClick();
    setCart((prev) => {
      const current = prev[itemId] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: current - 1 };
    });
  };

  const cartItems: GuestOrderItem[] = Object.entries(cart).map(([idStr, quantity]) => {
    const item = menu.find((m) => m.id === parseInt(idStr, 10))!;
    return {
      menuItemId: item.id,
      itemName: item.name,
      quantity,
      unitPrice: item.price,
    };
  });

  const cartTotal = cartItems.reduce((acc, curr) => acc + curr.quantity * curr.unitPrice, 0);
  const totalItemCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const handlePlaceGuestOrder = async () => {
    if (cartItems.length === 0) return;
    setIsSubmitting(true);
    soundManager.playCashRegister();

    try {
      await api.placeGuestOrder({
        tableNumber: table.tableNumber,
        customerName: guestName.trim() || undefined,
        phoneNumber: guestPhone.trim() || undefined,
        notes: notes.trim() || undefined,
        items: cartItems,
      });

      setOrderSubmitted(true);
      if (onOrderPlaced) onOrderPlaced();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCallWaiter = async (reason: string) => {
    soundManager.playKitchenAlert();
    await api.callWaiter(table.tableNumber, reason);
    setWaiterCalled(true);
    setTimeout(() => setWaiterCalled(false), 5000);
  };

  // SVG representation of QR code with stylized corners
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https://khansalar.ir/menu/table/${table.tableNumber}&bgcolor=0b1b38&color=dfb15b&qzone=2`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#071630] border border-khansalar-gold/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#051126]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-khansalar-gold to-amber-600 rounded-lg text-slate-950">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-amber-100">
                  منوی هوشمند دیجیتال و سفارش‌گیری آنلاین سر میز
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-khansalar-gold border border-khansalar-gold/30">
                  {table.tableNumber} - {table.title}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                مهمان با اسکن این بارکد اختصاصی، منوی خوان‌سالار را مشاهده کرده و مستقیماً سفارش می‌دهد
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveMode('MOBILE_SIMULATOR');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeMode === 'MOBILE_SIMULATOR'
                    ? 'bg-khansalar-gold text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>شبیه‌ساز موبایل مهمان</span>
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveMode('STAND');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeMode === 'STAND'
                    ? 'bg-khansalar-gold text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>استند چاپی QR کد میز</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#040c1d]">
          {activeMode === 'STAND' ? (
            /* Table QR Code Stand Print Preview */
            <div className="max-w-md mx-auto bg-gradient-to-b from-[#091f48] via-[#0b2454] to-[#061633] border-2 border-khansalar-gold/60 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-2 right-2 opacity-15 pointer-events-none">
                <ShamsehStar size={120} className="text-khansalar-gold" />
              </div>
              <div className="absolute bottom-2 left-2 opacity-15 pointer-events-none">
                <ShamsehStar size={120} className="text-khansalar-gold" />
              </div>

              {/* Stand Header */}
              <div className="relative space-y-1 mb-5">
                <span className="text-[11px] font-bold text-khansalar-gold tracking-widest uppercase">
                  رستوران سنتی و تشریفاتی خوان‌سالار
                </span>
                <h3 className="text-xl font-black text-amber-100">{table.title}</h3>
                <div className="inline-block px-3 py-1 rounded-full bg-slate-950/70 border border-khansalar-gold/40 text-xs font-mono font-bold text-khansalar-gold mt-1">
                  میز اختصاصی شماره {toPersianDigits(table.tableNumber)}
                </div>
              </div>

              {/* QR Code Container */}
              <div className="relative inline-block p-4 bg-[#071738] rounded-2xl border-2 border-dashed border-khansalar-gold/50 shadow-inner my-2">
                <img
                  src={qrSvgUrl}
                  alt={`QR Code Table ${table.tableNumber}`}
                  className="w-48 h-48 mx-auto rounded-xl shadow-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 bg-slate-950 rounded-lg border border-khansalar-gold/60 flex items-center justify-center shadow-md">
                    <UtensilsCrossed className="w-5 h-5 text-khansalar-gold" />
                  </div>
                </div>
              </div>

              {/* Instructions & Persian Poem */}
              <div className="mt-5 space-y-2 text-xs text-slate-300">
                <p className="font-bold text-amber-200">
                  دوربین گوشی خود را روبه‌روی بارکد بالا بگیرید
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  مشاهده عکس و توضیحات کامل منو • ثبت سفارش مستقیم در آشپزخانه • فراخوان مهماندار بدون انتظار
                </p>
                <div className="pt-3 border-t border-slate-800 text-[10px] text-khansalar-gold/80 italic font-serif">
                  «بفرما به بزم خوان‌سالار، که مهمان ما تاج سر ماست»
                </div>
              </div>

              {/* Print Stand Button */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-khansalar-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-gold-glow transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>چاپ استند روی میز</span>
                </button>
              </div>
            </div>
          ) : (
            /* Live Guest Smartphone Interactive Simulator */
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6">
              {/* Phone Frame */}
              <div className="w-full max-w-[360px] bg-slate-950 border-4 border-slate-700/80 rounded-[40px] shadow-2xl overflow-hidden flex flex-col h-[650px] relative">
                {/* Notch & Speaker */}
                <div className="bg-slate-950 pt-2 pb-1 px-6 flex justify-between items-center text-[10px] text-slate-400 font-mono select-none">
                  <span>۲۰:۳۰</span>
                  <div className="w-20 h-3.5 bg-slate-900 rounded-full mx-auto" />
                  <div className="flex items-center gap-1">
                    <span>5G</span>
                    <span>🔋</span>
                  </div>
                </div>

                {/* Mobile App Header */}
                <div className="bg-gradient-to-r from-[#081a3d] to-[#0f2d6b] p-3 border-b border-khansalar-gold/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-khansalar-gold/20 border border-khansalar-gold/40 flex items-center justify-center text-khansalar-gold">
                      <UtensilsCrossed className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-amber-100">رستوران خوان‌سالار</h4>
                      <p className="text-[10px] text-khansalar-gold">منوی دیجیتال سر میز</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {table.title}
                  </span>
                </div>

                {/* Mobile View: Success Screen or Menu Browser */}
                {orderSubmitted ? (
                  <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4 bg-[#051126] animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 animate-bounce">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-black text-emerald-300">
                      سفارش شما با موفقیت ثبت شد!
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      سفارش میز <span className="font-bold text-khansalar-gold">{table.tableNumber}</span> فوراً به بخش آشپزخانه ارسال شد و در حال طبخ است.
                    </p>
                    <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 w-full space-y-1">
                      <div className="flex justify-between">
                        <span>مبلغ قابل پرداخت:</span>
                        <span className="font-bold text-amber-200">{formatPrice(cartTotal)}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span>وضعیت:</span>
                        <span className="text-emerald-400 font-bold">ارسال شده به KDS آشپزخانه</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setOrderSubmitted(false);
                        setCart({});
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-bold rounded-xl transition-all"
                    >
                      سفارش آیتم‌های دیگر
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto flex flex-col bg-[#051126]">
                    {/* Category Filter Pills */}
                    <div className="p-2 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                      {categories.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            soundManager.playClick();
                            setSelectedCategory(c);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                            selectedCategory === c
                              ? 'bg-khansalar-gold text-slate-950 font-black'
                              : 'text-slate-400 hover:text-white bg-slate-900'
                          }`}
                        >
                          {c === 'ALL' ? 'همه منو' : c}
                        </button>
                      ))}
                    </div>

                    {/* Waiter Alert Banner */}
                    {waiterCalled && (
                      <div className="p-2 bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 text-[10px] text-center font-bold animate-slide-down">
                        ✓ فراخوان مهماندار ثبت شد؛ به زودی سر میز حاضر می‌شود.
                      </div>
                    )}

                    {/* Menu Item Cards */}
                    <div className="flex-1 p-2.5 space-y-2 overflow-y-auto">
                      {menu
                        .filter((m) => selectedCategory === 'ALL' || m.category === selectedCategory)
                        .map((item) => {
                          const qty = cart[item.id] || 0;
                          return (
                            <div
                              key={item.id}
                              className="p-2.5 bg-slate-900/70 border border-slate-800 rounded-xl flex items-center justify-between gap-2 hover:border-slate-700 transition-all"
                            >
                              <div className="flex-1 min-w-0">
                                <h5 className="text-xs font-bold text-slate-200 truncate">{item.name}</h5>
                                <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.description}</p>
                                <span className="text-xs font-black text-khansalar-gold mt-1 inline-block">
                                  {formatPrice(item.price)}
                                </span>
                              </div>

                              {/* Quantity control */}
                              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 flex-shrink-0">
                                {qty > 0 && (
                                  <>
                                    <button
                                      onClick={() => handleRemoveFromCart(item.id)}
                                      className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center text-xs"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="text-xs font-mono font-bold text-white px-1">
                                      {toPersianDigits(qty)}
                                    </span>
                                  </>
                                )}
                                <button
                                  onClick={() => handleAddToCart(item.id)}
                                  className="w-5 h-5 rounded bg-khansalar-gold text-slate-950 font-bold hover:bg-amber-400 flex items-center justify-center text-xs shadow-sm"
                                >
                                  <Plus className="w-3 h-3 stroke-[3]" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {/* Bottom Cart & Actions Bar inside phone */}
                    <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-slate-400">
                          <ShoppingBag className="w-3.5 h-3.5 text-khansalar-gold" />
                          <span>سبد سفارش:</span>
                          <span className="font-bold text-white font-mono">{toPersianDigits(totalItemCount)} قلم</span>
                        </div>
                        <span className="font-black text-amber-200">{formatPrice(cartTotal)}</span>
                      </div>

                      <button
                        onClick={handlePlaceGuestOrder}
                        disabled={cartItems.length === 0 || isSubmitting}
                        className="w-full py-2 bg-gradient-to-r from-khansalar-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-gold-glow transition-all disabled:opacity-40 flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSubmitting ? 'در حال ارسال...' : 'ثبت سفارش مستقیم در آشپزخانه'}</span>
                      </button>

                      {/* Call Waiter quick button */}
                      <button
                        onClick={() => handleCallWaiter('فراخوان عمومی')}
                        className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-200 text-[11px] font-bold rounded-lg border border-slate-800 transition-all flex items-center justify-center gap-1"
                      >
                        <BellRing className="w-3.5 h-3.5 text-khansalar-gold" />
                        <span>فراخوان میهماندار سر میز (Call Waiter)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Guest Side Info & Options in Simulator */}
              <div className="w-full max-w-sm space-y-4 text-xs">
                <div className="bg-[#071630] p-4 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-100 font-bold">
                    <Sparkles className="w-4 h-4 text-khansalar-gold" />
                    <span>مشخصات مهمان (اختیاری)</span>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">نام مهمان</label>
                    <input
                      type="text"
                      placeholder="مثال: جناب احمدی"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-khansalar-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">شماره همراه (جهت پیامک صورتحساب)</label>
                    <input
                      type="tel"
                      placeholder="0912..."
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-khansalar-gold font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">یادداشت برای آشپزخانه</label>
                    <input
                      type="text"
                      placeholder="مثال: بدون فلفل، برنج دودی زعفرانی..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-khansalar-gold"
                    />
                  </div>
                </div>

                {/* Quick Call Waiter Actions */}
                <div className="bg-[#071630] p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-100 font-bold">
                    <BellRing className="w-4 h-4 text-khansalar-gold" />
                    <span>فراخوان‌های اختصاصی مهماندار</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleCallWaiter('درخواست صورتحساب و پرداخت')}
                      className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] text-slate-300 font-medium text-center hover:text-amber-200"
                    >
                      💳 درخواست فاکتور
                    </button>
                    <button
                      onClick={() => handleCallWaiter('درخواست قاشق، چنگال یا سرویس اضافی')}
                      className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] text-slate-300 font-medium text-center hover:text-amber-200"
                    >
                      🍴 قاشق و سرویس
                    </button>
                    <button
                      onClick={() => handleCallWaiter('درخواست آب و یخ اضافی')}
                      className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] text-slate-300 font-medium text-center hover:text-amber-200"
                    >
                      🧊 آب و نوشیدنی
                    </button>
                    <button
                      onClick={() => handleCallWaiter('درخواست تمیزکاری یا جمع‌آوری ظروف')}
                      className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] text-slate-300 font-medium text-center hover:text-amber-200"
                    >
                      🧹 نظافت میز
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
