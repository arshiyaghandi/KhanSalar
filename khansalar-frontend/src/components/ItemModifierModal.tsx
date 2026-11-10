import React, { useState } from 'react';
import type { MenuItem } from '../types';
import { formatPrice, toPersianDigits } from '../utils/persianUtils';
import { soundManager } from '../utils/soundEffects';
import { X, Plus, Minus, Check, Flame, Sparkles } from 'lucide-react';
import { ShamsehStar } from './GirihOrnament';

interface SideOption {
  id: string;
  name: string;
  price: number;
}

const AVAILABLE_SIDES: SideOption[] = [
  { id: 'side-butter', name: 'کره محلی اعلای دوغی', price: 25000 },
  { id: 'side-torshi', name: 'ترشی هفت‌بیجار سنتی', price: 35000 },
  { id: 'side-mast', name: 'ماست کوزه چکیده محلی', price: 40000 },
  { id: 'side-bread', name: 'نان تافتون داغ کنجدی', price: 15000 },
  { id: 'side-saffron', name: 'زعفران دودی اضافی', price: 30000 },
];

const PREP_TAGS = [
  'کم‌نمک',
  'بدون پیاز',
  'سرو همزمان',
  'ته‌دیگ زعفرانی',
  'عجله دارند (فوری)',
  'گوشت کاملاً مغزپخت',
];

const BEVERAGE_TAGS = [
  'یخ فراوان',
  'کم‌شیرین',
  'بسیار داغ',
  'همراه با هل و دارچین',
  'گلاب دوآتشه بیشتر',
];

interface ItemModifierModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddWithModifiers: (item: MenuItem, quantity: number, notes: string, extraPrice: number) => void;
}

export const ItemModifierModal: React.FC<ItemModifierModalProps> = ({
  item,
  onClose,
  onAddWithModifiers,
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSides, setSelectedSides] = useState<SideOption[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState<string>('');

  const isBeverage = item.category.includes('نوشیدنی') || item.category.includes('شربت') || item.category.includes('کافه');
  const tagsList = isBeverage ? BEVERAGE_TAGS : PREP_TAGS;

  const toggleSide = (side: SideOption) => {
    soundManager.playClick();
    setSelectedSides((prev) =>
      prev.some((s) => s.id === side.id)
        ? prev.filter((s) => s.id !== side.id)
        : [...prev, side]
    );
  };

  const toggleTag = (tag: string) => {
    soundManager.playClick();
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const extraSidesPrice = selectedSides.reduce((sum, s) => sum + s.price, 0);
  const singleItemTotal = item.price + extraSidesPrice;
  const grandTotal = singleItemTotal * quantity;

  const handleConfirm = () => {
    soundManager.playItemAdd();
    const allNotes = [
      ...selectedSides.map((s) => `+ ${s.name}`),
      ...selectedTags,
      customNote.trim(),
    ]
      .filter(Boolean)
      .join(' | ');

    onAddWithModifiers(item, quantity, allNotes, extraSidesPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="khansalar-panel rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-khansalar-gold shadow-gold-glow relative overflow-hidden space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-700/60 pb-4">
          <div className="flex items-center gap-3">
            <ShamsehStar size={36} />
            <div>
              <h3 className="text-lg font-bold text-amber-100 flex items-center gap-2">
                {item.name}
              </h3>
              <p className="text-xs text-khansalar-turquoise font-medium mt-0.5">
                {item.category} • قیمت پایه: {formatPrice(item.price)}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quantity Selection */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-300">تعداد سفارش:</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundManager.playClick();
                setQuantity((q) => Math.max(1, q - 1));
              }}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-base font-black text-khansalar-gold min-w-[28px] text-center font-mono">
              {toPersianDigits(quantity)}
            </span>
            <button
              onClick={() => {
                soundManager.playClick();
                setQuantity((q) => q + 1);
              }}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Condiments & Sides */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-khansalar-gold" />
            افزودنی‌ها و دورچین‌های سنتی ویژه:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {AVAILABLE_SIDES.map((side) => {
              const isSelected = selectedSides.some((s) => s.id === side.id);
              return (
                <button
                  key={side.id}
                  onClick={() => toggleSide(side)}
                  className={`p-2.5 rounded-xl text-xs text-right border flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/5 border-khansalar-gold text-amber-200 font-bold'
                      : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>{side.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 font-mono">+{formatPrice(side.price)}</span>
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                      isSelected ? 'bg-khansalar-gold text-slate-950 border-khansalar-gold' : 'border-slate-700'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Kitchen Tags */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            دستور آماده‌سازی سریع برای سرآشپز:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {tagsList.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                    isSelected
                      ? 'bg-khansalar-turquoise/20 border-khansalar-turquoise text-khansalar-turquoise font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Kitchen Note */}
        <div>
          <input
            type="text"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="توضیحات سفارشی آشپزخانه (اختیاری)..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-khansalar-gold"
          />
        </div>

        {/* Total & Action Footer */}
        <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400">مجموع این ردیف:</span>
            <div className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-l from-amber-200 to-khansalar-gold font-mono">
              {formatPrice(grandTotal)}
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className="py-3 px-6 rounded-2xl text-xs font-black bg-gradient-to-r from-khansalar-gold via-amber-400 to-amber-500 text-slate-950 hover:brightness-110 active:scale-95 transition shadow-gold-glow flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            افزودن به فیش سفارش
          </button>
        </div>
      </div>
    </div>
  );
};
