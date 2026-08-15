// PAGE 6｜我的家庭集合計畫 (FamilyPlanPage.tsx)

import React, { useState } from 'react';
import { usePlan } from '../context/PlanContext';

const OFFLINE_COMMS_OPTIONS = [
  '電池/手搖式防災廣播',
  '派出所 / 警察局公告欄',
  '村里辦公室 / 區公所公告板',
  '1991 報平安專線平台',
  '約定特定親友作為外縣市聯絡人'
];

export const FamilyPlanPage: React.FC = () => {
  const {
    plan,
    updateMeetingPoints,
    updateOfflineComms,
    updateMemberResponsibility,
    updateThoughtExperiment
  } = usePlan();

  // Local state for meeting points
  const [primaryName, setPrimaryName] = useState(plan.primaryMeetingPoint.name);
  const [primaryAddress, setPrimaryAddress] = useState(plan.primaryMeetingPoint.address);

  const [secondaryName, setSecondaryName] = useState(plan.secondaryMeetingPoint.name);
  const [secondaryAddress, setSecondaryAddress] = useState(plan.secondaryMeetingPoint.address);

  // Offline comms
  const [selectedComms, setSelectedComms] = useState<string[]>(plan.offlineCommunications || []);
  const [customCommsText, setCustomCommsText] = useState(plan.customOfflineCommsText || '');

  // Thought experiment text
  const [thoughtAnswer, setThoughtAnswer] = useState(plan.thoughtExperimentAnswer || '');

  const handleSavePoints = () => {
    updateMeetingPoints(
      { name: primaryName, address: primaryAddress, note: '第一集合點' },
      { name: secondaryName, address: secondaryAddress, note: '第二集合點' }
    );
  };

  const toggleCommOption = (opt: string) => {
    const next = selectedComms.includes(opt)
      ? selectedComms.filter(c => c !== opt)
      : [...selectedComms, opt];
    setSelectedComms(next);
    updateOfflineComms(next, customCommsText);
  };

  return (
    <div className="space-y-6 py-2 max-w-4xl mx-auto">
      {/* Title */}
      <div className="text-center md:text-left space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 flex items-center justify-center md:justify-start gap-2">
          <span>🤝</span>
          <span>如果家人走散了，怎麼辦？</span>
        </h1>
        <p className="text-sm text-stone-600">
          真正的家庭安全計畫，不只是知道「去哪裡」，還要知道「怎麼找到彼此」。
        </p>
      </div>

      {/* Section 1 & 2: Primary and Secondary Meeting Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Primary Meeting Point */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
            <span className="text-2xl">📍</span>
            <div>
              <h2 className="font-bold text-stone-900 text-base">第一家庭集合點</h2>
              <p className="text-[11px] text-stone-400">住家附近最優先前往會合的地點（如附近公園）</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <label className="block text-stone-700 font-bold mb-1">地點名稱</label>
              <input
                type="text"
                value={primaryName}
                onChange={(e) => {
                  setPrimaryName(e.target.value);
                  handleSavePoints();
                }}
                placeholder="例如：住家附近的OO公園正門"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-hidden focus:border-amber-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-bold mb-1">具體位置 / 標的物細節</label>
              <input
                type="text"
                value={primaryAddress}
                onChange={(e) => {
                  setPrimaryAddress(e.target.value);
                  handleSavePoints();
                }}
                placeholder="例如：公園正門大樹旁的告示牌前"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Secondary Meeting Point */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
            <span className="text-2xl">🏫</span>
            <div>
              <h2 className="font-bold text-stone-900 text-base">第二家庭集合點（備用）</h2>
              <p className="text-[11px] text-stone-400">當第一集合點受毀損或危險時的備用地點</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <label className="block text-stone-700 font-bold mb-1">備用地點名稱</label>
              <input
                type="text"
                value={secondaryName}
                onChange={(e) => {
                  setSecondaryName(e.target.value);
                  handleSavePoints();
                }}
                placeholder="例如：OO國民小學體育館大門"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-hidden focus:border-amber-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-bold mb-1">具體位置 / 標的物細節</label>
              <input
                type="text"
                value={secondaryAddress}
                onChange={(e) => {
                  setSecondaryAddress(e.target.value);
                  handleSavePoints();
                }}
                placeholder="例如：校門口司令台後方區域"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Offline Comms Checklist */}
      <section className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            通訊備案
          </span>
          <h2 className="text-lg font-bold text-stone-900 pt-1 flex items-center gap-2">
            <span>📞</span>
            <span>如果手機與行動網路不能用時，全家如何獲得消息？</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {OFFLINE_COMMS_OPTIONS.map((opt) => {
            const isChecked = selectedComms.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => toggleCommOption(opt)}
                className={`p-3.5 rounded-2xl border text-xs font-bold transition cursor-pointer flex items-center gap-3 text-left ${
                  isChecked
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                  isChecked ? 'bg-white text-amber-600' : 'border border-stone-300 bg-white'
                }`}>
                  {isChecked && '✓'}
                </div>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 4: Family Role Assignments */}
      <section className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
        <div className="border-b border-stone-100 pb-2">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <span>👨‍👩‍👧‍👦</span>
            <span>家庭成員分工約定</span>
          </h2>
          <p className="text-xs text-stone-500">
            緊急狀況發生時，每位家人各自負責最擅長或最重要的任務。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {plan.members.map((m) => (
            <div key={m.id} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-2">
              <div className="font-bold text-stone-900 flex items-center gap-2">
                <span>{m.relation === '我' ? '👦' : '👤'}</span>
                <span>{m.customName || m.relation} ({m.relation})</span>
              </div>
              <div>
                <label className="block text-stone-500 text-[11px] mb-1">分工職責：</label>
                <input
                  type="text"
                  value={plan.memberResponsibilities[m.id] || ''}
                  onChange={(e) => updateMemberResponsibility(m.id, e.target.value)}
                  placeholder={m.relation === '我' ? '攜帶共用急救包與隨身收音機' : '協助爺爺奶奶、關閉家裡電源瓦斯'}
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:border-amber-500 font-medium"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Scenario Thought Question */}
      <section className="bg-linear-to-br from-amber-500/10 via-amber-50 to-white rounded-3xl p-6 border border-amber-200 shadow-2xs space-y-3">
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-800 bg-amber-200 px-3 py-1 rounded-full">
            🧠 家庭情境思考題
          </span>
          <h2 className="text-base font-extrabold text-stone-900 pt-1">
            「如果爸爸在公司、媽媽在家、你在學校，災害發生後手機又不能使用，你們約定在哪裡集合？」
          </h2>
        </div>

        <textarea
          rows={3}
          value={thoughtAnswer}
          onChange={(e) => {
            setThoughtAnswer(e.target.value);
            updateThoughtExperiment(e.target.value);
          }}
          placeholder="請寫下你們家討論出的集合約定..."
          className="w-full p-3.5 bg-white border border-amber-300 rounded-2xl text-xs focus:outline-hidden focus:border-amber-500 leading-relaxed font-medium shadow-2xs"
        />

        <div className="text-[11px] text-amber-900 bg-amber-100/80 p-2.5 rounded-xl">
          💡 提示：寫下具體時間（例如：強震結束後 2 小時內）與集合地點，帶回家與爸媽討論！
        </div>
      </section>
    </div>
  );
};
