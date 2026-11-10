import React, { useEffect, useState } from 'react';
import { 
  LayoutGrid, 
  UtensilsCrossed, 
  Receipt, 
  BookOpenCheck, 
  Clock, 
  ShieldCheck, 
  Volume2,
  VolumeX,
  Keyboard,
  Palette,
  Flame,
  Boxes,
  Crown,
  RefreshCw
} from 'lucide-react';
import { getJalaliDate, getJalaliTime } from '../utils/persianUtils';
import { soundManager } from '../utils/soundEffects';
import { BotehJegheh } from './PersianSymbols';

export type NavTabType = 'tables' | 'pos' | 'invoices' | 'kds' | 'inventory' | 'customers' | 'ledger';

interface NavbarProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  unpaidCount: number;
  kdsCount?: number;
  lowStockCount?: number;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export type PersianTheme = 'lapis' | 'turquoise' | 'ruby';

const TAB_CONFIG: { id: NavTabType; label: string; shortLabel: string; icon: React.ElementType; fKey: string }[] = [
  { id: 'tables', label: 'نقشه سالن', shortLabel: 'سالن', icon: LayoutGrid, fKey: 'F1' },
  { id: 'pos', label: 'سفارش‌گیری', shortLabel: 'سفارش', icon: UtensilsCrossed, fKey: 'F2' },
  { id: 'invoices', label: 'فاکتور', shortLabel: 'فاکتور', icon: Receipt, fKey: 'F3' },
  { id: 'kds', label: 'آشپزخانه', shortLabel: 'KDS', icon: Flame, fKey: 'F4' },
  { id: 'inventory', label: 'انبارداری', shortLabel: 'انبار', icon: Boxes, fKey: 'F5' },
  { id: 'customers', label: 'مشتریان', shortLabel: 'CRM', icon: Crown, fKey: 'F6' },
  { id: 'ledger', label: 'دفتر کل', shortLabel: 'مالی', icon: BookOpenCheck, fKey: 'F7' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  unpaidCount,
  kdsCount = 0,
  lowStockCount = 0,
  isLoading = false,
  onRefresh,
}) => {
  const [time, setTime] = useState<string>(getJalaliTime());
  const [date] = useState<string>(getJalaliDate());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<PersianTheme>('lapis');
  const [showThemeMenu, setShowThemeMenu] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getJalaliTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const changeTheme = (theme: PersianTheme) => {
    soundManager.playClick();
    setCurrentTheme(theme);
    setShowThemeMenu(false);
    document.body.className = theme === 'lapis' ? '' : `theme-${theme}`;
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundManager.enabled = newState;
    if (newState) soundManager.playClick();
  };

  const handleTabChange = (tab: NavTabType) => {
    soundManager.playClick();
    setActiveTab(tab);
  };

  // Badge count for a tab
  const getBadge = (tabId: NavTabType): number | null => {
    if (tabId === 'invoices' && unpaidCount > 0) return unpaidCount;
    if (tabId === 'kds' && kdsCount > 0) return kdsCount;
    if (tabId === 'inventory' && lowStockCount > 0) return lowStockCount;
    return null;
  };

  // Badge style per tab
  const getBadgeStyle = (tabId: NavTabType, isActive: boolean): string => {
    if (tabId === 'invoices') {
      return isActive ? 'bg-red-600 text-white' : 'bg-red-500/20 text-red-400 border border-red-500/30';
    }
    if (tabId === 'kds') {
      return isActive ? 'bg-amber-600 text-white' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
    }
    if (tabId === 'inventory') {
      return isActive ? 'bg-red-600 text-white' : 'bg-red-500/20 text-red-400 border border-red-500/30';
    }
    return '';
  };

  return (
    <header className="sticky top-0 z-40 bg-[#071530]/95 backdrop-blur-md border-b border-khansalar-gold/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Top Bar: Logo + Controls — compact h-14 */}
        <div className="flex items-center justify-between h-14">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div 
              className="relative group cursor-pointer" 
              onClick={() => handleTabChange('tables')}
              title="بازگشت به نقشه سالن"
            >
              <div className="w-10 h-10 rounded-xl p-0.5 bg-gradient-to-tr from-khansalar-gold/80 via-khansalar-turquoise to-khansalar-gold shadow-gold-glow overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <img 
                  src="/khansalar-logo.jpg" 
                  alt="لوگوی رسمی خوان‌سالار" 
                  className="w-full h-full object-cover object-center rounded-lg"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#071530]" title="سیستم برخط" />
            </div>

            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <BotehJegheh size={16} className="text-khansalar-gold drop-shadow-sm" />
                <h1 className="text-lg font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-l from-amber-200 via-amber-300 to-khansalar-gold">
                  خوان‌ســالار
                </h1>
              </div>
              <p className="text-[10px] text-slate-400 font-medium -mt-0.5">
                سامانه جامع مدیریت رستوران
              </p>
            </div>
          </div>

          {/* Right side: Controls */}
          <div className="flex items-center gap-2">
            
            {/* Refresh button */}
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 rounded-lg bg-slate-900/70 border border-slate-700/60 text-slate-300 hover:text-khansalar-gold transition"
                title="همگام‌سازی"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-khansalar-gold' : ''}`} />
              </button>
            )}

            {/* Jalali Clock - hidden on small */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/50">
              <Clock className="w-3.5 h-3.5 text-khansalar-gold" />
              <div className="text-left font-mono leading-tight">
                <div className="text-xs font-bold text-amber-200">{time}</div>
                <div className="text-[9px] text-slate-400">{date}</div>
              </div>
            </div>

            {/* Theme Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu((prev) => !prev)}
                className="p-2 rounded-lg bg-slate-900/70 border border-slate-700/60 text-khansalar-gold hover:text-white transition"
                title="تغییر تم رنگی"
              >
                <Palette className="w-3.5 h-3.5" />
              </button>

              {showThemeMenu && (
                <div className="absolute left-0 mt-2 w-44 rounded-xl bg-[#09193a] border border-khansalar-gold/40 shadow-2xl p-1.5 z-50 animate-scale-in">
                  <div className="text-[10px] font-bold text-slate-400 px-2 py-1 mb-1">
                    رنگ‌مایه‌ها:
                  </div>
                  {([
                    { id: 'lapis' as PersianTheme, label: 'لاجورد شاه‌عباسی', color: 'bg-[#1b3a6b]' },
                    { id: 'turquoise' as PersianTheme, label: 'فیروزه نیشابور', color: 'bg-[#1da196]' },
                    { id: 'ruby' as PersianTheme, label: 'یاقوت انار یزد', color: 'bg-[#701a28]' },
                  ]).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => changeTheme(t.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                        currentTheme === t.id ? 'bg-amber-500/20 text-khansalar-gold font-bold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{t.label}</span>
                      <span className={`w-3 h-3 rounded-full ${t.color} border border-amber-300/60`}></span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-lg border transition ${
                soundEnabled 
                  ? 'bg-slate-900/70 border-slate-700/60 text-khansalar-gold hover:text-white' 
                  : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}
              title={soundEnabled ? 'بی‌صدا' : 'صدا فعال'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Keyboard Shortcuts */}
            <button
              onClick={() => {
                soundManager.playClick();
                setShowShortcutsHelp((prev) => !prev);
              }}
              className="p-2 rounded-lg bg-slate-900/70 border border-slate-700/60 text-slate-300 hover:text-khansalar-gold transition"
              title="کلیدهای میانبر"
            >
              <Keyboard className="w-3.5 h-3.5" />
            </button>

            {/* User Chip - compact */}
            <div className="flex items-center gap-2 pr-2 border-r border-slate-800">
              <div className="hidden sm:block text-left">
                <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-khansalar-gold" />
                  <span>مدیر ارشد</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  شیفت فعال
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-khansalar-gold/30 to-khansalar-surface border border-khansalar-gold/50 flex items-center justify-center font-bold text-khansalar-gold text-sm shadow-sm">
                خ
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs — scrollable, compact */}
        <div className="flex items-center gap-1 pb-2 overflow-x-auto scrollbar-none -mx-1 px-1">
          {TAB_CONFIG.map((tab) => {
            const isActive = activeTab === tab.id;
            const badge = getBadge(tab.id);
            const TabIcon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-khansalar-gold to-amber-500 text-slate-950 shadow-gold-glow font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
                {badge !== null && (
                  <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${getBadgeStyle(tab.id, isActive)}`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Keyboard Shortcuts Drawer */}
      {showShortcutsHelp && (
        <div className="bg-[#0a1835] border-t border-khansalar-gold/20 px-4 py-2.5 text-xs text-slate-300 animate-slide-down">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Keyboard className="w-3.5 h-3.5 text-khansalar-gold" />
              <span className="font-bold text-amber-200">کلیدهای میانبر:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 text-[11px]">
              {TAB_CONFIG.map((t) => (
                <span key={t.id}>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-khansalar-gold">{t.fKey}</kbd>
                  {' '}{t.label}
                </span>
              ))}
            </div>
            <button
              onClick={() => setShowShortcutsHelp(false)}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
