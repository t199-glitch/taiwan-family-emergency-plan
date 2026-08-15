// 我的家庭安全避難計畫 - 上一步/下一步 導覽列 (BottomNav)

import React from 'react';
import { usePlan } from '../context/PlanContext';

export const BottomNav: React.FC = () => {
  const { plan, setCurrentStep, markStepCompleted } = usePlan();
  const current = plan.currentStep;

  const getNextButtonText = () => {
    switch (current) {
      case 0: return '開始建立我的家庭安全計畫 →';
      case 1: return '下一步：我們需要準備什麼？ →';
      case 2: return '建立我的家庭避難包 →';
      case 3: return '下一步：認識不同災害 →';
      case 4: return '下一步：找到適合的避難地點 →';
      case 5: return '下一步：和家人建立集合計畫 →';
      case 6: return '產生我的家庭安全計畫 →';
      case 7: return '🛡️ 下載 / 列印家庭安全計畫';
      default: return '下一步 →';
    }
  };

  const handleNext = () => {
    markStepCompleted(current);
    if (current < 7) {
      setCurrentStep(current + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrentStep(current - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 py-3.5 px-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {current > 0 ? (
          <button
            onClick={handlePrev}
            className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 bg-white hover:bg-stone-50 text-sm font-semibold transition active:scale-95 cursor-pointer shadow-2xs"
          >
            ← 上一步
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={handleNext}
          className="flex-1 md:flex-none ml-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-sm md:text-base transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{getNextButtonText()}</span>
        </button>
      </div>
    </div>
  );
};
