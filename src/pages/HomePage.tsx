// PAGE 0｜首頁 (HomePage.tsx)

import React from 'react';
import { usePlan } from '../context/PlanContext';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const HomePage: React.FC = () => {
  const { setCurrentStep } = usePlan();

  return (
    <div className="space-y-8 py-4">
      {/* Hero Section */}
      <section className="bg-linear-to-b from-amber-500/10 via-amber-50/50 to-white rounded-3xl p-6 md:p-10 border border-amber-200 shadow-sm text-center">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
          <span>📖 參照《臺灣全民安全指引》（小橘書）設計</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight mb-4">
          🏠 和家人一起，做好安全準備
        </h1>
        <p className="text-base md:text-xl text-stone-700 max-w-2xl mx-auto leading-relaxed mb-8">
          跟著小橘書，一步一步建立屬於你們家的安全避難計畫。
        </p>

        {/* 4 Feature Icons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8">
          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="text-3xl mb-1">🎒</div>
            <div className="text-xs font-bold text-stone-800">準備什麼</div>
          </div>
          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="text-3xl mb-1">📍</div>
            <div className="text-xs font-bold text-stone-800">去哪裡</div>
          </div>
          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="text-3xl mb-1">🧭</div>
            <div className="text-xs font-bold text-stone-800">怎麼避難</div>
          </div>
          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="text-3xl mb-1">👨‍👩‍👧‍👦</div>
            <div className="text-xs font-bold text-stone-800">家人怎麼照顧</div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="space-y-3">
          <button
            onClick={() => setCurrentStep(1)}
            className="w-full md:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-extrabold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer inline-flex items-center justify-center gap-2 transform active:scale-98"
          >
            <span>開始建立我的家庭安全計畫</span>
            <span>→</span>
          </button>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-stone-600 font-medium">
            <span>⏱️ 約需 10～15 分鐘</span>
            <span>📱 手機也可完成</span>
            <span>💾 隨時自動儲存進度</span>
          </div>
        </div>
      </section>

      {/* Section 2: What will you get? */}
      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-stone-900 text-center">
          你最後會得到什麼？
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition">
            <div className="text-4xl mb-3">🎒</div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">我的家庭物資</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              根據家庭成員年齡、身高體重與個人特殊需求，精確計算全家 3 日個人避難包飲水量、重量與 7 日居家儲備物資。
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition">
            <div className="text-4xl mb-3">📍</div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">我的避難地圖</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              理解不同災害（地震、海嘯、空襲）適合的避難地點與避難原則，不再誤以為「最近的避難所就一定最安全」。
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition">
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">我的家庭安全計畫</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              把物資、避難地點、通訊中斷應對、家庭兩階段集合點與成員分工整理成一份完整的計畫書，帶回家與家人共同討論。
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Quote */}
      <section className="bg-stone-900 text-stone-100 rounded-2xl p-6 text-center space-y-2">
        <p className="text-base md:text-lg font-medium text-amber-300">
          「不用等災害發生才開始想，現在就和家人一起準備。」
        </p>
        <p className="text-xs text-stone-400">
          平時做好準備，在關鍵時刻才能冷靜保護自己與摯愛的家人。
        </p>
      </section>

      {/* Disclaimer Notice */}
      <DisclaimerBanner />
    </div>
  );
};
