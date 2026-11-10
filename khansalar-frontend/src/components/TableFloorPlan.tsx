import { useState } from 'react';
import type { RestaurantTable } from '../types';
import { formatPrice, toPersianDigits } from '../utils/persianUtils';
import { soundManager } from '../utils/soundEffects';
import { 
  Users, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  Bookmark, 
  Timer, 
  BellRing,
  Crown
} from 'lucide-react';
import { CornerArabesque, ShamsehStar } from './GirihOrnament';
import { 
  BotehJegheh, 
  ShahAbbasiFlower, 
  PersianPomegranate, 
  SaffronFlower 
} from './PersianSymbols';

interface TableFloorPlanProps {
  tables: RestaurantTable[];
  onSelectTableForOrder: (tableId: number) => void;
  onViewInvoiceForTable: (tableName: string) => void;
}

export const TableFloorPlan: React.FC<TableFloorPlanProps> = ({
  tables,
  onSelectTableForOrder,
  onViewInvoiceForTable,
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [waiterCalledTable, setWaiterCalledTable] = useState<string | null>(null);

  const totalCapacity = tables.reduce((acc, t) => acc + t.capacity, 0);
  const occupiedTables = tables.filter((t) => t.status === 'OCCUPIED');
  const emptyTables = tables.filter((t) => t.status === 'EMPTY');
  const totalLiveSales = occupiedTables.reduce((acc, t) => acc + (t.activeOrderAmount || 0), 0);

  // Simulated elapsed times for active occupied tables
  const getElapsedTime = (tableId: number): string => {
    const times: Record<number, string> = {
      1: '۴۲ دقیقه',
      4: '۱ ساعت و ۱۵ دقیقه',
    };
    return times[tableId] || '۲۵ دقیقه';
  };

  const handleCallWaiter = (tableName: string) => {
    soundManager.playKitchenAlert();
    setWaiterCalledTable(tableName);
    setTimeout(() => setWaiterCalledTable(null), 3500);
  };

  const getTableSymbol = (table: RestaurantTable) => {
    if (table.title.includes('شاه‌نشین')) {
      return <BotehJegheh size={32} className="text-khansalar-gold drop-shadow-md" />;
    }
    if (table.title.includes('آب‌نما')) {
      return <PersianPomegranate size={30} className="text-rose-400 drop-shadow-md" />;
    }
    if (table.title.includes('حافظ')) {
      return <ShahAbbasiFlower size={30} className="text-amber-300 drop-shadow-md" />;
    }
    if (table.title.includes('سعدی')) {
      return <SaffronFlower size={30} className="text-purple-400 drop-shadow-md" />;
    }
    if (table.title.includes('مولانا')) {
      return <ShamsehStar size={30} className="text-khansalar-turquoise drop-shadow-md" />;
    }
    return <BotehJegheh size={28} className="text-khansalar-gold/70" />;
  };

  const filteredTables = tables.filter((t) => {
    if (selectedZone === 'ALL') return true;
    if (selectedZone === 'VIP') return t.title.includes('شاه‌نشین');
    if (selectedZone === 'GARDEN') return t.title.includes('آب‌نما') || t.title.includes('ایوان');
    if (selectedZone === 'HALL') return !t.title.includes('شاه‌نشین') && !t.title.includes('آب‌نما') && !t.title.includes('ایوان');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert for Waiter Call */}
      {waiterCalledTable && (
        <div className="fixed top-24 left-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-amber-500 text-slate-950 font-bold shadow-2xl border border-amber-300 animate-in slide-in-from-top-4">
          <BellRing className="w-5 h-5 animate-bounce" />
          <span>فراخوان مهماندار برای «{waiterCalledTable}» با موفقیت ارسال شد!</span>
        </div>
      )}

      {/* Top Ambience & Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="khansalar-panel rounded-2xl p-5 border border-khansalar-gold/20 relative overflow-hidden group">
          <CornerArabesque position="tr" className="text-khansalar-gold/20" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">کل ظرفیت پذیرایی سالن</span>
            <BotehJegheh size={24} className="text-khansalar-gold opacity-80" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-100">{toPersianDigits(tables.length)}</span>
            <span className="text-xs text-slate-400">میز ({toPersianDigits(totalCapacity)} نفر ظرفیت)</span>
          </div>
        </div>

        <div className="khansalar-panel rounded-2xl p-5 border border-emerald-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">میزهای خالی و آماده</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-300">{toPersianDigits(emptyTables.length)}</span>
            <span className="text-xs text-slate-400">میز آزاد جهت پذیرش</span>
          </div>
        </div>

        <div className="khansalar-panel rounded-2xl p-5 border border-amber-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">میزهای در حال پذیرایی</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-300">{toPersianDigits(occupiedTables.length)}</span>
            <span className="text-xs text-slate-400">میز فعال و باز</span>
          </div>
        </div>

        <div className="khansalar-panel rounded-2xl p-5 border border-khansalar-turquoise/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">مجموع سفارش‌های جاری سالن</span>
            <span className="p-2 rounded-xl bg-khansalar-turquoise/10 text-khansalar-turquoise border border-khansalar-turquoise/20">
              <span className="font-bold text-xs font-mono">تومان</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-khansalar-turquoise">
              {formatPrice(totalLiveSales)}
            </span>
          </div>
        </div>
      </div>

      {/* Zone Filters & Section Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <BotehJegheh size={20} className="text-khansalar-gold" />
          <h2 className="text-lg font-bold text-slate-100">بخش‌ها و جایگاه‌های پذیرایی خوان‌سالار</h2>
        </div>

        {/* Zone Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
          <button
            onClick={() => {
              soundManager.playClick();
              setSelectedZone('ALL');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
              selectedZone === 'ALL'
                ? 'bg-khansalar-gold text-slate-950 shadow-gold-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            همه بخش‌ها ({toPersianDigits(tables.length)})
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setSelectedZone('VIP');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              selectedZone === 'VIP'
                ? 'bg-amber-500 text-slate-950 shadow-gold-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-current" />
            شاه‌نشین سلطنتی
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setSelectedZone('HALL');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
              selectedZone === 'HALL'
                ? 'bg-khansalar-gold text-slate-950 shadow-gold-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            تالار حافظ و سعدی
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setSelectedZone('GARDEN');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
              selectedZone === 'GARDEN'
                ? 'bg-khansalar-gold text-slate-950 shadow-gold-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            حیاط سنتی و ایوان
          </button>
        </div>
      </div>

      {/* Grid of Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTables.map((table) => {
          const isOccupied = table.status === 'OCCUPIED';
          const isReserved = table.status === 'RESERVED';
          const isVIP = table.title.includes('شاه‌نشین');

          return (
            <div
              key={table.id}
              className={`relative rounded-3xl p-6 transition-all duration-300 border group ${
                isOccupied
                  ? 'bg-gradient-to-br from-[#12244a] to-[#0c1833] border-amber-500/50 shadow-gold-glow'
                  : isReserved
                  ? 'bg-[#0f1f3d] border-purple-500/30'
                  : 'bg-[#0a1835]/80 hover:bg-[#0e2147] border-slate-700/60 hover:border-khansalar-turquoise/50 hover:shadow-turquoise-glow'
              }`}
            >
              <CornerArabesque position="tr" className={isVIP ? "text-amber-400/30" : "text-khansalar-gold/15"} />

              {/* Top metadata */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-khansalar-gold font-bold px-2.5 py-0.5 rounded-lg bg-slate-900/80 border border-slate-700/60">
                    {table.tableNumber}
                  </span>
                  {isVIP && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <Crown className="w-3 h-3" />
                      شاه‌نشین سلطنتی
                    </span>
                  )}
                </div>

                {/* Status Badge */}
                <div>
                  {isOccupied && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                      <AlertCircle className="w-3 h-3" />
                      در حال پذیرایی
                    </span>
                  )}
                  {isReserved && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      <Bookmark className="w-3 h-3" />
                      رزرو شده
                    </span>
                  )}
                  {!isOccupied && !isReserved && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <CheckCircle2 className="w-3 h-3" />
                      آماده سفارش
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Cultural Symbol */}
              <div className="flex items-center justify-between mt-1">
                <div>
                  <h3 className="text-xl font-black text-amber-100 flex items-center gap-2">
                    {table.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-1.5">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-khansalar-gold" />
                      ظرفیت: {toPersianDigits(table.capacity)} نفر
                    </span>

                    {isOccupied && (
                      <span className="flex items-center gap-1 text-khansalar-turquoise font-medium">
                        <Timer className="w-3.5 h-3.5 animate-spin" />
                        مدت حضور: {getElapsedTime(table.id)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Persian Heritage Symbol Icon for this Table */}
                <div className="p-2 rounded-2xl bg-slate-900/60 border border-slate-700/40">
                  {getTableSymbol(table)}
                </div>
              </div>

              {/* Bill Details if Occupied */}
              {isOccupied && table.activeOrderAmount ? (
                <div className="mt-5 p-3.5 rounded-2xl bg-slate-950/60 border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">جمع سفارش باز:</span>
                    <span className="font-mono font-bold text-amber-300 text-sm">
                      {formatPrice(table.activeOrderAmount)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCallWaiter(table.title)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-700/60 transition"
                    title="فراخوان مهماندار برای این میز"
                  >
                    <BellRing className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="mt-5 p-3.5 rounded-2xl bg-slate-900/30 border border-slate-800 text-xs text-slate-400 text-center">
                  میز آماده خوش‌آمدگویی به مهمانان جدید است
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-5 flex gap-2.5">
                {isOccupied ? (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onViewInvoiceForTable(table.title);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-khansalar-turquoise to-teal-500 text-slate-950 hover:brightness-110 shadow-turquoise-glow transition flex items-center justify-center gap-2 active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    مشاهده صورتحساب و تسویه
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onSelectTableForOrder(table.id);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-khansalar-gold to-amber-500 text-slate-950 hover:brightness-110 shadow-gold-glow transition flex items-center justify-center gap-2 active:scale-98"
                  >
                    <PlusCircle className="w-4 h-4" />
                    ثبت سفارش جدید برای این میز
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
