// 我的家庭安全避難計畫 - 頂部動態進度條 (HeaderProgress)

import React from 'react';
import { usePlan } from '../context/PlanContext';

export const STEPS = [
  { id: 0, label: '首頁', icon: '🏠', path: '/' },
  { id: 1, label: '認識家人', icon: '👨‍👩‍👧‍👦', path: '/family' },
  { id: 2, label: '閱讀小橘書', icon: '📖', path: '/prepare' },
  { id: 3, label: '我的避難包', icon: '🎒', path: '/go-bag' },
  { id: 4, label: '認識災害', icon: '🌏', path: '/hazards' },
  { id: 5, label: '避難地圖', icon: '📍', path: '/map' },
  { id: 6, label: '家庭約定', icon: '🤝', path: '/family-plan' },
  { id: 7, label: '完成計畫', icon: '🛡️', path: '/my-plan' }
];

export const HeaderProgress: React.FC = () => {
  const { plan, setCurrentStep } = usePlan();
  const current = plan.currentStep;

  return (
    <header className="bg-amber-50/90 backdrop-blur-md border-b border-amber-200/80 sticky top-0 z-40 shadow-xs transition-all">
      <div className="max-w-6xl mx-auto px-4 py-3">
        {/* Brand Title & Desktop Progress */}
        <div className="flex items-center justify-between mb-2">
          <button 
            onClick={() => setCurrentStep(0)}
            className="flex items-center gap-2 text-amber-900 font-bold text-lg hover:opacity-80 transition cursor-pointer"
          >
            <span className="text-2xl">🛡️</span>
            <span>我的家庭安全避難計畫</span>
          </button>
          
          <div className="text-xs text-amber-800/80 hidden md:block font-medium">
            跟著小橘書，一步一步為自己與家人做好準備
          </div>
        </div>

        {/* Desktop Step Indicator */}
        <nav aria-label="專案進度" className="hidden md:flex items-center justify-between gap-1 mt-2">
          {STEPS.slice(1).map((step) => {
            const isActive = current === step.id;
            const isCompleted = plan.completedSteps.includes(step.id);

            let badgeStyle = "bg-stone-100 text-stone-600 hover:bg-amber-100/70 border border-stone-200";
            if (isActive) {
              badgeStyle = "bg-amber-500 text-white font-bold shadow-md ring-2 ring-amber-300 border-amber-500 scale-105";
            } else if (isCompleted) {
              badgeStyle = "bg-emerald-500 text-white font-semibold border-emerald-500";
            }

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${badgeStyle}`}
              >
                <span>{step.icon}</span>
                <span className="truncate">{step.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile Step Header */}
        <div className="md:hidden mt-1 flex items-center justify-between bg-amber-100/80 px-3 py-1.5 rounded-lg text-xs">
          <span className="font-bold text-amber-900 flex items-center gap-1.5">
            <span>{STEPS[current]?.icon || '🛡️'}</span>
            <span>STEP {current} / 7：{STEPS[current]?.label || '首頁'}</span>
          </span>
          <span className="text-amber-800/80 font-medium">
            已完成 {plan.completedSteps.filter(s => s > 0).length} / 7 步驟
          </span>
        </div>

        {/* Mobile Progress Bar Line */}
        <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden md:hidden">
          <div 
            className="bg-amber-500 h-full transition-all duration-300"
            style={{ width: `${(Math.max(current, 0) / 7) * 100}%` }}
          />
        </div>
      </div>
    </header>
  );
};
