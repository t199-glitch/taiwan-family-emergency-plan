// PAGE 4｜認識不同災害 (HazardsPage.tsx)

import React, { useState } from 'react';
import { usePlan } from '../context/PlanContext';
import { HAZARD_SCENARIOS } from '../data/officialGuidance';
import { HazardScenario } from '../types';

export const HazardsPage: React.FC = () => {
  const { setCurrentStep } = usePlan();
  
  // Selected Hazard for Modal/Detail
  const [selectedHazard, setSelectedHazard] = useState<HazardScenario | null>(HAZARD_SCENARIOS[0]);
  
  // Quiz Selection per Hazard
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});

  const handleSelectAnswer = (hazardId: string, optionId: string) => {
    setQuizAnswers(prev => ({ ...prev, [hazardId]: optionId }));
  };

  return (
    <div className="space-y-6 py-2">
      {/* Title */}
      <div className="text-center md:text-left space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 flex items-center justify-center md:justify-start gap-2">
          <span>🌏</span>
          <span>災害來了，都要往同一個地方嗎？</span>
        </h1>
        <p className="text-sm text-stone-600">
          不同危險，需要不同的避難方向與應對方式。
        </p>
      </div>

      {/* Hazard Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {HAZARD_SCENARIOS.map((hazard) => {
          const isSelected = selectedHazard?.id === hazard.id;
          return (
            <button
              key={hazard.id}
              onClick={() => setSelectedHazard(hazard)}
              className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                isSelected
                  ? 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-300 scale-103 font-bold'
                  : 'bg-white text-stone-800 border-stone-200 hover:border-amber-300 hover:bg-stone-50'
              }`}
            >
              <span className="text-3xl">{hazard.icon}</span>
              <span className="text-xs font-bold">{hazard.name}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Hazard Scenario Detail & Quiz */}
      {selectedHazard && (
        <section className="bg-white rounded-3xl p-6 border border-amber-200 shadow-sm space-y-5">
          <div className="flex items-start justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{selectedHazard.icon}</span>
              <div>
                <h2 className="text-xl font-extrabold text-stone-900">
                  {selectedHazard.name} - 情境避難應變
                </h2>
                <p className="text-xs text-stone-500">
                  {selectedHazard.shortDesc}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full shrink-0">
              {selectedHazard.category === 'natural' ? '自然災害' : '全民防衛應變'}
            </span>
          </div>

          {/* Key Principle Box */}
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-1">
            <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <span>🧭</span>
              <span>核心避難原則：</span>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed font-medium">
              {selectedHazard.keyPrinciple}
            </p>
          </div>

          {/* Interactive Quiz Question */}
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-md">
                情境思考題
              </span>
              <h3 className="font-bold text-stone-900 text-base">
                {selectedHazard.quizQuestion.title}
              </h3>
              <p className="text-xs text-stone-500 italic">
                情境說明：{selectedHazard.quizQuestion.scenario}
              </p>
            </div>

            <div className="space-y-2">
              {selectedHazard.quizQuestion.options.map((opt) => {
                const isSelected = quizAnswers[selectedHazard.id] === opt.id;
                let btnStyle = "bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100";
                if (isSelected) {
                  btnStyle = opt.isCorrect
                    ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold"
                    : "bg-amber-50 border-amber-400 text-amber-950 font-medium";
                }

                return (
                  <div key={opt.id} className="space-y-2">
                    <button
                      onClick={() => handleSelectAnswer(selectedHazard.id, opt.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs md:text-sm transition cursor-pointer flex items-center gap-3 ${btnStyle}`}
                    >
                      <span className="font-bold text-amber-600 shrink-0">{opt.id.toUpperCase()}</span>
                      <span className="flex-1">{opt.label}</span>
                    </button>

                    {isSelected && (
                      <div className={`p-4 rounded-2xl text-xs leading-relaxed border ${
                        opt.isCorrect
                          ? 'bg-emerald-100/90 text-emerald-900 border-emerald-300 font-medium'
                          : 'bg-amber-100/90 text-amber-900 border-amber-300'
                      }`}>
                        <div className="font-bold mb-0.5">
                          {opt.isCorrect ? '✓ 答對了！' : '💡 再想想看：'}
                        </div>
                        <div>{opt.explanation}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Official Book Chapter Link */}
          <div className="pt-2 flex items-center justify-between border-t border-stone-100 text-xs">
            <span className="text-stone-500 font-medium">📖 想了解更多應變細節？</span>
            <a
              href={selectedHazard.officialChapterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>閱讀《臺灣全民安全指引》官方連結</span>
              <span>↗</span>
            </a>
          </div>
        </section>
      )}

      {/* Next Step Guidance Box */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-lg font-bold text-amber-400">
            📍 理解災害別後，來找到適合你們家避難的地點
          </h3>
          <p className="text-xs text-stone-300">
            接下來的地圖工具將幫你判斷「地震避難收容處所」與「防空避難處所」的適宜性。
          </p>
        </div>

        <button
          onClick={() => setCurrentStep(5)}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-2xl shadow-md transition cursor-pointer whitespace-nowrap"
        >
          前往避難地圖 →
        </button>
      </div>
    </div>
  );
};
