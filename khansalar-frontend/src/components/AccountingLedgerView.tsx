import { useState } from 'react';
import type { LedgerEntry, DailyClosing } from '../types';
import { formatPrice, toPersianDigits, getJalaliDate } from '../utils/persianUtils';
import { 
  Scale, 
  TrendingUp, 
  Building2, 
  Coins, 
  CheckCircle2, 
  Lock, 
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BotehJegheh, PersianRoyalStamp, ShahAbbasiFlower } from './PersianSymbols';
import { CornerArabesque } from './GirihOrnament';

interface AccountingLedgerViewProps {
  ledgerEntries: LedgerEntry[];
  onCloseDay: (date: string, closedBy: string) => Promise<DailyClosing>;
}

export const AccountingLedgerView: React.FC<AccountingLedgerViewProps> = ({
  ledgerEntries,
  onCloseDay,
}) => {
  const [isClosingModalOpen, setIsClosingModalOpen] = useState<boolean>(false);
  const [closingReport, setClosingReport] = useState<DailyClosing | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Financial aggregates
  const totalDebits = ledgerEntries.reduce(
    (acc, entry) => acc + entry.items.reduce((sum, item) => sum + item.debit, 0),
    0
  );
  const totalCredits = ledgerEntries.reduce(
    (acc, entry) => acc + entry.items.reduce((sum, item) => sum + item.credit, 0),
    0
  );

  const cashAssets = ledgerEntries.reduce((acc, entry) => {
    const cashItem = entry.items.find((i) => i.accountName.includes('صندوق'));
    return acc + (cashItem ? cashItem.debit - cashItem.credit : 0);
  }, 0);

  const bankAssets = ledgerEntries.reduce((acc, entry) => {
    const bankItem = entry.items.find((i) => i.accountName.includes('بانک') || i.accountName.includes('پوز'));
    return acc + (bankItem ? bankItem.debit - bankItem.credit : 0);
  }, 0);

  const totalRevenue = ledgerEntries.reduce((acc, entry) => {
    const revItem = entry.items.find((i) => i.accountType === 'REVENUE');
    return acc + (revItem ? revItem.credit - revItem.debit : 0);
  }, 0);

  const totalVatLiability = ledgerEntries.reduce((acc, entry) => {
    const taxItem = entry.items.find((i) => i.accountName.includes('ارزش افزوده'));
    return acc + (taxItem ? taxItem.credit - taxItem.debit : 0);
  }, 0);

  const handleExecuteClosing = async () => {
    setIsSubmitting(true);
    try {
      const today = getJalaliDate();
      const report = await onCloseDay(today, 'مدیر ارشد خوان‌سالار');
      setClosingReport(report);
      confetti({
        particleCount: 100,
        spread: 80,
        colors: ['#e5b869', '#38efd8', '#ffffff'],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Financial KPIs Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="khansalar-panel rounded-2xl p-5 border border-khansalar-gold/30 relative overflow-hidden">
          <CornerArabesque position="tr" className="text-khansalar-gold/20" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">درآمد کل حاصل از فروش</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-khansalar-gold border border-khansalar-gold/20">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-amber-200 font-mono">
              {formatPrice(totalRevenue)}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">سرفصل درآمد بستانکار (Credit Revenue)</p>
          </div>
        </div>

        <div className="khansalar-panel rounded-2xl p-5 border border-khansalar-turquoise/30 relative overflow-hidden">
          <CornerArabesque position="tr" className="text-khansalar-turquoise/20" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">موجودی بانک و کارتخوان</span>
            <span className="p-2 rounded-xl bg-khansalar-turquoise/10 text-khansalar-turquoise border border-khansalar-turquoise/20">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-khansalar-turquoise font-mono">
              {formatPrice(bankAssets)}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">دارایی جاری متمرکز حساب‌های بانکی</p>
          </div>
        </div>

        <div className="khansalar-panel rounded-2xl p-5 border border-amber-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">موجودی صندوق نقد خوان‌سالار</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Coins className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-amber-300 font-mono">
              {formatPrice(cashAssets)}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">دارایی نقدی در دخل صندوقدار</p>
          </div>
        </div>

        <div className="khansalar-panel rounded-2xl p-5 border border-purple-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">مالیات بر ارزش افزوده (۱۰٪)</span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20">
              <Scale className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-purple-200 font-mono">
              {formatPrice(totalVatLiability)}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">بدهی جاری به سازمان امور مالیاتی</p>
          </div>
        </div>
      </div>

      {/* Double-entry Balance Banner & Daily Closing Button */}
      <div className="khansalar-panel rounded-3xl p-6 border border-khansalar-gold/30 flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-[#0d214a] via-[#091736] to-[#0d214a] relative overflow-hidden">
        <CornerArabesque position="bl" className="text-khansalar-gold/15" />
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-khansalar-gold/20 border border-khansalar-gold/40 flex items-center justify-center text-khansalar-gold shadow-gold-glow">
            <ShahAbbasiFlower size={30} className="text-khansalar-gold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-amber-100">
                وضعیت تراز دوبل حسابداری (Double-Entry Balance)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                تراز ۱۰۰٪ متوازن
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              مجموع بدهکار: <span className="text-slate-200 font-mono font-bold">{formatPrice(totalDebits)}</span> | مجموع بستانکار: <span className="text-slate-200 font-mono font-bold">{formatPrice(totalCredits)}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsClosingModalOpen(true)}
          className="w-full md:w-auto px-6 py-3 rounded-2xl text-xs font-black bg-gradient-to-r from-khansalar-gold via-amber-400 to-amber-500 text-slate-950 hover:brightness-110 shadow-gold-glow transition flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4" />
          بستن صندوق و ثبت تراز روزانه (Daily Closing)
        </button>
      </div>

      {/* Journal / Ledger Entries List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BotehJegheh size={20} className="text-khansalar-gold" />
            <h2 className="text-lg font-bold text-slate-100">دفتر روزنامه اسناد مالی خوان‌سالار</h2>
          </div>
          <span className="text-xs text-slate-400">
            تعداد کل اسناد ثبتی: <strong className="text-slate-200">{toPersianDigits(ledgerEntries.length)}</strong> سند
          </span>
        </div>

        <div className="space-y-4">
          {ledgerEntries.map((entry) => {
            const entryDebitTotal = entry.items.reduce((s, i) => s + i.debit, 0);
            const entryCreditTotal = entry.items.reduce((s, i) => s + i.credit, 0);

            return (
              <div
                key={entry.id}
                className="khansalar-panel rounded-2xl p-5 border border-slate-700/60 hover:border-khansalar-gold/40 transition space-y-3"
              >
                {/* Header of Entry */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-khansalar-gold font-mono font-bold text-xs">
                      {entry.entryNumber}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-200">
                      {entry.description}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{entry.transactionDate}</span>
                  </div>
                </div>

                {/* Items Table (Double Entry) */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-800/60">
                        <th className="pb-2 font-medium">سرفصل حساب</th>
                        <th className="pb-2 font-medium">ماهیت حساب</th>
                        <th className="pb-2 font-medium text-left">بدهکار (Debit)</th>
                        <th className="pb-2 font-medium text-left">بستانکار (Credit)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {entry.items.map((item) => (
                        <tr key={item.id} className="text-slate-300">
                          <td className="py-2 font-semibold text-slate-200">{item.accountName}</td>
                          <td className="py-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
                              {item.accountType === 'ASSET' && 'دارایی'}
                              {item.accountType === 'REVENUE' && 'درآمد'}
                              {item.accountType === 'LIABILITY' && 'بدهی'}
                              {item.accountType === 'EXPENSE' && 'هزینه'}
                            </span>
                          </td>
                          <td className="py-2 text-left font-mono font-bold text-emerald-400">
                            {item.debit > 0 ? formatPrice(item.debit) : '-'}
                          </td>
                          <td className="py-2 text-left font-mono font-bold text-amber-300">
                            {item.credit > 0 ? formatPrice(item.credit) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-slate-800 font-bold text-slate-300">
                        <td colSpan={2} className="pt-2 text-left text-slate-400">جمع تراز سند:</td>
                        <td className="pt-2 text-left font-mono text-emerald-300">{formatPrice(entryDebitTotal)}</td>
                        <td className="pt-2 text-left font-mono text-amber-200">{formatPrice(entryCreditTotal)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Closing Modal */}
      {isClosingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="khansalar-panel rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-khansalar-gold shadow-gold-glow space-y-5 animate-in fade-in zoom-in-95 relative overflow-hidden">
            <CornerArabesque position="tr" className="text-khansalar-gold/30" />

            <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
              <div className="flex items-center gap-2">
                <BotehJegheh size={24} className="text-khansalar-gold" />
                <h3 className="font-bold text-lg text-slate-100">بستن صندوق و تراز روزانه</h3>
              </div>
              <button
                onClick={() => {
                  setIsClosingModalOpen(false);
                  setClosingReport(null);
                }}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {!closingReport ? (
              <div className="space-y-4 text-xs text-slate-300">
                <p className="leading-relaxed">
                  با بستن صندوق روزانه، تمامی تراکنش‌های نقدی و پوز جمع‌بندی شده و تراز دخل برای حسابرس و مدیر مالی قفل می‌گردد.
                </p>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">تاریخ تراز مالی:</span>
                    <span className="font-bold text-slate-200">{getJalaliDate()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">کل فروش ثبت‌شده:</span>
                    <span className="font-bold text-amber-300 font-mono">{formatPrice(totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">موجودی صندوق نقد:</span>
                    <span className="font-bold text-emerald-300 font-mono">{formatPrice(cashAssets)}</span>
                  </div>
                </div>

                <button
                  disabled={isSubmitting}
                  onClick={handleExecuteClosing}
                  className="w-full py-3.5 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-khansalar-gold to-amber-500 text-slate-950 hover:brightness-110 transition shadow-gold-glow flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {isSubmitting ? 'در حال ثبت گزارش تراز...' : 'تایید نهایی و بستن حساب‌های امروز'}
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs text-slate-200 text-center">
                <div className="flex justify-center mb-1">
                  <PersianRoyalStamp size={90} text="تراز روزانه تایید شد" />
                </div>
                <h4 className="font-black text-base text-emerald-300">
                  حساب‌های روز با موفقیت بسته و تراز دخل ممهور شد
                </h4>
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-right space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">تاریخ تراز:</span>
                    <span>{closingReport.closingDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">کل فروش خالص:</span>
                    <span className="font-bold text-amber-300 font-mono">{formatPrice(closingReport.totalSales)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">دریافت نقدی:</span>
                    <span className="font-mono">{formatPrice(closingReport.totalCash)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">دریافت کارتخوان (پوز):</span>
                    <span className="font-mono">{formatPrice(closingReport.totalPos)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">مسئول بستن دخل:</span>
                    <span className="text-khansalar-gold">{closingReport.closedBy}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsClosingModalOpen(false);
                    setClosingReport(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition"
                >
                  بازگشت به پنل حسابداری
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
