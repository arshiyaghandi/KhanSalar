import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Plus,
  Users,
  Clock,
  Sparkles,
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  Search,
  Filter,
  DollarSign,
  Utensils,
  PartyPopper,
  Briefcase,
  Heart,
  Crown
} from 'lucide-react';
import type { Reservation, ReservationStatus, OccasionType, RestaurantTable } from '../types';
import { api } from '../services/api';
import { formatPrice, toPersianDigits } from '../utils/persianUtils';
import { soundManager } from '../utils/soundEffects';
import { ShamsehStar } from './GirihOrnament';
import { BotehJegheh } from './PersianSymbols';

interface ReservationViewProps {
  tables: RestaurantTable[];
  onReservationUpdated?: () => void;
}

const OCCASION_CONFIG: Record<OccasionType, { label: string; icon: React.ElementType; color: string; badge: string }> = {
  VIP: {
    label: 'مهمان VIP و سلطنتی',
    icon: Crown,
    color: 'from-amber-500/20 to-yellow-500/20 text-khansalar-gold border-khansalar-gold/40',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  BIRTHDAY: {
    label: 'جشن تولد',
    icon: PartyPopper,
    color: 'from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/40',
    badge: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
  },
  BUSINESS: {
    label: 'جلسه کاری و تجاری',
    icon: Briefcase,
    color: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/40',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  },
  ANNIVERSARY: {
    label: 'سالگرد و مناسبت خاص',
    icon: Heart,
    color: 'from-purple-500/20 to-fuchsia-500/20 text-purple-400 border-purple-500/40',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  },
  NORMAL: {
    label: 'پذیرایی عمومی',
    icon: Utensils,
    color: 'from-slate-700/40 to-slate-800/40 text-slate-300 border-slate-600/40',
    badge: 'bg-slate-700/50 text-slate-300 border-slate-600',
  },
};

const STATUS_CONFIG: Record<ReservationStatus, { label: string; color: string; icon: React.ElementType }> = {
  CONFIRMED: { label: 'تأیید شده', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', icon: CheckCircle2 },
  PENDING: { label: 'در انتظار بیعانه', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: HelpCircle },
  SEATED: { label: 'مستقر در سالن', color: 'bg-sky-500/20 text-sky-300 border-sky-500/40', icon: Utensils },
  CANCELLED: { label: 'لغو شده', color: 'bg-red-500/20 text-red-400 border-red-500/40', icon: XCircle },
  NO_SHOW: { label: 'عدم مراجعه', color: 'bg-slate-600/30 text-slate-400 border-slate-600/50', icon: AlertCircle },
};

export const ReservationView: React.FC<ReservationViewProps> = ({ tables, onReservationUpdated }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [partySize, setPartySize] = useState<number>(4);
  const [tableId, setTableId] = useState<number>(tables[0]?.id || 1);
  const [reservationTime, setReservationTime] = useState('1403/08/21 20:30');
  const [occasion, setOccasion] = useState<OccasionType>('VIP');
  const [depositAmount, setDepositAmount] = useState<number>(500000);
  const [depositPaid, setDepositPaid] = useState<boolean>(true);
  const [specialRequests, setSpecialRequests] = useState('');
  const [notes, setNotes] = useState('');

  const loadReservations = async () => {
    const list = await api.getReservations();
    setReservations(list);
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleStatusChange = async (id: number, newStatus: ReservationStatus) => {
    soundManager.playClick();
    await api.updateReservationStatus(id, newStatus);
    await loadReservations();
    if (onReservationUpdated) onReservationUpdated();
  };

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phoneNumber) return;
    setIsSubmitting(true);
    soundManager.playCashRegister();

    try {
      const selectedTable = tables.find((t) => t.id === tableId);
      await api.createReservation({
        customerName,
        phoneNumber,
        partySize,
        tableId,
        tableNumber: selectedTable?.tableNumber,
        reservationTime,
        occasion,
        depositAmount,
        depositPaid,
        specialRequests,
        notes,
        status: depositPaid ? 'CONFIRMED' : 'PENDING',
      });

      setShowModal(false);
      resetForm();
      await loadReservations();
      if (onReservationUpdated) onReservationUpdated();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'خطا در ثبت رزرواسیون';
      console.error('Error creating reservation:', err);
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCustomerName('');
    setPhoneNumber('');
    setPartySize(4);
    setSpecialRequests('');
    setNotes('');
    setDepositAmount(500000);
    setDepositPaid(true);
  };

  // Filter reservations
  const filtered = reservations.filter((r) => {
    const matchesSearch =
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phoneNumber.includes(searchQuery) ||
      r.reservationNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
    const matchesOccasion = selectedOccasion === 'ALL' || r.occasion === selectedOccasion;
    return matchesSearch && matchesStatus && matchesOccasion;
  });

  // KPI Stats
  const totalReservations = reservations.length;
  const confirmedCount = reservations.filter((r) => r.status === 'CONFIRMED').length;
  const seatedCount = reservations.filter((r) => r.status === 'SEATED').length;
  const totalDeposits = reservations
    .filter((r) => r.depositPaid)
    .reduce((acc, curr) => acc + (curr.depositAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#071738] via-[#0b2454] to-[#081b40] p-6 border border-khansalar-gold/30 shadow-xl">
        <div className="absolute -top-10 -left-10 opacity-10 pointer-events-none">
          <BotehJegheh size={240} className="text-khansalar-gold" />
        </div>
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-khansalar-gold to-amber-600 rounded-xl shadow-gold-glow text-slate-950 font-black">
              <CalendarDays className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-amber-100">
                  سامانه مدیریت رزرواسیون و تشریفات خوان‌سالار
                </h1>
                <ShamsehStar size={18} className="text-khansalar-gold" />
              </div>
              <p className="text-xs md:text-sm text-slate-400 mt-1">
                مدیریت ایونت‌ها، پذیرایی تشریفاتی VIP، میزهای اختصاصی و کنترل بیعانه ورودی
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-khansalar-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-gold-glow transition-all active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>ثبت رزرو جدید</span>
          </button>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="bg-[#051126]/80 backdrop-blur-sm border border-slate-700/60 rounded-xl p-3.5">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
              <CalendarDays className="w-3.5 h-3.5 text-khansalar-gold" />
              <span>کل رزرواسیون‌ها</span>
            </div>
            <div className="text-xl font-black text-amber-200 mt-1">
              {toPersianDigits(totalReservations)} <span className="text-xs font-normal text-slate-400">مورد</span>
            </div>
          </div>

          <div className="bg-[#051126]/80 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-3.5">
            <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>تأیید شده و قطعی</span>
            </div>
            <div className="text-xl font-black text-emerald-300 mt-1">
              {toPersianDigits(confirmedCount)} <span className="text-xs font-normal text-slate-400">میز</span>
            </div>
          </div>

          <div className="bg-[#051126]/80 backdrop-blur-sm border border-sky-500/30 rounded-xl p-3.5">
            <div className="text-[11px] text-sky-400 flex items-center gap-1.5 font-medium">
              <Utensils className="w-3.5 h-3.5 text-sky-400" />
              <span>مستقر در سالن</span>
            </div>
            <div className="text-xl font-black text-sky-300 mt-1">
              {toPersianDigits(seatedCount)} <span className="text-xs font-normal text-slate-400">پذیرایی فعال</span>
            </div>
          </div>

          <div className="bg-[#051126]/80 backdrop-blur-sm border border-amber-500/30 rounded-xl p-3.5">
            <div className="text-[11px] text-amber-300 flex items-center gap-1.5 font-medium">
              <DollarSign className="w-3.5 h-3.5 text-khansalar-gold" />
              <span>بیعانه‌های وصول شده</span>
            </div>
            <div className="text-lg font-black text-amber-200 mt-1">
              {formatPrice(totalDeposits)}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#071838]/80 backdrop-blur-md rounded-xl p-4 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="جستجو نام مشتری، شماره تلفن یا شناسه..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-3 py-2 bg-slate-900/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-khansalar-gold"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-khansalar-gold" />
            <span>وضعیت:</span>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-900/90 border border-slate-700 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-khansalar-gold"
          >
            <option value="ALL">همه وضعیت‌ها</option>
            <option value="CONFIRMED">تأیید شده</option>
            <option value="PENDING">در انتظار بیعانه</option>
            <option value="SEATED">مستقر در سالن</option>
            <option value="CANCELLED">لغو شده</option>
          </select>

          <span className="text-slate-600">|</span>

          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-khansalar-gold" />
            <span>مناسبت:</span>
          </div>
          <select
            value={selectedOccasion}
            onChange={(e) => setSelectedOccasion(e.target.value)}
            className="bg-slate-900/90 border border-slate-700 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-khansalar-gold"
          >
            <option value="ALL">همه مناسبت‌ها</option>
            <option value="VIP">VIP سلطنتی</option>
            <option value="BIRTHDAY">جشن تولد</option>
            <option value="BUSINESS">جلسه کاری</option>
            <option value="ANNIVERSARY">سالگرد</option>
            <option value="NORMAL">عمومی</option>
          </select>
        </div>
      </div>

      {/* Reservation Cards List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#081b3d]/50 rounded-2xl border border-dashed border-slate-800">
          <CalendarDays className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-bold text-sm">موردی با این مشخصات یافت نشد</p>
          <p className="text-slate-500 text-xs mt-1">می‌توانید فیلترها را تغییر داده یا رزرو جدیدی ثبت کنید</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const occasionConf = OCCASION_CONFIG[item.occasion] || OCCASION_CONFIG.NORMAL;
            const statusConf = STATUS_CONFIG[item.status] || STATUS_CONFIG.CONFIRMED;
            const StatusIcon = statusConf.icon;
            const OccasionIcon = occasionConf.icon;

            return (
              <div
                key={item.id}
                className="bg-[#071630] rounded-xl border border-slate-800/80 hover:border-khansalar-gold/40 transition-all p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group"
              >
                {/* Occasion ribbon accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${occasionConf.color}`} />

                <div>
                  {/* Top Bar inside card */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-khansalar-gold font-bold">
                      {item.reservationNumber}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${occasionConf.badge}`}>
                        <OccasionIcon className="w-3 h-3" />
                        <span>{occasionConf.label}</span>
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusConf.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span>{statusConf.label}</span>
                      </span>
                    </div>
                  </div>

                  {/* Customer info */}
                  <h3 className="text-base font-black text-amber-100 group-hover:text-khansalar-gold transition-colors">
                    {item.customerName}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-mono">{toPersianDigits(item.phoneNumber)}</span>
                  </div>

                  {/* Time & Table badge */}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{toPersianDigits(item.reservationTime)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300 justify-end">
                      <Users className="w-3.5 h-3.5 text-khansalar-gold" />
                      <span>{toPersianDigits(item.partySize)} نفر</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">میز تخصیص‌یافته:</span>
                      <span className="font-bold text-khansalar-gold">{item.tableNumber || 'تعیین نشده'}</span>
                    </div>
                  </div>

                  {/* Special requests / Notes */}
                  {item.specialRequests && (
                    <div className="mt-2.5 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] text-amber-200/90 leading-relaxed">
                      <span className="font-bold text-khansalar-gold">درخواست ویژه: </span>
                      {item.specialRequests}
                    </div>
                  )}

                  {/* Deposit info */}
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>مبلغ بیعانه:</span>
                    <span className={`font-bold ${item.depositPaid ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {item.depositAmount > 0 ? (
                        <>
                          {formatPrice(item.depositAmount)} {item.depositPaid ? '✓ (پرداخت شده)' : '⏳ (در انتظار)'}
                        </>
                      ) : (
                        'بدون بیعانه'
                      )}
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  {item.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleStatusChange(item.id, 'SEATED')}
                      className="flex-1 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1"
                    >
                      <Utensils className="w-3.5 h-3.5" />
                      <span>پذیرش و استقرار در میز</span>
                    </button>
                  )}

                  {item.status === 'PENDING' && (
                    <button
                      onClick={() => handleStatusChange(item.id, 'CONFIRMED')}
                      className="flex-1 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تأیید بیعانه و قطعی‌سازی</span>
                    </button>
                  )}

                  {item.status === 'SEATED' && (
                    <div className="w-full py-1 text-center text-xs font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded-lg">
                      مهمان در سالن حضور دارد
                    </div>
                  )}

                  {(item.status === 'CONFIRMED' || item.status === 'PENDING') && (
                    <button
                      onClick={() => handleStatusChange(item.id, 'CANCELLED')}
                      className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-medium rounded-lg transition-all"
                      title="لغو رزرو"
                    >
                      لغو
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create New Reservation */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#071630] border border-khansalar-gold/40 rounded-2xl p-6 shadow-2xl text-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShamsehStar size={20} className="text-khansalar-gold" />
                <h2 className="text-lg font-black text-amber-100">ثبت رزرو و پذیرایی تشریفاتی</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateReservation} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">نام و نام خانوادگی مهمان *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: جناب دکتر فرهمند"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-khansalar-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">شماره همراه *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0912..."
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-khansalar-gold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">تعداد نفرات</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={partySize}
                    onChange={(e) => setPartySize(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-khansalar-gold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">تخصیص میز</label>
                  <select
                    value={tableId}
                    onChange={(e) => setTableId(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-khansalar-gold"
                  >
                    {tables.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.tableNumber} - {t.title} (ظرفیت {toPersianDigits(t.capacity)} نفر)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">تاریخ و ساعت رزرو</label>
                  <input
                    type="text"
                    value={reservationTime}
                    onChange={(e) => setReservationTime(e.target.value)}
                    placeholder="۱۴۰۳/۰۸/۲۱ ۲۰:۳۰"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-khansalar-gold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">نوع مناسبت / ایونت</label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value as OccasionType)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-khansalar-gold"
                  >
                    <option value="VIP">👑 VIP و تشریفات سلطنتی</option>
                    <option value="BIRTHDAY">🎉 جشن تولد</option>
                    <option value="BUSINESS">💼 جلسه کاری و تجاری</option>
                    <option value="ANNIVERSARY">❤️ سالگرد ازدواج / مناسبت</option>
                    <option value="NORMAL">🍽️ پذیرایی عمومی</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">مبلغ بیعانه (تومان)</label>
                  <input
                    type="number"
                    step="50000"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-khansalar-gold"
                  />
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg">
                  <input
                    type="checkbox"
                    id="depositPaidCheck"
                    checked={depositPaid}
                    onChange={(e) => setDepositPaid(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                  <label htmlFor="depositPaidCheck" className="text-xs text-slate-300 font-bold cursor-pointer">
                    بیعانه پرداخت شد (رزرو قطعی)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">درخواست‌های ویژه مهمان</label>
                <input
                  type="text"
                  placeholder="مثال: گل‌آرایی میز، صندلی کودک، چای زعفرانی خوش‌آمدگویی..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-khansalar-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">یادداشت داخلی رستوران</label>
                <textarea
                  rows={2}
                  placeholder="توضیحات تکمیلی برای مدیریت سالن یا میهمانداران..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-khansalar-gold"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-gradient-to-r from-khansalar-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-black shadow-gold-glow transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'در حال ثبت...' : 'ثبت قطعی رزرواسیون'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
