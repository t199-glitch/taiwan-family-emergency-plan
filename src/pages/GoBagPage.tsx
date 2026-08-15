// PAGE 3｜我的家庭避難包計算器 (GoBagPage.tsx)

import React, { useState } from 'react';
import { usePlan } from '../context/PlanContext';
import { calculateWaterRequirement, calculateBagWeightForMember } from '../utils/calculations';
import { ItemCategory, GoBagItem } from '../types';

const CATEGORY_NAMES: Record<ItemCategory, { label: string; icon: string }> = {
  water: { label: '飲用水', icon: '💧' },
  food: { label: '糧食乾糧', icon: '🍙' },
  medical: { label: '醫療急救', icon: '🩹' },
  tools: { label: '工具防護', icon: '🔦' },
  warmth: { label: '保暖衣物', icon: '🧥' },
  hygiene: { label: '清潔衛生', icon: '🧼' },
  important_docs: { label: '證件現金', icon: '📄' },
  special: { label: '特殊需求品', icon: '✨' }
};

export const GoBagPage: React.FC = () => {
  const { plan, addGoBagItem, updateGoBagItem, removeGoBagItem, toggleHouseholdSupplyReady } = usePlan();
  
  // Selected Member Tab
  const [activeMemberId, setActiveMemberId] = useState<string>(plan.members[0]?.id || 'member_self');
  const activeMember = plan.members.find(m => m.id === activeMemberId) || plan.members[0];

  // Add Item Modal
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ItemCategory>('tools');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemWeight, setNewItemWeight] = useState(0.3);
  const [newItemIsShared, setNewItemIsShared] = useState(false);
  const [newItemNote, setNewItemNote] = useState('');

  if (!activeMember) return null;

  // Calculate Water & Weight for Active Member
  const waterInfo = calculateWaterRequirement(activeMember.weight || 60, 3);
  const weightInfo = calculateBagWeightForMember(activeMember, plan.goBagItems, plan.members.length);

  // Items owned by this active member or shared
  const memberPersonalItems = plan.goBagItems.filter(i => i.ownerMemberId === activeMember.id && !i.isShared);
  const familySharedItems = plan.goBagItems.filter(i => i.isShared || !i.ownerMemberId);

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    addGoBagItem({
      category: newItemCategory,
      name: newItemName.trim(),
      quantity: Number(newItemQty) || 1,
      unit: '個',
      estimatedWeightKg: Number(newItemWeight) || 0.1,
      ownerMemberId: newItemIsShared ? undefined : activeMember.id,
      isShared: newItemIsShared,
      note: newItemNote.trim()
    });

    setIsAddItemOpen(false);
    setNewItemName('');
    setNewItemNote('');
  };

  return (
    <div className="space-y-6 py-2">
      {/* Title */}
      <div className="text-center md:text-left space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 flex items-center justify-center md:justify-start gap-2">
          <span>🎒</span>
          <span>我的家庭需要準備什麼？</span>
        </h1>
        <p className="text-sm text-stone-600">
          結合家人個人數值與需求，動態計算避難包重量與水份。這是一份建議，不是唯一答案。
        </p>
      </div>

      {/* Member Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {plan.members.map((m) => {
          const isActive = m.id === activeMemberId;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMemberId(m.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300 scale-102'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span>{m.relation === '我' ? '👦' : m.relation === '爸爸' ? '👨' : m.relation === '媽媽' ? '👩' : '👤'}</span>
              <span>{m.customName || m.relation}</span>
              <span className="text-[10px] opacity-80 font-normal">({m.weight}kg)</span>
            </button>
          );
        })}
      </div>

      {/* Main Calculation & Bag Display Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Weight & Water Card */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
              <div className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                {activeMember.customName || activeMember.relation} 的個人背包
              </div>
              <div className="text-xs text-stone-400 font-medium">
                3日份基本準備
              </div>
            </div>

            {/* Big Weight Display */}
            <div className="text-center bg-linear-to-br from-amber-500/10 to-amber-100/40 p-5 rounded-2xl border border-amber-200">
              <div className="text-xs font-semibold text-stone-600 mb-1">🎒 預估背包總重量</div>
              <div className="text-4xl md:text-5xl font-black text-amber-600 tracking-tight">
                {weightInfo.totalKg} <span className="text-xl font-bold">kg</span>
              </div>

              {/* Overweight warning if applicable */}
              {weightInfo.isOverweight ? (
                <div className="mt-2 text-xs text-rose-600 bg-rose-50 p-2 rounded-xl font-medium border border-rose-200">
                  ⚠️ 已超過女性/青少年建議上限 ({weightInfo.recommendedMaxKg} kg)，建議調整或分攤部分物資。
                </div>
              ) : (
                <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 p-1.5 rounded-xl font-medium">
                  ✓ 在安全負重能力參考範圍內 (上限約 {weightInfo.recommendedMaxKg} kg)
                </div>
              )}
            </div>

            {/* Formula Breakdown */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between items-center bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                <span className="font-semibold text-stone-700 flex items-center gap-1">
                  <span>💧 專屬飲水量 (3天)</span>
                </span>
                <span className="font-bold text-amber-700">{waterInfo.formattedText}</span>
              </div>
              <div className="text-[11px] text-stone-400 px-1">
                官方計算公式：體重 ({activeMember.weight}kg) × 15ml × 3日 = {waterInfo.totalMl} ml
              </div>

              <div className="flex justify-between items-center bg-stone-50 p-2.5 rounded-xl border border-stone-100 mt-2">
                <span className="font-semibold text-stone-700 flex items-center gap-1">
                  <span>🍙 糧食與乾糧</span>
                </span>
                <span className="font-bold text-stone-800">{weightInfo.foodKg} kg</span>
              </div>

              <div className="flex justify-between items-center bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                <span className="font-semibold text-stone-700 flex items-center gap-1">
                  <span>👤 個人專屬物資</span>
                </span>
                <span className="font-bold text-stone-800">{weightInfo.personalItemsKg} kg</span>
              </div>

              <div className="flex justify-between items-center bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                <span className="font-semibold text-stone-700 flex items-center gap-1">
                  <span>👨‍👩‍👧‍👦 家庭共用分攤</span>
                </span>
                <span className="font-bold text-stone-800">{weightInfo.sharedSplitKg} kg</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-stone-500 bg-amber-50/80 p-3 rounded-xl border border-amber-200">
            <strong>重要提示：</strong>實際負重能力不能只由性別或身高體重決定，應以個人能安全背負且可敏捷行走為準。
          </div>
        </div>

        {/* Right 2 Columns: Items List Manager */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span>📋</span>
              <span>避難包項目編輯與調配</span>
            </h2>
            <button
              onClick={() => setIsAddItemOpen(true)}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer flex items-center gap-1"
            >
              <span>＋ 增加自訂品項</span>
            </button>
          </div>

          {/* Personal Items Section */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-stone-800 text-sm flex items-center justify-between border-b border-stone-100 pb-2">
              <span className="flex items-center gap-2">
                <span>👤</span>
                <span>{activeMember.customName || activeMember.relation} 的個人專屬物品</span>
              </span>
              <span className="text-xs text-stone-400 font-normal">
                共 {memberPersonalItems.length} 項
              </span>
            </h3>

            <div className="space-y-2">
              {memberPersonalItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition ${
                    item.isAutoAdded ? 'bg-amber-50/80 border-amber-200' : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{CATEGORY_NAMES[item.category]?.icon || '📦'}</span>
                    <div>
                      <div className="font-bold text-stone-900 flex items-center gap-1.5">
                        <span>{item.name}</span>
                        {item.isAutoAdded && (
                          <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-md font-semibold">
                            特殊需求自動為此家人對應加入
                          </span>
                        )}
                      </div>
                      {item.note && <div className="text-[11px] text-stone-500">{item.note}</div>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-white border border-stone-300 rounded-lg px-2 py-0.5">
                      <button
                        onClick={() => updateGoBagItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                        className="text-stone-500 hover:text-stone-800 font-bold px-1 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-bold text-stone-800 px-1">{item.quantity}</span>
                      <button
                        onClick={() => updateGoBagItem(item.id, { quantity: item.quantity + 1 })}
                        className="text-stone-500 hover:text-stone-800 font-bold px-1 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-semibold text-stone-600 w-12 text-right">
                      {(item.estimatedWeightKg * item.quantity).toFixed(2)} kg
                    </span>
                    <button
                      onClick={() => removeGoBagItem(item.id)}
                      className="text-stone-400 hover:text-rose-500 text-sm cursor-pointer p-1"
                      title="刪除品項"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Family Shared Items Section */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-stone-800 text-sm flex items-center justify-between border-b border-stone-100 pb-2">
              <span className="flex items-center gap-2">
                <span>👨‍👩‍👧‍👦</span>
                <span>全家共用避難裝備（全家平攤）</span>
              </span>
              <span className="text-xs text-stone-400 font-normal">
                共 {familySharedItems.length} 項
              </span>
            </h3>

            <div className="space-y-2">
              {familySharedItems.map((item) => (
                <div key={item.id} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{CATEGORY_NAMES[item.category]?.icon || '📦'}</span>
                    <div>
                      <div className="font-bold text-stone-900">{item.name}</div>
                      {item.note && <div className="text-[11px] text-stone-500">{item.note}</div>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-white border border-stone-300 rounded-lg px-2 py-0.5">
                      <button
                        onClick={() => updateGoBagItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                        className="text-stone-500 hover:text-stone-800 font-bold px-1 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-bold text-stone-800 px-1">{item.quantity}</span>
                      <button
                        onClick={() => updateGoBagItem(item.id, { quantity: item.quantity + 1 })}
                        className="text-stone-500 hover:text-stone-800 font-bold px-1 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-semibold text-stone-600 w-12 text-right">
                      {(item.estimatedWeightKg * item.quantity).toFixed(2)} kg
                    </span>
                    <button
                      onClick={() => removeGoBagItem(item.id)}
                      className="text-stone-400 hover:text-rose-500 text-sm cursor-pointer p-1"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Household Supplies Checklist Section */}
      <section className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span>🏠</span>
              <span>居家 7 天常備物資點檢</span>
            </h2>
            <p className="text-xs text-stone-500">
              不需要放進隨身包包，而是儲放於家中乾燥安全通風處。
            </p>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            已備齊 {plan.householdSupplies.filter(s => s.isReady).length} / {plan.householdSupplies.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {plan.householdSupplies.map((supply) => (
            <button
              key={supply.id}
              onClick={() => toggleHouseholdSupplyReady(supply.id)}
              className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition cursor-pointer ${
                supply.isReady
                  ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950 font-medium'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                supply.isReady ? 'bg-emerald-500 text-white' : 'border border-stone-400 bg-white'
              }`}>
                {supply.isReady && '✓'}
              </div>
              <div className="space-y-0.5 text-xs flex-1">
                <div className="font-bold text-sm text-stone-900">{supply.name}</div>
                <div className="text-stone-500">建議儲備：{supply.recommendedAmount}</div>
                <div className="text-amber-800 font-semibold">目前狀態：{supply.currentAmount}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Footer Summary Box */}
      <section className="bg-stone-900 text-white rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-lg font-bold text-amber-400">
            🏠 全家物資整備總覽
          </h3>
          <p className="text-xs text-stone-300">
            個人避難背包：<strong>{plan.members.length} 個</strong> ｜ 家庭共用包：<strong>1 組</strong> ｜ 居家儲備：<strong>7 天份</strong>
          </p>
        </div>

        <div className="text-xs text-stone-400 bg-stone-800/80 px-4 py-2 rounded-xl border border-stone-700">
          ✓ 已針對全家 {plan.members.length} 位成員完成個人化重量計算
        </div>
      </section>

      {/* Add Item Modal */}
      {isAddItemOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-stone-900 text-base">➕ 增加避難包品項</h3>
              <button onClick={() => setIsAddItemOpen(false)} className="text-stone-400 text-xl font-bold cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAddItemSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">物品名稱</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="例如：粗口哨、暖暖包、備用乾電池"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-hidden focus:border-amber-500 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">物資分類</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as ItemCategory)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white focus:outline-hidden"
                  >
                    {Object.entries(CATEGORY_NAMES).map(([cat, info]) => (
                      <option key={cat} value={cat}>{info.icon} {info.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">估計單個重量 (kg)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={newItemWeight}
                    onChange={(e) => setNewItemWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">分配屬性</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="radio"
                      checked={!newItemIsShared}
                      onChange={() => setNewItemIsShared(false)}
                      className="accent-amber-500"
                    />
                    <span>{activeMember.customName || activeMember.relation} 的個人背包</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="radio"
                      checked={newItemIsShared}
                      onChange={() => setNewItemIsShared(true)}
                      className="accent-amber-500"
                    />
                    <span>全家共用物資</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">備註說明 (選填)</label>
                <input
                  type="text"
                  value={newItemNote}
                  onChange={(e) => setNewItemNote(e.target.value)}
                  placeholder="例如：置於外側拉鍊口袋"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddItemOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 font-semibold cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold cursor-pointer"
                >
                  確認新增
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
