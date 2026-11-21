import React, { useState } from 'react';
import { ShieldCheck, User, Key, CheckCircle2, AlertCircle, X, LogOut, ArrowRight, Lock } from 'lucide-react';
import { api, authStorage } from '../services/api';
import type { AuthUser, BackendStatus } from '../types';
import { soundManager } from '../utils/soundEffects';
import { ShamsehStar } from './GirihOrnament';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  backendStatus: BackendStatus | null;
}

const PRESET_ACCOUNTS = [
  {
    username: 'admin',
    password: 'admin123',
    roleTitle: 'مدیر ارشد و حسابدار',
    description: 'دسترسی کامل به تمام بخش‌ها، رزروها، امور مالی و هوش تجاری',
    color: 'from-amber-600/30 to-amber-900/30 border-amber-500/50 text-amber-300',
  },
  {
    username: 'cashier',
    password: '123456',
    roleTitle: 'صندوقدار مرکزی',
    description: 'تسویه فاکتورها، بستن صندوق روزانه، صدور گزارش پوز و وجه نقد',
    color: 'from-emerald-600/30 to-emerald-900/30 border-emerald-500/50 text-emerald-300',
  },
  {
    username: 'waiter',
    password: '123456',
    roleTitle: 'مهماندار و سالندار',
    description: 'سفارش‌گیری سر میز، مانیتورینگ سالن و ارسال سفارشات به آشپزخانه',
    color: 'from-sky-600/30 to-sky-900/30 border-sky-500/50 text-sky-300',
  },
];

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess, backendStatus }) => {
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('admin123');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const currentUser = authStorage.getUser();

  if (!isOpen) return null;

  const handleLogin = async (userToSubmit?: string, passToSubmit?: string) => {
    const u = userToSubmit || username;
    const p = passToSubmit || password;
    setLoading(true);
    setError(null);
    soundManager.playClick();

    try {
      const user = await api.login(u, p);
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'خطا در برقراری ارتباط با سرور احراز هویت Gateway');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    soundManager.playClick();
    api.logout();
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#07132b] border border-khansalar-gold/40 rounded-2xl p-6 shadow-2xl text-slate-100 girih-pattern">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-khansalar-gold/30 to-amber-900/40 border border-khansalar-gold/50 flex items-center justify-center text-khansalar-gold shadow-md">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-amber-200">احراز هویت و اتصال به سرور خوان‌سالار</h2>
              <p className="text-[11px] text-slate-400">Spring Security JWT • درگاه ابری میکروسرویس‌ها</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Server Connection Indicator */}
        <div className="my-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                backendStatus?.isOnline ? 'bg-emerald-400 animate-pulse shadow-emerald-400/50 shadow-sm' : 'bg-amber-400'
              }`}
            ></span>
            <span className="font-semibold text-slate-200">
              {backendStatus?.isOnline ? 'درگاه ابری متصل است (Port 8080)' : 'درگاه در حالت محلی / آفلاین'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {backendStatus?.gatewayUrl || 'http://localhost:8080/api/v1'}
          </span>
        </div>

        {/* Current Active User Status */}
        {currentUser && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>کاربر فعال: {currentUser.fullName} ({currentUser.username})</span>
              </div>
              <p className="text-[11px] text-emerald-400/80 mt-0.5">نقش‌ها: {currentUser.roles?.join(', ')}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-900/70 border border-rose-500/40 text-rose-300 text-xs transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 flex items-center gap-2 text-xs text-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick 1-Click Login Cards */}
        <div className="space-y-2 mb-5">
          <p className="text-xs font-semibold text-amber-200/90 mb-2">ورود سریع با کاربران سامانه (کلیک یک‌مرحله‌ای):</p>
          <div className="grid grid-cols-1 gap-2">
            {PRESET_ACCOUNTS.map((acc) => (
              <button
                key={acc.username}
                disabled={loading}
                onClick={() => {
                  setUsername(acc.username);
                  setPassword(acc.password);
                  handleLogin(acc.username, acc.password);
                }}
                className={`w-full text-right p-2.5 rounded-xl border bg-gradient-to-r ${acc.color} hover:brightness-125 transition flex items-center justify-between group`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="font-bold text-xs">{acc.roleTitle}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 font-mono text-slate-300">
                      {acc.username}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 mt-1 opacity-80">{acc.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:-translate-x-1 transition flex-shrink-0 mr-2" />
              </button>
            ))}
          </div>
        </div>

        {/* Manual Credentials Form */}
        <div className="pt-4 border-t border-slate-800">
          <p className="text-xs font-semibold text-slate-300 mb-2">یا ورود با نام کاربری و رمز عبور دلخواه:</p>
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">نام کاربری</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 pl-8"
                  placeholder="admin"
                />
                <User className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">رمز عبور</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 pl-8 font-mono"
                  placeholder="••••••"
                />
                <Key className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3" />
              </div>
            </div>
            <button
              onClick={() => handleLogin()}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-khansalar-gold to-amber-500 text-slate-950 font-bold text-xs shadow-gold-glow hover:brightness-110 active:scale-[0.99] transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <ShamsehStar size={16} className="animate-spin" />
                  <span>در حال احراز هویت با سرور...</span>
                </>
              ) : (
                <span>ورود و دریافت توکن امنیتی JWT</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
