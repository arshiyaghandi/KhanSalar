import React, { useState, useEffect } from 'react';
import type { KitchenTicket, KitchenStation, KitchenItemStatus } from '../types';
import { api } from '../services/api';
import { playKitchenAlertSound, playButtonSound } from '../utils/soundEffects';
import { BotehJegheh, EslimiBorderStrip } from './PersianSymbols';

const STATION_LABELS: { id: KitchenStation; title: string; icon: string }[] = [
  { id: 'ALL', title: 'همه ایستگاه‌ها', icon: '🏛️' },
  { id: 'GRILL', title: 'منقل و کباب‌پزی', icon: '🔥' },
  { id: 'KITCHEN', title: 'آشپزخانه گرم و دیزی', icon: '🍲' },
  { id: 'BAR', title: 'شربت‌خانه و نوشیدنی', icon: '🍷' },
  { id: 'DESSERT', title: 'دسر و شیرینی‌پزی', icon: '🍯' },
  { id: 'COLD', title: 'مزه و پیش‌غذا', icon: '🥗' },
];

export const KitchenDisplayView: React.FC = () => {
  const [station, setStation] = useState<KitchenStation>('ALL');
  const [tickets, setTickets] = useState<KitchenTicket[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTickets = async () => {
    try {
      const data = await api.getKitchenTickets(station);
      setTickets(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    const interval = setInterval(() => {
      setTickets((prev) =>
        prev.map((t) => ({
          ...t,
          elapsedMinutes: t.elapsedMinutes + 1,
        }))
      );
    }, 60000); // increase elapsed time every min
    return () => clearInterval(interval);
  }, [station]);

  const handleStatusChange = async (orderId: number, itemId: number, currentStatus: KitchenItemStatus) => {
    playButtonSound();
    const nextStatus: KitchenItemStatus =
      currentStatus === 'RECEIVED' ? 'PREPARING' : currentStatus === 'PREPARING' ? 'READY' : 'SERVED';

    await api.updateKitchenItemStatus(orderId, itemId, nextStatus);
    if (nextStatus === 'READY') {
      playKitchenAlertSound();
    }
    loadTickets();
  };

  const handleCompleteOrder = async (orderId: number) => {
    playKitchenAlertSound();
    await api.completeKitchenTicket(orderId);
    loadTickets();
  };

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      {/* Header & Station Selector */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-amber-500/30 p-5 shadow-2xl relative overflow-hidden">
        <EslimiBorderStrip className="absolute top-0 right-0 left-0 text-amber-500/20" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl text-amber-400">
              🍳
            </div>
            <div>
              <h2 className="text-xl font-bold text-amber-300 font-serif flex items-center gap-2">
                سیستم هوشمند سرآشپز و بار (KDS خوان‌سالار)
                <BotehJegheh className="w-4 h-5 text-amber-400 opacity-70" />
              </h2>
              <p className="text-xs text-slate-400">
                پایش لحظه‌ای خط پخت، اولویت سفارش‌ها، زمان‌بندی دقیق و ایستگاه‌های آماده‌سازی
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playKitchenAlertSound();
                loadTickets();
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-medium flex items-center gap-1.5 transition-all shadow-md"
            >
              <span>🔔 زنگ هشدار / بازخوانی</span>
            </button>
            <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono">
              تعداد تیکت‌های فعال: <span className="text-amber-400 font-bold">{tickets.length}</span>
            </span>
          </div>
        </div>

        {/* Station Filter Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-5">
          {STATION_LABELS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                playButtonSound();
                setStation(s.id);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                station === s.id
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60 hover:border-amber-500/40'
              }`}
            >
              <span>{s.icon}</span>
              <span>{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Ticket Grid */}
      {loading ? (
        <div className="py-20 text-center text-amber-400/70">در حال بارگزاری تیکت‌های آشپزخانه...</div>
      ) : tickets.length === 0 ? (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-12 text-center">
          <div className="text-5xl mb-3">✨</div>
          <h3 className="text-lg font-bold text-slate-300 mb-1">خط پخت خالی است!</h3>
          <p className="text-sm text-slate-400">تمام سفارش‌ها تحویل داده شده و سفارشی در صف انتظار نیست.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tickets.map((ticket) => {
            const isUrgent = ticket.elapsedMinutes >= 15;
            const isWarning = ticket.elapsedMinutes >= 10 && ticket.elapsedMinutes < 15;
            const isVip = ticket.priority === 'VIP';

            return (
              <div
                key={ticket.orderId}
                className={`rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative shadow-xl ${
                  isUrgent
                    ? 'bg-red-950/40 border-red-500/60 shadow-red-900/20'
                    : isVip
                    ? 'bg-amber-950/30 border-amber-500/50 shadow-amber-900/20'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Ticket Top bar */}
                <div
                  className={`px-4 py-3 border-b flex items-center justify-between ${
                    isUrgent
                      ? 'bg-red-900/50 border-red-500/40 text-red-200'
                      : isVip
                      ? 'bg-amber-600/30 border-amber-500/40 text-amber-200'
                      : 'bg-slate-800/80 border-slate-700/80 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-black text-base text-amber-300">{ticket.tableName}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10">
                      {ticket.tableNumber}
                    </span>
                    {isVip && (
                      <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded">
                        VIP سلطنتی
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                        isUrgent
                          ? 'bg-red-600 text-white animate-pulse'
                          : isWarning
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-700 text-slate-200'
                      }`}
                    >
                      <span>⏱️</span>
                      <span>{ticket.elapsedMinutes} دقیقه</span>
                    </span>
                  </div>
                </div>

                {/* Ticket Body */}
                <div className="p-4 flex-1 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                    <span>شماره سفارش: <span className="font-mono text-slate-300">{ticket.orderNumber}</span></span>
                    <span>مهماندار: <span className="text-slate-300">{ticket.serverName}</span></span>
                    <span>ساعت: <span className="font-mono text-slate-300">{ticket.orderTime}</span></span>
                  </div>

                  {ticket.notes && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-xs text-amber-300 flex items-start gap-2">
                      <span className="text-amber-400">📝</span>
                      <span>{ticket.notes}</span>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="space-y-2 mt-2">
                    {ticket.items.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                          item.status === 'READY'
                            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                            : item.status === 'PREPARING'
                            ? 'bg-amber-950/20 border-amber-500/30 text-amber-100'
                            : 'bg-slate-800/40 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 flex-1">
                          <span className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold flex items-center justify-center text-sm font-mono">
                            {item.quantity}×
                          </span>
                          <div>
                            <div className="font-medium text-sm text-slate-200">{item.itemName}</div>
                            {item.modifiers && item.modifiers.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.modifiers.map((m, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20"
                                  >
                                    {m}
                                  </span>
                                ))}
                              </div>
                            )}
                            {item.notes && (
                              <div className="text-[11px] text-amber-400/90 mt-0.5">یادداشت: {item.notes}</div>
                            )}
                          </div>
                        </div>

                        {/* Status Toggle Button */}
                        <button
                          onClick={() => handleStatusChange(ticket.orderId, item.id, item.status)}
                          className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
                            item.status === 'READY'
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                              : item.status === 'PREPARING'
                              ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                              : 'bg-slate-700/80 hover:bg-amber-600 text-slate-200 border-slate-600'
                          }`}
                        >
                          {item.status === 'RECEIVED' && 'شروع پخت ⏳'}
                          {item.status === 'PREPARING' && 'در حال پخت 🔥'}
                          {item.status === 'READY' && 'آماده سرو ✅'}
                          {item.status === 'SERVED' && 'تحویل شد ✨'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ticket Footer Action */}
                <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {ticket.items.filter((i) => i.status === 'READY').length} از {ticket.items.length} آیتم آماده است
                  </span>
                  <button
                    onClick={() => handleCompleteOrder(ticket.orderId)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                  >
                    <span>تحویل کل سینی به مهماندار</span>
                    <span>🍽️</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
