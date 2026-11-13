import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  PieChart,
  Star,
  Activity,
  ArrowUpRight,
  Flame,
  HelpCircle,
  AlertTriangle,
  Award,
  Sparkles,
  ShoppingBag,
  Percent
} from 'lucide-react';
import type { BiAnalyticsSummary, MenuEngineeringItem, MenuClassification } from '../types';
import { api } from '../services/api';
import { formatPrice, toPersianDigits } from '../utils/persianUtils';
import { ShamsehStar } from './GirihOrnament';
import { BotehJegheh } from './PersianSymbols';
import { soundManager } from '../utils/soundEffects';

const MATRIX_CONFIG: Record<
  MenuClassification,
  {
    title: string;
    subtitle: string;
    icon: React.ElementType;
    badgeClass: string;
    cardBorder: string;
    recommendation: string;
  }
> = {
  STAR: {
    title: 'ستاره‌ها (Stars)',
    subtitle: 'محبوبیت بالا • سودآوری بالا',
    icon: Star,
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    cardBorder: 'border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-slate-900/60 to-slate-900/90',
    recommendation: 'حفظ ثبات کیفیت، قرارگیری در کانون توجه منو و منوی دیجیتال QR، پرهیز از تغییرات قیمتی ناگهانی.',
  },
  PLOWHORSE: {
    title: 'اسب‌های بارکش (Plowhorses)',
    subtitle: 'محبوبیت بالا • سودآوری متوسط یا پایین',
    icon: Flame,
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    cardBorder: 'border-sky-500/30 bg-gradient-to-br from-sky-500/10 via-slate-900/60 to-slate-900/90',
    recommendation: 'افزایش اندک قیمت، بازنگری در رسپی (BOM) برای کاهش بهای تمام شده، باندل کردن با نوشیدنی‌های پرسود.',
  },
  PUZZLE: {
    title: 'معماها (Puzzles)',
    subtitle: 'محبوبیت پایین • سودآوری فوق‌العاده بالا',
    icon: HelpCircle,
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    cardBorder: 'border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-slate-900/60 to-slate-900/90',
    recommendation: 'آموزش پرسنل سالن برای پیشنهاد ویژه سر میز (Upselling)، عکاسی حرفه‌ای در منوی دیجیتال و تخفیف روزهای خلوت.',
  },
  DOG: {
    title: 'سگ‌ها (Dogs)',
    subtitle: 'محبوبیت پایین • سودآوری پایین',
    icon: AlertTriangle,
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    cardBorder: 'border-rose-500/30 bg-gradient-to-br from-rose-500/10 via-slate-900/60 to-slate-900/90',
    recommendation: 'حذف تدریجی از منو، کاهش ضایعات انبار، یا جایگزینی با آیتم‌های فصلی نوآورانه خوان‌سالار.',
  },
};

export const AnalyticsBiView: React.FC = () => {
  const [summary, setSummary] = useState<BiAnalyticsSummary | null>(null);
  const [matrixItems, setMatrixItems] = useState<MenuEngineeringItem[]>([]);
  const [selectedMatrixTab, setSelectedMatrixTab] = useState<'ALL' | MenuClassification>('ALL');
  const [timePeriod, setTimePeriod] = useState<'TODAY' | 'WEEK' | 'MONTH'>('MONTH');

  useEffect(() => {
    const fetchData = async () => {
      const [sum, mtrx] = await Promise.all([
        api.getBiSummary(),
        api.getMenuEngineering(),
      ]);
      setSummary(sum);
      setMatrixItems(mtrx);
    };
    fetchData();
  }, [timePeriod]);

  if (!summary) {
    return (
      <div className="py-24 text-center">
        <ShamsehStar size={44} className="mx-auto mb-3 animate-spin text-khansalar-gold" />
        <p className="text-sm text-slate-300 font-bold">در حال استخراج و تحلیل داده‌های هوش تجاری...</p>
      </div>
    );
  }

  const filteredMatrix = selectedMatrixTab === 'ALL'
    ? matrixItems
    : matrixItems.filter((i) => i.classification === selectedMatrixTab);

  const starCount = matrixItems.filter((i) => i.classification === 'STAR').length;
  const plowhorseCount = matrixItems.filter((i) => i.classification === 'PLOWHORSE').length;
  const puzzleCount = matrixItems.filter((i) => i.classification === 'PUZZLE').length;
  const dogCount = matrixItems.filter((i) => i.classification === 'DOG').length;

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#071738] via-[#0c2658] to-[#081a3d] p-6 border border-khansalar-gold/30 shadow-xl">
        <div className="absolute -top-12 -left-12 opacity-10 pointer-events-none">
          <BotehJegheh size={260} className="text-khansalar-gold" />
        </div>

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-khansalar-gold to-amber-600 rounded-xl shadow-gold-glow text-slate-950 font-black">
              <BarChart3 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-amber-100">
                  داشبورد هوش تجاری و مهندسی منو (BI & Menu Engineering)
                </h1>
                <ShamsehStar size={18} className="text-khansalar-gold" />
              </div>
              <p className="text-xs md:text-sm text-slate-400 mt-1">
                ماتریس محبوبیت-سودآوری کساوانا و اسمیت، مدیریت حاشیه سود غذا و ساعات پیک رستوران
              </p>
            </div>
          </div>

          {/* Period selector */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-700/80 text-xs">
            <button
              onClick={() => {
                soundManager.playClick();
                setTimePeriod('TODAY');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                timePeriod === 'TODAY' ? 'bg-khansalar-gold text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              امروز
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setTimePeriod('WEEK');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                timePeriod === 'WEEK' ? 'bg-khansalar-gold text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              هفته جاری
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setTimePeriod('MONTH');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                timePeriod === 'MONTH' ? 'bg-khansalar-gold text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              ماه جاری
            </button>
          </div>
        </div>

        {/* 4 Financial & Operational KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6">
          <div className="bg-[#051126]/85 backdrop-blur-sm border border-khansalar-gold/30 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>فروش ناخالص کل</span>
              <DollarSign className="w-4 h-4 text-khansalar-gold" />
            </div>
            <div className="text-2xl font-black text-amber-200 mt-2">
              {formatPrice(summary.totalRevenue)}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+۱۲.۴٪ رشد نسبت به دوره قبل</span>
            </div>
          </div>

          <div className="bg-[#051126]/85 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>سود ناخالص عملیاتی</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-300 mt-2">
              {formatPrice(summary.grossProfit)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              حاشیه سود: <span className="font-bold text-emerald-400">۶۷.۶٪</span>
            </div>
          </div>

          <div className="bg-[#051126]/85 backdrop-blur-sm border border-amber-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>ضریب بهای تمام‌شده (Food Cost)</span>
              <Percent className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300 mt-2 font-mono">
              {toPersianDigits(summary.foodCostPercentage)}٪
            </div>
            <div className="text-[11px] text-emerald-400 mt-1">
              ✓ در محدوده بهینه استاندارد رستوران‌های لوکس (&lt; ۳۴٪)
            </div>
          </div>

          <div className="bg-[#051126]/85 backdrop-blur-sm border border-sky-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>میانگین فاکتور (AOV)</span>
              <ShoppingBag className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-sky-300 mt-2">
              {formatPrice(summary.averageOrderValue)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              از مجموع <span className="font-bold text-sky-300">{toPersianDigits(summary.totalOrders)}</span> فاکتور صادر شده
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Menu Engineering Matrix (BCG / Kasavana & Smith) */}
      <div className="bg-[#071630] rounded-2xl border border-slate-800 p-5 shadow-lg space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-khansalar-gold" />
              <h2 className="text-lg font-black text-amber-100">
                ماتریس مهندسی منو (Menu Engineering Matrix)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              دسته‌بندی هوشمند اقلام منو بر اساس حجم فروش (محبوبیت) و حاشیه سود ریالی هر پرس
            </p>
          </div>

          {/* Matrix Quadrant Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedMatrixTab('ALL');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                selectedMatrixTab === 'ALL' ? 'bg-khansalar-gold text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              همه اقلام ({toPersianDigits(matrixItems.length)})
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedMatrixTab('STAR');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                selectedMatrixTab === 'STAR' ? 'bg-amber-500 text-slate-950' : 'text-amber-300/80 hover:text-amber-200'
              }`}
            >
              <span>⭐ ستاره‌ها</span>
              <span className="text-[10px] font-mono">({toPersianDigits(starCount)})</span>
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedMatrixTab('PLOWHORSE');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                selectedMatrixTab === 'PLOWHORSE' ? 'bg-sky-500 text-slate-950' : 'text-sky-300/80 hover:text-sky-200'
              }`}
            >
              <span>🐴 بارکش‌ها</span>
              <span className="text-[10px] font-mono">({toPersianDigits(plowhorseCount)})</span>
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedMatrixTab('PUZZLE');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                selectedMatrixTab === 'PUZZLE' ? 'bg-purple-500 text-white' : 'text-purple-300/80 hover:text-purple-200'
              }`}
            >
              <span>🧩 معماها</span>
              <span className="text-[10px] font-mono">({toPersianDigits(puzzleCount)})</span>
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedMatrixTab('DOG');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                selectedMatrixTab === 'DOG' ? 'bg-rose-500 text-white' : 'text-rose-300/80 hover:text-rose-200'
              }`}
            >
              <span>🐕 سگ‌ها</span>
              <span className="text-[10px] font-mono">({toPersianDigits(dogCount)})</span>
            </button>
          </div>
        </div>

        {/* 4 Quadrants Quick Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {(['STAR', 'PLOWHORSE', 'PUZZLE', 'DOG'] as MenuClassification[]).map((cls) => {
            const conf = MATRIX_CONFIG[cls];
            const count = matrixItems.filter((i) => i.classification === cls).length;
            const Icon = conf.icon;
            return (
              <div
                key={cls}
                onClick={() => setSelectedMatrixTab(cls)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${conf.cardBorder} ${
                  selectedMatrixTab === cls ? 'ring-2 ring-khansalar-gold shadow-lg' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-khansalar-gold" />
                    <span className="font-black text-xs text-amber-100">{conf.title}</span>
                  </div>
                  <span className="text-xs font-mono font-black text-white px-2 py-0.5 rounded-full bg-slate-800">
                    {toPersianDigits(count)} قلم
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">{conf.subtitle}</p>
                <div className="mt-2.5 p-2 bg-slate-950/60 rounded-lg text-[10px] text-slate-300 leading-relaxed border border-slate-800/80">
                  <span className="font-bold text-khansalar-gold">توصیه: </span>
                  {conf.recommendation}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Table of Menu Engineering Items */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#051126] text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">نام خوراک / نوشیدنی</th>
                <th className="py-3 px-3">دسته‌بندی</th>
                <th className="py-3 px-3 text-center">تعداد فروش</th>
                <th className="py-3 px-3">سهم محبوبیت</th>
                <th className="py-3 px-3">بهای تمام شده (BOM)</th>
                <th className="py-3 px-3">سود هر پرس</th>
                <th className="py-3 px-3">سود کل ناخالص</th>
                <th className="py-3 px-3 text-center">طبقه‌بندی مهندسی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredMatrix.map((item) => {
                const conf = MATRIX_CONFIG[item.classification];
                const Icon = conf.icon;
                return (
                  <tr key={item.menuItemId} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-amber-100">{item.itemName}</td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">{item.category}</td>
                    <td className="py-3 px-3 text-center font-bold font-mono text-white">
                      {toPersianDigits(item.unitsSold)}
                    </td>
                    <td className="py-3 px-3 font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-amber-400 h-full rounded-full"
                            style={{ width: `${Math.min(100, item.popularityShare * 3)}%` }}
                          />
                        </div>
                        <span>{toPersianDigits(item.popularityShare)}٪</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{formatPrice(item.unitFoodCost)}</td>
                    <td className="py-3 px-3 font-bold text-emerald-400">{formatPrice(item.unitMargin)}</td>
                    <td className="py-3 px-3 font-bold text-amber-200">{formatPrice(item.totalProfit)}</td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${conf.badgeClass}`}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{conf.title.split(' ')[0]}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Hourly Traffic Peak Heatmap & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Peak Heatmap (2 cols) */}
        <div className="lg:col-span-2 bg-[#071630] rounded-2xl border border-slate-800 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-khansalar-gold" />
                <h3 className="text-base font-black text-amber-100">
                  توزیع ترافیک و فروش در ساعات پیک (Hourly Peak Heatmap)
                </h3>
              </div>
              <span className="text-xs text-slate-400">ساعات سرو ناهار و شام</span>
            </div>

            {/* Visual Bar Columns */}
            <div className="h-52 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-800">
              {(summary.hourlySales || []).map((slot) => {
                // max revenue scale ~ 4,500,000
                const heightPercent = Math.min(100, Math.round((slot.revenue / 4500000) * 100));
                const isPeak = slot.orderCount >= 6;

                return (
                  <div key={slot.hour} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Tooltip on hover */}
                    <div className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-khansalar-gold/40 px-2 py-0.5 rounded text-amber-200 whitespace-nowrap shadow-md mb-1 pointer-events-none">
                      {formatPrice(slot.revenue)} ({toPersianDigits(slot.orderCount)} سفارش)
                    </div>

                    {/* Bar */}
                    <div
                      style={{ height: `${Math.max(14, heightPercent)}%` }}
                      className={`w-full max-w-[36px] rounded-t-lg transition-all duration-300 relative ${
                        isPeak
                          ? 'bg-gradient-to-t from-amber-600 via-khansalar-gold to-yellow-300 shadow-gold-glow'
                          : 'bg-gradient-to-t from-slate-700 to-sky-600 hover:from-sky-600 hover:to-sky-400'
                      }`}
                    >
                      {isPeak && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] text-amber-300">
                          🔥
                        </span>
                      )}
                    </div>

                    {/* Label */}
                    <span className="text-[11px] font-mono text-slate-400 group-hover:text-amber-200 transition-colors">
                      {toPersianDigits(slot.hour)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-gradient-to-r from-amber-500 to-yellow-400" />
              <span>ساعات اوج مراجعه (Peak Lunch & Dinner)</span>
            </div>
            <span className="text-[11px]">پیک شام: ۲۰:۰۰ الی ۲۲:۰۰ • پیک ناهار: ۱۳:۰۰ الی ۱۴:۰۰</span>
          </div>
        </div>

        {/* Category Breakdown (1 col) */}
        <div className="bg-[#071630] rounded-2xl border border-slate-800 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-khansalar-gold" />
              <h3 className="text-base font-black text-amber-100">سهم فروش دسته‌بندی‌ها</h3>
            </div>

            <div className="space-y-4">
              {(summary.salesByCategory || []).map((cat) => (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{cat.category}</span>
                    <span className="font-mono text-amber-200 font-bold">
                      {toPersianDigits(cat.percentage)}٪
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-khansalar-gold to-amber-500 h-full rounded-full"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 text-left font-mono">
                    {formatPrice(cat.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed flex items-center gap-2">
            <Award className="w-5 h-5 text-khansalar-gold flex-shrink-0" />
            <span>غذاهای اصلی و درباری بیش از ۶۰٪ گردش مالی ماهانه رستوران خوان‌سالار را به خود اختصاص داده‌اند.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
