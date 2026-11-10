import React, { useState, useEffect } from 'react';
import type { Customer, CustomerTier } from '../types';
import { api } from '../services/api';
import { playCashSound, playButtonSound } from '../utils/soundEffects';
import { PersianRoyalStamp, ShahAbbasiFlower, EslimiBorderStrip } from './PersianSymbols';

const TIER_BADGES: Record<CustomerTier, { label: string; color: string; bg: string; border: string }> = {
  PLATINUM: { label: 'پلاتین سلطنتی', color: 'text-indigo-200', bg: 'bg-indigo-950/60', border: 'border-indigo-400' },
  GOLD: { label: 'طلایی زرین', color: 'text-amber-300', bg: 'bg-amber-950/60', border: 'border-amber-400' },
  SILVER: { label: 'نقره‌ای سیمین', color: 'text-slate-200', bg: 'bg-slate-800/80', border: 'border-slate-400' },
  BRONZE: { label: 'برنزی', color: 'text-amber-600', bg: 'bg-amber-950/30', border: 'border-amber-700' },
};

export const CustomersView: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // New Customer Modal
  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCustomers = async (query?: string) => {
    try {
      const data = await api.getCustomers(query);
      setCustomers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers(searchQuery);
  }, [searchQuery]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber) return;
    setIsSubmitting(true);
    try {
      playCashSound();
      await api.registerCustomer({ fullName, phoneNumber, birthDate, notes });
      setShowModal(false);
      setFullName('');
      setPhoneNumber('');
      setBirthDate('');
      setNotes('');
      loadCustomers();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSpentAll = customers.reduce((acc, c) => acc + c.totalSpent, 0);
  const totalPointsAll = customers.reduce((acc, c) => acc + c.loyaltyPoints, 0);

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      {/* Banner */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-amber-500/30 p-5 shadow-2xl relative overflow-hidden">
        <EslimiBorderStrip className="absolute top-0 right-0 left-0 text-amber-500/20" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl text-amber-400">
              👑
            </div>
            <div>
              <h2 className="text-xl font-bold text-amber-300 font-serif flex items-center gap-2">
                باشگاه مشتریان و مدیریت وفاداری (CRM خوان‌سالار)
                <ShahAbbasiFlower className="w-5 h-5 text-amber-400 opacity-80" />
              </h2>
              <p className="text-xs text-slate-400">
                پروفایل جامع مشتریان، امتیازدهی خودکار سفارش‌ها، سطح‌بندی برنزی تا سلطنتی و تاریخچه مراجعه
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playButtonSound();
                setShowModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <span>➕ عضویت مشتری جدید (۵۰ امتیاز هدیه)</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800">
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
            <div className="text-[11px] text-slate-400">کل اعضای باشگاه</div>
            <div className="text-lg font-bold text-amber-300 font-mono mt-0.5">{customers.length} نفر</div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
            <div className="text-[11px] text-slate-400">مجموع خرید اعضا</div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
              {totalSpentAll.toLocaleString('fa-IR')} <span className="text-xs font-normal">تومان</span>
            </div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
            <div className="text-[11px] text-slate-400">امتیازات فعال باشگاه</div>
            <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">
              {totalPointsAll.toLocaleString('fa-IR')} <span className="text-xs font-normal">امتیاز</span>
            </div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
            <div className="text-[11px] text-slate-400">اعضای ویژه VIP و طلایی</div>
            <div className="text-lg font-bold text-indigo-300 font-mono mt-0.5">
              {customers.filter((c) => c.tier === 'PLATINUM' || c.tier === 'GOLD').length} نفر
            </div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="جستجوی سریع مشتری با شماره موبایل یا نام..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 focus:border-amber-500 rounded-2xl px-4 py-3 text-xs text-slate-200 outline-none shadow-lg transition-all"
          />
          <span className="absolute left-4 top-3.5 text-slate-400 text-sm">🔍</span>
        </div>
      </div>

      {/* Customer Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-amber-400/70">در حال جستجوی پرونده مشتریان...</div>
      ) : customers.length === 0 ? (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-12 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-base font-bold text-slate-300 mb-1">مشتری مورد نظر یافت نشد</h3>
          <p className="text-xs text-slate-400">می‌توانید با دکمه بالا مشتری جدید را در سامانه ثبت کنید.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {customers.map((c) => {
            const badge = TIER_BADGES[c.tier];
            return (
              <div
                key={c.id}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-amber-500/50 p-5 shadow-xl transition-all relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-serif font-bold text-base text-slate-100 flex items-center gap-2">
                        <span>{c.fullName}</span>
                      </h3>
                      <div className="text-xs font-mono text-amber-400/90 mt-1">{c.phoneNumber}</div>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${badge.bg} ${badge.color} ${badge.border}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {/* Notes / Special perks */}
                  {c.notes && (
                    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 mb-3">
                      {c.notes}
                    </div>
                  )}

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-800/40 rounded-xl p-3 border border-slate-800 text-center text-xs mb-3">
                    <div>
                      <div className="text-[10px] text-slate-400">امتیاز وفاداری</div>
                      <div className="font-mono font-bold text-amber-400 mt-0.5">{c.loyaltyPoints}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">تعداد دفعات</div>
                      <div className="font-mono font-bold text-slate-200 mt-0.5">{c.totalVisits} بار</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">مجموع خرید</div>
                      <div className="font-mono font-bold text-emerald-400 text-[11px] mt-0.5">
                        {c.totalSpent.toLocaleString('fa-IR')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-500">آخرین مراجعه: {c.lastVisit || '-'}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => alert(`ارسال پیامک تبریک و تخفیف به شماره ${c.phoneNumber}`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700"
                    >
                      💬 پیامک
                    </button>
                    <button
                      onClick={() => alert(`کیف پول اعتباری ${c.fullName}: ${c.walletBalance.toLocaleString('fa-IR')} تومان`)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] border border-amber-500/40"
                    >
                      💳 شارژ کیف پول
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="font-serif font-bold text-base text-amber-300 flex items-center gap-2">
                <span>عضویت مشتری در باشگاه خوان‌سالار</span>
                <PersianRoyalStamp className="w-6 h-6 text-amber-400" />
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">نام و نام خانوادگی:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: دکتر علیرضا افشار"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">شماره تلفن همراه:</label>
                <input
                  type="tel"
                  required
                  placeholder="0912..."
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-200 font-mono outline-none focus:border-amber-400 text-left"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">تاریخ تولد (جهت ارسال کد تخفیف تولد):</label>
                <input
                  type="text"
                  placeholder="۱۳۶۵/۰۴/۱۵"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-200 font-mono outline-none focus:border-amber-400 text-left"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">توضیحات و ذائقه خاص مشتری:</label>
                <textarea
                  rows={2}
                  placeholder="ترجیحات خاص میزبانی، میز مورد علاقه، حساسیت‌های غذایی..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-amber-400"
                />
              </div>

              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 text-emerald-200 text-xs">
                🎁 به محض ثبت نام، ۵۰ امتیاز خوش‌آمدگویی خوان‌سالار به کیف پول مشتری واریز می‌شود.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-lg"
                >
                  {isSubmitting ? 'در حال ثبت...' : 'تأیید و صدور کارت باشگاه'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
