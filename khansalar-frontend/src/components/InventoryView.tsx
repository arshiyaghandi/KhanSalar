import React, { useState, useEffect } from 'react';
import type { InventoryItem, MenuItemRecipeBOM } from '../types';
import { api } from '../services/api';
import { playCashSound, playButtonSound } from '../utils/soundEffects';
import { ShahAbbasiFlower, EslimiBorderStrip } from './PersianSymbols';

const CATEGORY_NAMES: Record<string, string> = {
  MEAT: 'گوشت و پروتئین',
  PRODUCE: 'میوه و سبزیجات',
  DAIRY: 'لبنیات محلی',
  SPICES: 'زعفران و ادویه‌جات',
  DRY_GOODS: 'حبوبات و برنج',
  BEVERAGE: 'عرقیات و نوشیدنی',
  PACKAGING: 'بسته‌بندی و ملزومات',
};

export const InventoryView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'STOCK' | 'RECIPES'>('STOCK');
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [recipes, setRecipes] = useState<MenuItemRecipeBOM[]>([]);
  const [loading, setLoading] = useState(true);

  // Restock Modal State
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number>(1);
  const [purchaseQty, setPurchaseQty] = useState<number>(10);
  const [purchaseCost, setPurchaseCost] = useState<number>(650000);
  const [supplierName, setSupplierName] = useState<string>('تامین‌کننده اصلی بازار تهران');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [invData, recData] = await Promise.all([api.getInventoryItems(), api.getRecipes()]);
      setItems(invData);
      setRecipes(recData);
      if (invData.length > 0) {
        setSelectedItemId(invData[0].id);
        setPurchaseCost(invData[0].unitCost);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (purchaseQty <= 0) return;
    setIsSubmitting(true);
    try {
      playCashSound();
      await api.purchaseStock(selectedItemId, purchaseQty, purchaseCost, supplierName);
      setShowPurchaseModal(false);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const lowStockItems = items.filter((i) => i.currentStock <= i.minimumThreshold);

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      {/* Top Banner */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-amber-500/30 p-5 shadow-2xl relative overflow-hidden">
        <EslimiBorderStrip className="absolute top-0 right-0 left-0 text-amber-500/20" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl text-amber-400">
              📦
            </div>
            <div>
              <h2 className="text-xl font-bold text-amber-300 font-serif flex items-center gap-2">
                سامانه انبارداری هوشمند و بهای تمام شده (ERP خوان‌سالار)
                <ShahAbbasiFlower className="w-5 h-5 text-amber-400 opacity-80" />
              </h2>
              <p className="text-xs text-slate-400">
                کسر هوشمند بر اساس BOM رسپی غذاها، کنترل نقطه سفارش، و ثبت مکانیزه فاکتور خرید مواد اولیه
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playButtonSound();
                setShowPurchaseModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <span>➕ ثبت ورود بار / خرید به انبار</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-5 border-b border-slate-800 pb-3">
          <button
            onClick={() => {
              playButtonSound();
              setActiveTab('STOCK');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'STOCK'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>📊 موجودی کالا و هشدار کسری</span>
            {lowStockItems.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[11px] font-mono">
                {lowStockItems.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              playButtonSound();
              setActiveTab('RECIPES');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'RECIPES'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>🧾 آنالیز فرمول ساخت (BOM) و Food Cost</span>
          </button>
        </div>
      </div>

      {/* Low Stock Alert Banner */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-950/40 border border-red-500/50 rounded-2xl p-4 flex items-center justify-between gap-4 text-red-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-bounce">⚠️</span>
            <div>
              <div className="font-bold text-sm text-red-300">
                هشدار کسری موجودی مواد اولیه در انبار ({lowStockItems.length} قلم کالا)
              </div>
              <div className="text-xs text-red-300/80 mt-0.5">
                مواد زیر به کمتر از حد آستانه مجاز رسیده‌اند: {lowStockItems.map((i) => i.name).join('، ')}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowPurchaseModal(true)}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold whitespace-nowrap"
          >
            سفارش خرید فوری
          </button>
        </div>
      )}

      {/* TAB 1: Warehouse Stock */}
      {activeTab === 'STOCK' && (
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-800/90 text-slate-300 border-b border-slate-700">
                <tr>
                  <th className="p-3.5">کد کالا</th>
                  <th className="p-3.5">نام ماده اولیه</th>
                  <th className="p-3.5">دسته‌بندی</th>
                  <th className="p-3.5">موجودی فعلی</th>
                  <th className="p-3.5">واحد</th>
                  <th className="p-3.5">حداقل مجاز</th>
                  <th className="p-3.5">بهای تمام شده واحد</th>
                  <th className="p-3.5">وضعیت انبار</th>
                  <th className="p-3.5">آخرین شارژ</th>
                  <th className="p-3.5 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-slate-400">
                      در حال بارگذاری لیست انبار...
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const isLow = item.currentStock <= item.minimumThreshold;
                    const stockRatio = (item.currentStock / (item.minimumThreshold * 2)) * 100;

                    return (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-mono text-amber-400/90 font-bold">{item.itemCode}</td>
                        <td className="p-3.5 font-medium text-slate-100 flex items-center gap-2">
                          <span>{item.name}</span>
                          {isLow && (
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                          )}
                        </td>
                        <td className="p-3.5 text-slate-400">{CATEGORY_NAMES[item.category] || item.category}</td>
                        <td className="p-3.5 font-mono font-bold text-sm">
                          <span className={isLow ? 'text-red-400 font-black' : 'text-emerald-400'}>
                            {item.currentStock}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-400">{item.unit}</td>
                        <td className="p-3.5 font-mono text-slate-400">{item.minimumThreshold}</td>
                        <td className="p-3.5 font-mono text-amber-300">
                          {item.unitCost.toLocaleString('fa-IR')} تومان
                        </td>
                        <td className="p-3.5">
                          <div className="w-28 space-y-1">
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isLow ? 'bg-red-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.min(100, Math.max(10, stockRatio))}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {isLow ? 'کسری موجودی' : 'مطلوب و نرمال'}
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-400 text-[11px] font-mono">
                          {item.lastRestockedAt || '-'}
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => {
                              setSelectedItemId(item.id);
                              setPurchaseCost(item.unitCost);
                              setShowPurchaseModal(true);
                            }}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-[11px] font-medium border border-slate-700 transition-all"
                          >
                            شارژ مجدد
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Recipe BOM & Food Cost */}
      {activeTab === 'RECIPES' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recipes.map((rec) => (
            <div
              key={rec.menuItemId}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div>
                  <h3 className="font-serif font-bold text-base text-amber-300">{rec.menuItemName}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">آنالیز متریال و بهای تمام شده غذا (BOM)</div>
                </div>
                <div className="text-left font-mono">
                  <div className="text-xs text-slate-400">قیمت فروش منو:</div>
                  <div className="text-sm font-bold text-emerald-400">
                    {rec.sellingPrice.toLocaleString('fa-IR')} تومان
                  </div>
                </div>
              </div>

              {/* Ingredients Breakdown Table */}
              <div className="space-y-2 mb-4">
                <div className="text-xs font-bold text-slate-300 mb-1">مواد مصرفی استاندارد هر پرس:</div>
                <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 space-y-2 text-xs">
                  {rec.ingredients.map((ing) => (
                    <div key={ing.id} className="flex items-center justify-between text-slate-300">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>{ing.ingredientName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          ({ing.quantityRequired} {ing.unit})
                        </span>
                      </div>
                      <div className="font-mono text-slate-400">
                        {ing.totalCost.toLocaleString('fa-IR')} تومان
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Summary Box */}
              <div className="grid grid-cols-3 gap-2 bg-slate-800/50 rounded-xl p-3 border border-slate-700/60 text-center">
                <div>
                  <div className="text-[10px] text-slate-400">بهای تمام شده (Food Cost)</div>
                  <div className="font-mono font-bold text-xs text-amber-300 mt-1">
                    {rec.foodCost.toLocaleString('fa-IR')} تومان
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">درصد فودکاست</div>
                  <div
                    className={`font-mono font-bold text-xs mt-1 ${
                      rec.foodCostPercentage > 50 ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    ٪{rec.foodCostPercentage}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">سود ناخالص هر پرس</div>
                  <div className="font-mono font-bold text-xs text-emerald-400 mt-1">
                    {rec.profitMargin.toLocaleString('fa-IR')} تومان
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Restock Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <h3 className="font-serif font-bold text-lg text-amber-300 mb-4 flex items-center gap-2">
              <span>📥 ثبت ورود بار و فاکتور خرید مواد اولیه به انبار</span>
            </h3>

            <form onSubmit={handleRestockSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">انتخاب ماده اولیه / کالا:</label>
                <select
                  value={selectedItemId}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setSelectedItemId(id);
                    const found = items.find((i) => i.id === id);
                    if (found) setPurchaseCost(found.unitCost);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-amber-400"
                >
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} (کد: {i.itemCode}) - موجودی فعلی: {i.currentStock} {i.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">مقدار وارده:</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={purchaseQty}
                    onChange={(e) => setPurchaseQty(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-200 font-mono outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">قیمت واحد خرید (تومان):</label>
                  <input
                    type="number"
                    value={purchaseCost}
                    onChange={(e) => setPurchaseCost(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-200 font-mono outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">نام تامین‌کننده / بنکدار:</label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-amber-400"
                />
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-amber-200 text-xs">
                مبلغ کل فاکتور خرید: <span className="font-mono font-bold text-sm text-amber-300">{(purchaseQty * purchaseCost).toLocaleString('fa-IR')} تومان</span>
                <div className="text-[11px] text-amber-400/80 mt-1">
                  * با ثبت ورود، سند حسابداری دوبل بدهکار انبار / بستانکار تامین‌کننده صادر خواهد شد.
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPurchaseModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-lg"
                >
                  {isSubmitting ? 'در حال ثبت سند...' : 'تأیید و افزایش موجودی'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
