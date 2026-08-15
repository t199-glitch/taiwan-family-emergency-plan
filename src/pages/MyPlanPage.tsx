// PAGE 7｜完成我的家庭安全計畫 (MyPlanPage.tsx)

import React from 'react';
import { usePlan } from '../context/PlanContext';
import { calculateWaterRequirement, calculateBagWeightForMember, evaluatePlanReadiness } from '../utils/calculations';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const MyPlanPage: React.FC = () => {
  const { plan, resetPlan } = usePlan();

  // Evaluate readiness scores
  const readiness = evaluatePlanReadiness(plan);

  const getScoreBadge = (score: 'green' | 'yellow' | 'red') => {
    if (score === 'green') return <span className="bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-full text-xs flex items-center gap-1">🟢 已完成</span>;
    if (score === 'yellow') return <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full text-xs flex items-center gap-1">🟡 建議補充</span>;
    return <span className="bg-rose-100 text-rose-900 font-bold px-2.5 py-1 rounded-full text-xs flex items-center gap-1">🔴 尚未完成</span>;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 py-2 print:py-0">
      {/* Title */}
      <div className="text-center md:text-left space-y-1">
        <h1 className="text-3xl font-black text-stone-900 flex items-center justify-center md:justify-start gap-2">
          <span>🛡️</span>
          <span>我的家庭安全避難計畫</span>
        </h1>
        <p className="text-sm text-stone-600">
          這不是一張考卷，而是你和家人真正可以使用的安全計畫。
        </p>
      </div>

      {/* Readiness Score Indicators */}
      <section className="bg-linear-to-br from-amber-500/10 via-amber-50 to-white rounded-3xl p-6 border border-amber-200 shadow-2xs space-y-4 print:hidden">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <span>🛡️</span>
            <span>我的家庭準備狀況總診斷</span>
          </h2>
          <span className="text-xs text-stone-500 font-medium">即時診斷診斷報告</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="bg-white p-3 rounded-2xl border border-stone-200 text-center space-y-1">
            <div className="text-xs font-bold text-stone-600">🎒 避難包</div>
            <div className="flex justify-center">{getScoreBadge(readiness.goBagScore)}</div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-stone-200 text-center space-y-1">
            <div className="text-xs font-bold text-stone-600">🏠 居家儲備</div>
            <div className="flex justify-center">{getScoreBadge(readiness.householdSupplyScore)}</div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-stone-200 text-center space-y-1">
            <div className="text-xs font-bold text-stone-600">📍 避難地點</div>
            <div className="flex justify-center">{getScoreBadge(readiness.locationScore)}</div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-stone-200 text-center space-y-1">
            <div className="text-xs font-bold text-stone-600">🤝 集合地點</div>
            <div className="flex justify-center">{getScoreBadge(readiness.meetingPointScore)}</div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-stone-200 text-center space-y-1">
            <div className="text-xs font-bold text-stone-600">📻 資訊來源</div>
            <div className="flex justify-center">{getScoreBadge(readiness.communicationScore)}</div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-stone-200 text-center space-y-1">
            <div className="text-xs font-bold text-stone-600">👨‍👩‍👧‍👦 成員需求</div>
            <div className="flex justify-center">{getScoreBadge(readiness.familyMemberScore)}</div>
          </div>
        </div>

        {/* Top 3 Action Items */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200 space-y-2">
          <div className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
            <span>🚀</span>
            <span>現在帶回家最值得做的三件事：</span>
          </div>
          <ol className="list-decimal list-inside text-xs text-stone-700 space-y-1 font-medium pl-1">
            {readiness.topActions.map((act, idx) => (
              <li key={idx}>{act}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* Printable Document Container */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-md space-y-8 print:shadow-none print:border-none print:p-0">
        {/* Header inside report */}
        <div className="border-b border-stone-200 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-stone-900">🛡️ 家庭安全避難計畫書</h2>
            <p className="text-xs text-stone-500">更新時間：{new Date(plan.lastUpdated).toLocaleDateString('zh-TW')} ｜ 產出工具：《臺灣全民安全指引》小橘書家庭計畫</p>
          </div>
          <div className="text-right text-xs text-amber-700 font-bold hidden md:block">
            全家成員：{plan.members.length} 位
          </div>
        </div>

        {/* Section 1: Family Overview */}
        <section className="space-y-3">
          <h3 className="font-bold text-stone-900 text-base flex items-center gap-2 border-b border-stone-100 pb-1">
            <span>👨‍👩‍👧‍👦</span>
            <span>第一區：我的家庭概況與特殊需求</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {plan.members.map((m) => (
              <div key={m.id} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
                <div className="font-bold text-stone-900 flex items-center justify-between">
                  <span>{m.customName || m.relation}</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-md font-semibold">{m.relation}</span>
                </div>
                <div className="text-stone-500">{m.age} 歲 ｜ {m.weight} kg ｜ {m.gender === 'male' ? '男' : '女'}</div>
                <div className="text-[11px] text-amber-900 font-medium">
                  {m.specialNeeds.length > 0 ? `需求：${m.specialNeeds.join(', ')}` : '✓ 無特殊標籤'}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Go-bag & Supplies */}
        <section className="space-y-3">
          <h3 className="font-bold text-stone-900 text-base flex items-center gap-2 border-b border-stone-100 pb-1">
            <span>🎒</span>
            <span>第二區：我的緊急避難包與居家物資</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.members.map((m) => {
              const water = calculateWaterRequirement(m.weight || 60, 3);
              const weight = calculateBagWeightForMember(m, plan.goBagItems, plan.members.length);

              return (
                <div key={m.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-stone-900 border-b border-stone-200 pb-1">
                    <span>🎒 {m.customName || m.relation} 的個人避難包</span>
                    <span className="text-amber-700">預估重量：{weight.totalKg} kg</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600">
                    <div>💧 3日最低水份：<strong>{water.formattedText}</strong></div>
                    <div>🍙 糧食與乾糧：<strong>{weight.foodKg} kg</strong></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Hazard Shelter Matrix */}
        <section className="space-y-3">
          <h3 className="font-bold text-stone-900 text-base flex items-center gap-2 border-b border-stone-100 pb-1">
            <span>📍</span>
            <span>第三區：我的災害避難地點對照表</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-stone-200">
              <thead>
                <tr className="bg-amber-100/70 text-amber-900 font-bold border-b border-stone-200">
                  <th className="p-2.5 border-r border-stone-200">災害類型</th>
                  <th className="p-2.5 border-r border-stone-200">主要避難方向 / 處所</th>
                  <th className="p-2.5">避難應變原則</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-700">
                <tr>
                  <td className="p-2.5 font-bold border-r border-stone-200">🌏 地震</td>
                  <td className="p-2.5 border-r border-stone-200 font-medium">{plan.hazardShelters['earthquake'] || '住家附近學校/公園'}</td>
                  <td className="p-2.5">趴下、掩護、穩住，避開玻璃大樓</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border-r border-stone-200">🌧️ 淹水 / 豪雨</td>
                  <td className="p-2.5 border-r border-stone-200 font-medium">{plan.hazardShelters['typhoon_flood'] || '高樓二樓以上或指定處所'}</td>
                  <td className="p-2.5">切斷水電瓦斯，提早往高處撤離，遠離地下室</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border-r border-stone-200">🌊 海嘯</td>
                  <td className="p-2.5 border-r border-stone-200 font-medium">往高處（海拔20m以上）與內陸方向</td>
                  <td className="p-2.5">海嘯三原則：往高處、往內陸、立即行動</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border-r border-stone-200">🚨 空襲警報</td>
                  <td className="p-2.5 border-r border-stone-200 font-medium">{plan.hazardShelters['air_raid'] || '附近捷運站/地下室防空避難處所'}</td>
                  <td className="p-2.5">無窗地下室，採雙膝跪地拱背護頭眼耳姿勢</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Family Agreement */}
        <section className="space-y-3">
          <h3 className="font-bold text-stone-900 text-base flex items-center gap-2 border-b border-stone-100 pb-1">
            <span>🤝</span>
            <span>第四區：我的家庭約定與集合計畫</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <div className="font-bold text-stone-900">📍 第一家庭集合點：</div>
              <div className="text-amber-800 font-bold text-sm">{plan.primaryMeetingPoint.name || '未設定'}</div>
              <div className="text-stone-500">{plan.primaryMeetingPoint.address}</div>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <div className="font-bold text-stone-900">🏫 第二家庭集合點 (備用)：</div>
              <div className="text-amber-800 font-bold text-sm">{plan.secondaryMeetingPoint.name || '未設定'}</div>
              <div className="text-stone-500">{plan.secondaryMeetingPoint.address}</div>
            </div>
          </div>

          <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs space-y-1">
            <div className="font-bold text-amber-950">🧠 通訊中斷情境約定默契：</div>
            <div className="text-stone-700 font-medium leading-relaxed">
              {plan.thoughtExperimentAnswer || '已約定於通訊中斷時，前往第一集合點會合。'}
            </div>
          </div>
        </section>
      </div>

      {/* Actions: Print / Save / Reset */}
      <section className="bg-stone-900 text-white rounded-3xl p-6 space-y-4 print:hidden text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-amber-400">
              📄 保存並列印你的家庭安全計畫
            </h3>
            <p className="text-xs text-stone-300">
              建議列印一份貼在冰箱上，並把 PDF 保存於家人手機中。
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-2xl shadow-md transition cursor-pointer flex items-center gap-2"
            >
              <span>🖨️ 列印 / 另存為 PDF</span>
            </button>
            <button
              onClick={resetPlan}
              className="px-4 py-3 bg-stone-800 hover:bg-stone-700 text-stone-400 font-semibold text-xs rounded-2xl transition cursor-pointer"
            >
              🔄 重置計畫
            </button>
          </div>
        </div>

        {/* Final Reminder Box */}
        <div className="pt-4 border-t border-stone-800 text-xs text-stone-400 leading-relaxed">
          <span className="font-bold text-amber-300">💡 最後提醒：</span>
          <span>
            防災準備不是一次完成。建議每半年與家人一起檢查：🎒 避難包品項 💊 藥物保存期限 💧 飲水效期 📍 避難地點 🤝 集合計畫，並依家庭成員變化進行更新。
          </span>
        </div>
      </section>

      <DisclaimerBanner />
    </div>
  );
};
