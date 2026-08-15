// PAGE 1｜認識我的家人 (FamilyPage.tsx)

import React, { useState } from 'react';
import { usePlan } from '../context/PlanContext';
import { RelationType, SpecialNeedTag, FamilyMember } from '../types';

const SPECIAL_NEEDS_OPTIONS: { id: SpecialNeedTag; label: string; icon: string }[] = [
  { id: 'daily_medicine', label: '每日處方用藥', icon: '💊' },
  { id: 'glasses', label: '眼鏡 / 隱形眼鏡', icon: '👓' },
  { id: 'hearing_aid', label: '助聽器', icon: '🦻' },
  { id: 'limited_mobility', label: '行動不便輔具', icon: '🧑‍🦽' },
  { id: 'infant', label: '嬰幼兒用品 (奶粉/尿布)', icon: '🍼' },
  { id: 'sanitary', label: '女性生理用品', icon: '🩸' },
  { id: 'pet', label: '寵物備用物資', icon: '🐕' },
  { id: 'other', label: '其他特殊備用物品', icon: '📦' }
];

const PRESET_RELATIONS: RelationType[] = ['爸爸', '媽媽', '哥哥', '姊姊', '弟弟', '妹妹', '爺爺', '奶奶', '寵物', '其他'];

export const FamilyPage: React.FC = () => {
  const { plan, addMember, updateMember, removeMember } = usePlan();
  const [editingMemberId, setEditingMemberId] = useState<string | null>(plan.members[0]?.id || null);

  // 新增成員狀態 Modal/Drawer
  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);
  const [newRelation, setNewRelation] = useState<RelationType>('爸爸');
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState<number>(45);
  const [newGender, setNewGender] = useState<'male' | 'female' | 'other'>('male');
  const [newHeight, setNewHeight] = useState<number>(170);
  const [newWeight, setNewWeight] = useState<number>(65);
  const [newSpecialNeeds, setNewSpecialNeeds] = useState<SpecialNeedTag[]>([]);

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMember({
      relation: newRelation,
      customName: newName.trim() || newRelation,
      age: Number(newAge) || 30,
      gender: newGender,
      height: Number(newHeight) || 165,
      weight: Number(newWeight) || 60,
      specialNeeds: newSpecialNeeds
    });
    setIsAddingModalOpen(false);
    // 重置選單
    setNewRelation('爸爸');
    setNewName('');
    setNewSpecialNeeds([]);
  };

  const toggleSpecialNeedForMember = (member: FamilyMember, tag: SpecialNeedTag) => {
    const exists = member.specialNeeds.includes(tag);
    const updatedTags = exists 
      ? member.specialNeeds.filter(t => t !== tag)
      : [...member.specialNeeds, tag];
    updateMember(member.id, { specialNeeds: updatedTags });
  };

  return (
    <div className="space-y-6 py-2">
      {/* Title */}
      <div className="text-center md:text-left space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 flex items-center justify-center md:justify-start gap-2">
          <span>👨‍👩‍👧‍👦</span>
          <span>先認識我們家</span>
        </h1>
        <p className="text-sm text-stone-600">
          每個人的需求不一樣，所以每個人的避難準備也不一樣。
        </p>
      </div>

      {/* Member Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plan.members.map((m) => {
          const isEditing = editingMemberId === m.id;

          return (
            <div
              key={m.id}
              className={`bg-white rounded-2xl p-5 border transition-all shadow-2xs ${
                isEditing ? 'border-amber-500 ring-2 ring-amber-200' : 'border-stone-200 hover:border-amber-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {m.relation === '我' ? '👦' : m.relation === '爸爸' || m.relation === '爺爺' ? '👨' : m.relation === '媽媽' || m.relation === '奶奶' ? '👩' : m.relation === '寵物' ? '🐕' : '👤'}
                  </span>
                  <div>
                    <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                      <span>{m.customName || m.relation}</span>
                      <span className="text-xs bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-md">
                        {m.relation}
                      </span>
                    </h3>
                    <p className="text-xs text-stone-500">
                      {m.age} 歲 ｜ {m.gender === 'male' ? '男性' : m.gender === 'female' ? '女性' : '其他'} ｜ {m.height} cm ｜ {m.weight} kg
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingMemberId(isEditing ? null : m.id)}
                    className="text-xs text-stone-600 hover:text-amber-600 px-2 py-1 bg-stone-100 rounded-lg transition cursor-pointer"
                  >
                    {isEditing ? '收起' : '✎ 編輯'}
                  </button>
                  {plan.members.length > 1 && m.relation !== '我' && (
                    <button
                      onClick={() => removeMember(m.id)}
                      className="text-xs text-rose-500 hover:text-rose-700 px-2 py-1 bg-rose-50 rounded-lg transition cursor-pointer"
                      title="刪除成員"
                    >
                      🗑
                    </button>
                  )}
                </div>
              </div>

              {/* Editing Form */}
              {isEditing ? (
                <div className="mt-4 pt-4 border-t border-stone-100 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-stone-600 font-semibold mb-1">稱呼 / 姓名</label>
                      <input
                        type="text"
                        value={m.customName}
                        onChange={(e) => updateMember(m.id, { customName: e.target.value })}
                        className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 font-semibold mb-1">年齡 (歲)</label>
                      <input
                        type="number"
                        value={m.age}
                        onChange={(e) => updateMember(m.id, { age: Number(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 font-semibold mb-1">身高 (cm)</label>
                      <input
                        type="number"
                        value={m.height}
                        onChange={(e) => updateMember(m.id, { height: Number(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 font-semibold mb-1">體重 (kg)</label>
                      <input
                        type="number"
                        value={m.weight}
                        onChange={(e) => updateMember(m.id, { weight: Number(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Special Needs List in Editing Mode */}
                  <div>
                    <label className="block text-stone-700 font-bold text-xs mb-2">
                      這位家人有需要特別準備的東西嗎？
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {SPECIAL_NEEDS_OPTIONS.map((opt) => {
                        const isChecked = m.specialNeeds.includes(opt.id);
                        return (
                          <button
                            type="button"
                            key={opt.id}
                            onClick={() => toggleSpecialNeedForMember(m, opt.id)}
                            className={`p-2 rounded-xl text-xs flex items-center gap-1.5 border transition cursor-pointer text-left ${
                              isChecked
                                ? 'bg-amber-100/90 border-amber-500 text-amber-900 font-semibold'
                                : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                            }`}
                          >
                            <span>{opt.icon}</span>
                            <span className="truncate">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* Compact Display */
                <div className="mt-2 text-xs">
                  <div className="font-semibold text-stone-700 mb-1">特別需求標籤：</div>
                  {m.specialNeeds.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {m.specialNeeds.map((tag) => {
                        const opt = SPECIAL_NEEDS_OPTIONS.find(o => o.id === tag);
                        return (
                          <span key={tag} className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full text-xs flex items-center gap-1 font-medium">
                            <span>{opt?.icon || '✓'}</span>
                            <span>{opt?.label || tag}</span>
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-stone-400 font-medium">✓ 無特殊需求標籤</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Family Member Button */}
      <div>
        <button
          onClick={() => setIsAddingModalOpen(true)}
          className="w-full py-3.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-2xl border border-dashed border-amber-400 flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <span className="text-lg">＋</span>
          <span>新增家人成員</span>
        </button>
      </div>

      {/* Add Member Modal */}
      {isAddingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
                <span>➕</span>
                <span>新增家庭成員</span>
              </h3>
              <button
                onClick={() => setIsAddingModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-xl font-bold px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">關係選擇</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_RELATIONS.map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => {
                        setNewRelation(r);
                        if (!newName) setNewName(r);
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                        newRelation === r
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">稱呼 / 名字</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="例如：爸爸、阿嬤、小明"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-hidden focus:border-amber-500 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">年齡 (歲)</label>
                  <input
                    type="number"
                    value={newAge}
                    onChange={(e) => setNewAge(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-hidden focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">性別</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-hidden focus:border-amber-500 bg-white"
                  >
                    <option value="male">男性</option>
                    <option value="female">女性</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">身高 (cm)</label>
                  <input
                    type="number"
                    value={newHeight}
                    onChange={(e) => setNewHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">體重 (kg)</label>
                  <input
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-hidden focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-2">特殊需求選擇</label>
                <div className="grid grid-cols-2 gap-2">
                  {SPECIAL_NEEDS_OPTIONS.map((opt) => {
                    const isChecked = newSpecialNeeds.includes(opt.id);
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => {
                          if (isChecked) {
                            setNewSpecialNeeds(newSpecialNeeds.filter(t => t !== opt.id));
                          } else {
                            setNewSpecialNeeds([...newSpecialNeeds, opt.id]);
                          }
                        }}
                        className={`p-2 rounded-xl text-xs flex items-center gap-1.5 border transition cursor-pointer text-left ${
                          isChecked
                            ? 'bg-amber-500 text-white border-amber-500 font-bold'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <span>{opt.icon}</span>
                        <span className="truncate">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 font-semibold cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold cursor-pointer"
                >
                  確認新增
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page bottom hint */}
      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
        <span className="text-base">💡</span>
        <span>接下來，我們會根據你們家的成員與體重，自動算出各成員專屬的避難包飲水量與物資重量。</span>
      </div>
    </div>
  );
};
