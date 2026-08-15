// PAGE 2｜閱讀小橘書與建立基本物資概念 (PreparePage.tsx)

import React, { useState } from 'react';
import { usePlan } from '../context/PlanContext';
import { OFFICIAL_BOOK_INFO } from '../data/officialGuidance';

const ITEM_PICKER_OPTIONS = [
  { id: 'water', label: '水', icon: '💧' },
  { id: 'food', label: '食物', icon: '🍙' },
  { id: 'phone', label: '手機', icon: '📱' },
  { id: 'medicine', label: '個人藥物', icon: '💊' },
  { id: 'clothes', label: '替換衣服', icon: '🧥' },
  { id: 'flashlight', label: '手電筒', icon: '🔦' },
  { id: 'id_docs', label: '身分證件', icon: '📄' },
  { id: 'toy', label: '娃娃/紀念品', icon: '🧸' }
];

export const PreparePage: React.FC = () => {
  const { setCurrentStep } = usePlan();
  
  // Section 1 State: User selection
  const [selectedItems, setSelectedItems] = useState<string[]>(['water', 'food', 'medicine']);

  // Section 3 State: Quiz Option
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8 py-2 max-w-4xl mx-auto">
      {/* Page Title */}
      <div className="text-center md:text-left space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 flex items-center justify-center md:justify-start gap-2">
          <span>🎒</span>
          <span>避難包，真的只是「裝東西」嗎？</span>
        </h1>
        <p className="text-sm text-stone-600">
          先讀懂小橘書，再開始準備。
        </p>
      </div>

      {/* Section 1: Scenario Question */}
      <section className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            情境思考 1
          </span>
          <h2 className="text-lg md:text-xl font-extrabold text-stone-900 pt-1">
            如果今天家裡突然不能待了，你只能帶一個包離開，你會帶什麼？
          </h2>
          <p className="text-xs text-stone-500">
            請點選你認為當下最緊急不可或缺的物品（可多選）：
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ITEM_PICKER_OPTIONS.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-500 shadow-md scale-102 font-bold'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 font-medium'
                }`}
              >
                <span className="text-3xl">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>

        {selectedItems.length > 0 && (
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <span className="font-bold">💡 你選擇了 {selectedItems.length} 項物品：</span>
            <span>「緊急狀況下，最重要的不是把家搬走，而是準備能維持 1~3 天基本生存與通訊求救的物品。」</span>
          </div>
        )}
      </section>

      {/* Section 2: Little Orange Book Concept */}
      <section className="bg-linear-to-br from-amber-500/10 via-amber-100/30 to-white rounded-3xl p-6 border border-amber-200 space-y-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📖</span>
          <div>
            <h2 className="text-xl font-extrabold text-stone-900">
              小橘書告訴我們
            </h2>
            <p className="text-xs text-amber-900">
              緊急避難包是「需要離開危險場所時，可以立即帶走的基本物資」。
            </p>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎒</span>
              <h3 className="font-bold text-stone-900 text-base">緊急避難包</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              <strong>用途：</strong>發生災害（如強震、淹水、空襲）需要撤離家園時，一人一個輕便隨身攜帶。
            </p>
            <p className="text-xs text-amber-800 font-medium bg-amber-50 p-2 rounded-xl">
              ✓ 保存維持 1～3 天生存的基本水份、食物、藥物、手電筒與保暖物資。
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏠</span>
              <h3 className="font-bold text-stone-900 text-base">日常居家儲備</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              <strong>用途：</strong>留在家中防護或外围物流中斷時（如大範圍停水停電、封鎖期間）使用。
            </p>
            <p className="text-xs text-amber-800 font-medium bg-amber-50 p-2 rounded-xl">
              ✓ 保存全家 7 天以上的糧食、大瓶飲用水、瓦斯罐與個人衛生備品。
            </p>
          </div>
        </div>

        {/* Official Link Button */}
        <div className="pt-2 text-center md:text-left">
          <a
            href={OFFICIAL_BOOK_INFO.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            <span>📖 閱讀《臺灣全民安全指引》（國防部全民防衛動員署官方網站）</span>
            <span>↗</span>
          </a>
        </div>
      </section>

      {/* Section 3: Interactive Quiz */}
      <section className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            觀念動動腦
          </span>
          <h2 className="text-lg md:text-xl font-extrabold text-stone-900 pt-1">
            你覺得「避難包」和「居家儲備」最大的差別是什麼？
          </h2>
        </div>

        <div className="space-y-3">
          {[
            { id: 'A', label: 'A. 兩個完全都一樣，只是名稱不同', isCorrect: false, text: '再想想看！避難包是要能機動隨身帶著走的，居家儲備是存放在家裡的。' },
            { id: 'B', label: 'B. 避難包要能帶著走（1-3天量），居家儲備是留在家中（7天以上量）', isCorrect: true, text: '答對了！避難包強調機動性與基本生存，居家儲備強調在居家安全時能維持一週以上的物資充足。' },
            { id: 'C', label: 'C. 避難包比較昂貴，需要買專業軍用裝備', isCorrect: false, text: '再想想看！避難包不需要昂貴軍用品，用家裡現有的後背包與日常物資即可組裝！' }
          ].map((option) => {
            const isSelected = selectedQuizOption === option.id;
            let btnStyle = "bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100";
            if (isSelected) {
              btnStyle = option.isCorrect 
                ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold"
                : "bg-amber-50 border-amber-400 text-amber-900 font-medium";
            }

            return (
              <div key={option.id} className="space-y-2">
                <button
                  onClick={() => setSelectedQuizOption(option.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer text-sm flex items-start gap-3 ${btnStyle}`}
                >
                  <span className="font-bold text-amber-600">{option.id[0]}</span>
                  <span className="flex-1">{option.label}</span>
                </button>

                {isSelected && (
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed border ${
                    option.isCorrect 
                      ? 'bg-emerald-100/90 text-emerald-900 border-emerald-300 font-medium'
                      : 'bg-amber-100/90 text-amber-900 border-amber-300'
                  }`}>
                    <div className="font-bold mb-0.5">
                      {option.isCorrect ? '✓ 觀念完全正確！' : '💡 再想想看：'}
                    </div>
                    <div>{option.text}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 4: Next Transition Card */}
      <section className="bg-stone-900 text-white rounded-3xl p-6 text-center space-y-4">
        <h3 className="text-xl font-bold text-amber-400">
          🎒 接下來，我們來看看「你的家人」各需要什麼。
        </h3>
        <p className="text-xs text-stone-300 max-w-lg mx-auto">
          我們將結合你前面輸入的家人年齡與體重，自動精算屬於你們家的水份與背包重量清單。
        </p>

        <button
          onClick={() => setCurrentStep(3)}
          className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-base rounded-2xl shadow-lg transition cursor-pointer inline-flex items-center gap-2"
        >
          <span>建立我的家庭避難包</span>
          <span>→</span>
        </button>
      </section>
    </div>
  );
};
