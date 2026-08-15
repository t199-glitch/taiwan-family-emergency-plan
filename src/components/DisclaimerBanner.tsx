// 我的家庭安全避難計畫 - 官方聲明與免責條款 (DisclaimerBanner)

import React from 'react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-amber-100/90 border-l-4 border-amber-500 text-amber-900 p-3.5 rounded-r-xl text-xs leading-relaxed my-4 shadow-xs">
      <div className="flex items-start gap-2">
        <span className="text-base leading-none">⚠️</span>
        <div>
          <span className="font-bold">免責聲明與使用說明：</span>
          <span>
            本網站為教育與家庭防災準備學習工具，內容參考《臺灣全民安全指引》（小橘書）與內政部消防署指引。
            災害發生時，請以政府機關、警察、消防、民防人員及現場最新指示為準。網站提供的地點與資訊不能取代現場緊急避難指示。
          </span>
        </div>
      </div>
    </div>
  );
};
