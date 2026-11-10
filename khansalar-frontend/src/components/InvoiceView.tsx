import { useState } from 'react';
import type { Invoice } from '../types';
import { formatPrice, formatPriceRials, toPersianDigits } from '../utils/persianUtils';
import { soundManager } from '../utils/soundEffects';
import { 
  CreditCard, 
  Banknote, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Search, 
  QrCode, 
  Sparkles,
  Users2,
  Calculator,
  Minus,
  Plus,
  Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CornerArabesque } from './GirihOrnament';
import { 
  PersianRoyalStamp, 
  BotehJegheh, 
  EslimiBorderStrip 
} from './PersianSymbols';

interface InvoiceViewProps {
  invoices: Invoice[];
  selectedTableName?: string;
  onPayInvoice: (invoiceId: number, method: 'CARD_POS' | 'CASH' | 'ONLINE') => Promise<void>;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({
  invoices,
  selectedTableName,
  onPayInvoice,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'ISSUED' | 'PAID'>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>(selectedTableName || '');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number>(
    invoices.find((i) => (selectedTableName ? i.tableName === selectedTableName : true))?.id || invoices[0]?.id || 1
  );
  const [paymentMethod, setPaymentMethod] = useState<'CARD_POS' | 'CASH' | 'ONLINE'>('CARD_POS');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [splitCount, setSplitCount] = useState<number>(2);
  const [showSplitDrawer, setShowSplitDrawer] = useState<boolean>(false);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesFilter = filter === 'ALL' || inv.status === filter;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.tableName && inv.tableName.includes(searchTerm));
    return matchesFilter && matchesSearch;
  });

  const activeInvoice = invoices.find((i) => i.id === selectedInvoiceId) || invoices[0];

  const handleSettlePayment = async () => {
    if (!activeInvoice || activeInvoice.status === 'PAID') return;
    setIsProcessing(true);
    try {
      await onPayInvoice(activeInvoice.id, paymentMethod);
      soundManager.playCashRegister();
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#e5b869', '#00c8b3', '#ffd700', '#ffffff'],
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  // Split bill calculations
  const perPersonShare = activeInvoice ? Math.round(activeInvoice.finalAmount / splitCount) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Invoices List Sidebar (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        
        {/* Search & Filter Header */}
        <div className="khansalar-panel rounded-2xl p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو بر اساس شماره فاکتور یا نام میز..."
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-khansalar-gold transition"
            />
          </div>

          <div className="flex gap-2 text-xs">
            <button
              onClick={() => {
                soundManager.playClick();
                setFilter('ALL');
              }}
              className={`flex-1 py-1.5 rounded-lg font-bold transition border ${
                filter === 'ALL'
                  ? 'bg-khansalar-gold text-slate-950 border-khansalar-gold shadow-gold-glow'
                  : 'bg-slate-900/50 text-slate-400 border-slate-800'
              }`}
            >
              همه ({toPersianDigits(invoices.length)})
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setFilter('ISSUED');
              }}
              className={`flex-1 py-1.5 rounded-lg font-bold transition border ${
                filter === 'ISSUED'
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-gold-glow'
                  : 'bg-slate-900/50 text-slate-400 border-slate-800'
              }`}
            >
              منتظر تسویه ({toPersianDigits(invoices.filter((i) => i.status === 'ISSUED').length)})
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setFilter('PAID');
              }}
              className={`flex-1 py-1.5 rounded-lg font-bold transition border ${
                filter === 'PAID'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-turquoise-glow'
                  : 'bg-slate-900/50 text-slate-400 border-slate-800'
              }`}
            >
              تسویه شده ({toPersianDigits(invoices.filter((i) => i.status === 'PAID').length)})
            </button>
          </div>
        </div>

        {/* List of Invoices */}
        <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
          {filteredInvoices.map((inv) => {
            const isSelected = inv.id === activeInvoice?.id;
            const isPaid = inv.status === 'PAID';

            return (
              <div
                key={inv.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedInvoiceId(inv.id);
                }}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#112754] to-[#0d1d3d] border-khansalar-gold shadow-gold-glow'
                    : 'khansalar-panel border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <BotehJegheh size={14} className="text-khansalar-gold opacity-80" />
                    <span className="text-xs font-mono font-bold text-khansalar-gold">
                      {inv.invoiceNumber}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isPaid
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse'
                    }`}
                  >
                    {isPaid ? 'تسویه شده' : 'منتظر پرداخت'}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-200">{inv.tableName || 'سفارش بیرون‌بر'}</h4>
                  <span className="text-sm font-black text-amber-100 font-mono">
                    {formatPrice(inv.finalAmount)}
                  </span>
                </div>

                <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{inv.issuedAt}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Traditional-Modern Iranian Thermal/A4 Receipt (7 cols) */}
      <div className="lg:col-span-7">
        {activeInvoice ? (
          <div className="space-y-4">
            
            {/* The Actual Styled Receipt Card */}
            <div 
              id="thermal-receipt"
              className="khansalar-panel rounded-3xl p-6 md:p-8 border border-khansalar-gold/30 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#0a1a3b] via-[#091633] to-[#061026]"
            >
              <CornerArabesque position="tr" className="text-khansalar-gold/25" />
              <CornerArabesque position="bl" className="text-khansalar-gold/25" />

              {/* Top Eslimi Border Strip */}
              <EslimiBorderStrip className="text-khansalar-gold/30 mb-2" />

              {/* Receipt Header with Khansalar Brand Medallion */}
              <div className="text-center border-b border-khansalar-gold/25 pb-5">
                <div className="w-16 h-16 mx-auto mb-2 rounded-2xl overflow-hidden border-2 border-khansalar-gold shadow-gold-glow">
                  <img 
                    src="/khansalar-logo.jpg" 
                    alt="نشان رسمی خوان‌سالار" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-l from-amber-200 via-amber-300 to-khansalar-gold">
                  خوان‌ســالار
                </h2>
                <p className="text-xs text-khansalar-gold/80 font-medium mt-0.5">
                  صورتحساب رسمی فروش و خدمات پذیرایی
                </p>
                <div className="mt-2 text-[11px] text-slate-400 flex justify-center items-center gap-3">
                  <span>شماره فاکتور: <strong className="text-slate-200 font-mono">{activeInvoice.invoiceNumber}</strong></span>
                  <span>•</span>
                  <span>میز: <strong className="text-amber-200">{activeInvoice.tableName}</strong></span>
                </div>
              </div>

              {/* Invoice Meta Grid */}
              <div className="grid grid-cols-2 gap-3 py-3 text-xs text-slate-300 border-b border-slate-800">
                <div>
                  <span className="text-slate-400">تاریخ صدور: </span>
                  <span className="font-semibold">{activeInvoice.issuedAt}</span>
                </div>
                <div className="text-left">
                  <span className="text-slate-400">متصدی صندوق: </span>
                  <span className="font-semibold text-slate-200">صندوق مرکزی خوان‌سالار</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="my-4">
                <table className="w-full text-xs text-right">
                  <thead>
                    <tr className="border-b border-slate-700/60 text-slate-400">
                      <th className="pb-2 font-medium">ردیف</th>
                      <th className="pb-2 font-medium">شرح کالا / خدمات</th>
                      <th className="pb-2 font-medium text-center">تعداد</th>
                      <th className="pb-2 font-medium text-left">فی (تومان)</th>
                      <th className="pb-2 font-medium text-left">مبلغ کل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {activeInvoice.items && activeInvoice.items.length > 0 ? (
                      activeInvoice.items.map((item, idx) => (
                        <tr key={idx} className="text-slate-200">
                          <td className="py-2.5 text-slate-400">{toPersianDigits(idx + 1)}</td>
                          <td className="py-2.5 font-bold">
                            <div>{item.itemName}</div>
                            {item.notes && <div className="text-[10px] text-khansalar-turquoise font-normal">{item.notes}</div>}
                          </td>
                          <td className="py-2.5 text-center font-bold text-khansalar-gold font-mono">
                            {toPersianDigits(item.quantity)}
                          </td>
                          <td className="py-2.5 text-left font-mono">{formatPrice(item.unitPrice)}</td>
                          <td className="py-2.5 text-left font-bold font-mono">{formatPrice(item.totalPrice)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="text-slate-300">
                        <td className="py-2.5">۱</td>
                        <td className="py-2.5 font-bold">سفارش تشریفات و پذیرایی خوان‌سالار</td>
                        <td className="py-2.5 text-center font-bold">۱</td>
                        <td className="py-2.5 text-left font-mono">{formatPrice(activeInvoice.subTotal)}</td>
                        <td className="py-2.5 text-left font-bold font-mono">{formatPrice(activeInvoice.subTotal)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="pt-3 border-t border-slate-700/60 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>جمع ناخالص فاکتور:</span>
                  <span className="font-mono text-slate-200">{formatPrice(activeInvoice.subTotal)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>مالیات بر ارزش افزوده قانونی (۱۰٪):</span>
                  <span className="font-mono text-slate-200">{formatPrice(activeInvoice.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>حق سرویس و خدمات کافه/رستوران (۵٪):</span>
                  <span className="font-mono text-slate-200">{formatPrice(activeInvoice.serviceFee)}</span>
                </div>
                {activeInvoice.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>تخفیف ویژه مهمان:</span>
                    <span className="font-mono">-{formatPrice(activeInvoice.discountAmount)}</span>
                  </div>
                )}
                
                {/* Total Line with Gold Emphasize */}
                <div className="pt-3 border-t border-khansalar-gold/30 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-black text-amber-200">مبلغ قابل پرداخت:</span>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {formatPriceRials(activeInvoice.finalAmount)}
                    </p>
                  </div>
                  <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-l from-amber-200 to-khansalar-gold font-mono">
                    {formatPrice(activeInvoice.finalAmount)}
                  </span>
                </div>
              </div>

              {/* Bottom Eslimi Separator */}
              <EslimiBorderStrip className="text-khansalar-gold/30 my-3" />

              {/* Persian Hospitality Footnote & Official Persian Seal */}
              <div className="flex items-center justify-between pt-1">
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-300 font-medium">
                    «با تشکر از تشریف‌فرمایی شما به خوان‌سالار • گوارای وجود و نوش جان»
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <QrCode className="w-4 h-4 text-slate-400" />
                    <span>شناسه یکتای مالیاتی سامانه مودیان: TX-{activeInvoice.id}-IRAN</span>
                  </div>
                </div>

                {/* Persian Royal Stamp (مهر رسمی خوان‌سالار) */}
                <div>
                  {activeInvoice.status === 'PAID' ? (
                    <PersianRoyalStamp size={78} text="تسویه شد • تایید مالی" />
                  ) : (
                    <div className="text-left">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                        <Clock className="w-4 h-4 animate-spin" />
                        در انتظار تسویه صندوق
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Split Bill Calculator & Settlement Operations */}
            <div className="khansalar-panel rounded-2xl p-5 border border-khansalar-gold/30 space-y-4">
              
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-khansalar-gold" />
                  عملیات تسویه و پرداخت
                </h4>
                
                <div className="flex items-center gap-2">
                  {/* Split Bill Toggle */}
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setShowSplitDrawer((prev) => !prev);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition ${
                      showSplitDrawer 
                        ? 'bg-amber-500/20 border-khansalar-gold text-amber-300' 
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Users2 className="w-3.5 h-3.5 text-khansalar-gold" />
                    <span>دانگ‌شمار</span>
                  </button>

                  {/* Print Button */}
                  <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition border border-slate-700"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-300" />
                    <span>چاپ فیش</span>
                    <kbd className="text-[10px] font-mono px-1 rounded bg-black/30">F9</kbd>
                  </button>
                </div>
              </div>

              {/* Split Bill Drawer */}
              {showSplitDrawer && (
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                      <Calculator className="w-4 h-4 text-khansalar-gold" />
                      محاسبه دانگ میز برای جمع‌های دوستانه و خانوادگی:
                    </span>
                    
                    {/* Stepper */}
                    <div className="flex items-center gap-2 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          setSplitCount((c) => Math.max(2, c - 1));
                        }}
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-khansalar-gold font-mono px-2">
                        {toPersianDigits(splitCount)} نفر
                      </span>
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          setSplitCount((c) => Math.min(12, c + 1));
                        }}
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-amber-500/20 flex items-center justify-between">
                    <span className="text-xs text-slate-300 flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-khansalar-gold" />
                      سهم هر نفر (دانگ):
                    </span>
                    <div className="text-left">
                      <span className="text-base font-black text-amber-300 font-mono">
                        {formatPrice(perPersonShare)}
                      </span>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {formatPriceRials(perPersonShare)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeInvoice.status !== 'PAID' ? (
                <div className="space-y-4">
                  {/* Select Payment Method */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setPaymentMethod('CARD_POS');
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                        paymentMethod === 'CARD_POS'
                          ? 'bg-gradient-to-b from-teal-500/20 to-teal-500/5 border-khansalar-turquoise text-khansalar-turquoise'
                          : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span className="text-xs font-bold">دستگاه پوز (کارتخوان)</span>
                    </button>

                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setPaymentMethod('CASH');
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                        paymentMethod === 'CASH'
                          ? 'bg-gradient-to-b from-amber-500/20 to-amber-500/5 border-khansalar-gold text-khansalar-gold'
                          : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Banknote className="w-5 h-5" />
                      <span className="text-xs font-bold">پرداخت نقدی (صندوق)</span>
                    </button>

                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setPaymentMethod('ONLINE');
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                        paymentMethod === 'ONLINE'
                          ? 'bg-gradient-to-b from-blue-500/20 to-blue-500/5 border-blue-400 text-blue-300'
                          : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Sparkles className="w-5 h-5" />
                      <span className="text-xs font-bold">کارت‌به‌کارت / آنلاین</span>
                    </button>
                  </div>

                  {/* Settle Action Button */}
                  <button
                    disabled={isProcessing}
                    onClick={handleSettlePayment}
                    className="w-full py-3.5 px-4 rounded-xl text-sm font-black bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 hover:brightness-110 active:scale-[0.98] transition shadow-turquoise-glow flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    {isProcessing ? 'در حال صدور سند در دفتر کل...' : `تسویه کامل مبلغ ${formatPrice(activeInvoice.finalAmount)} و بستن فیش`}
                  </button>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                  <span>این صورتحساب تسویه شده و سند دوبل آن در دفتر مالی ثبت گردیده است.</span>
                  <span className="font-bold font-mono">وضعیت: بسته شد</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="khansalar-panel rounded-3xl p-12 text-center text-slate-500">
            <BotehJegheh size={56} className="mx-auto mb-3 opacity-40 text-slate-600" />
            <p>لطفاً یک فاکتور را از فهرست انتخاب فرمایید</p>
          </div>
        )}
      </div>
    </div>
  );
};
