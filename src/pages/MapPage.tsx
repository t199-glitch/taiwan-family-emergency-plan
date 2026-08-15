// PAGE 5｜我的家庭避難地圖 (MapPage.tsx)

import React, { useState } from 'react';
import { usePlan } from '../context/PlanContext';
import { MOCK_EMERGENCY_LOCATIONS } from '../data/mockShelters';
import { EmergencyLocation } from '../types';

const HAZARD_OPTIONS = [
  { id: 'earthquake', label: '地震', icon: '🌏', defaultLayer: 'shelter' },
  { id: 'typhoon_flood', label: '淹水/豪雨', icon: '🌧️', defaultLayer: 'shelter' },
  { id: 'tsunami', label: '海嘯', icon: '🌊', defaultLayer: 'high_ground' },
  { id: 'air_raid', label: '空襲警報', icon: '🚨', defaultLayer: 'air_raid' }
];

export const MapPage: React.FC = () => {
  const { plan, updateHazardShelter } = usePlan();

  // User input locations
  const [homeAddress, setHomeAddress] = useState('臺北市大安區新生南路');
  const [schoolAddress, setSchoolAddress] = useState('臺北市立建國高級中學');

  // Selected Hazard Filter
  const [selectedHazard, setSelectedHazard] = useState('earthquake');
  const [selectedLocation, setSelectedLocation] = useState<EmergencyLocation | null>(MOCK_EMERGENCY_LOCATIONS[0]);

  // Filter shelters based on selected hazard
  const filteredLocations = MOCK_EMERGENCY_LOCATIONS.filter(loc => {
    if (selectedHazard === 'earthquake') return loc.suitableHazards.includes('earthquake');
    if (selectedHazard === 'air_raid') return loc.type === 'air_raid' || loc.suitableHazards.includes('air_raid');
    if (selectedHazard === 'tsunami') return loc.suitableHazards.includes('tsunami') || loc.type === 'park';
    return true;
  });

  const handleChooseShelterForHazard = (loc: EmergencyLocation) => {
    updateHazardShelter(selectedHazard, `${loc.name} (${loc.address})`);
    setSelectedLocation(loc);
  };

  return (
    <div className="space-y-6 py-2">
      {/* Title */}
      <div className="text-center md:text-left space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 flex items-center justify-center md:justify-start gap-2">
          <span>📍</span>
          <span>發生事情時，我們要去哪裡？</span>
        </h1>
        <p className="text-sm text-stone-600">
          不要只找最近的地方，先判斷「哪裡適合現在的危險」。
        </p>
      </div>

      {/* Main Grid: Desktop Left 35% / Right 65% */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left 35% (md:col-span-5): Settings & Recommendation List */}
        <div className="md:col-span-5 space-y-4">
          {/* User Location Input Box */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs space-y-3 text-xs">
            <h2 className="font-bold text-stone-900 text-sm flex items-center gap-2 border-b border-stone-100 pb-2">
              <span>🏠</span>
              <span>設定我的日常主要活動點</span>
            </h2>

            <div className="space-y-2">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">🏠 住家約略位置 / 行政區</label>
                <input
                  type="text"
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-hidden focus:border-amber-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-stone-600 font-semibold mb-1">🏫 學校 / 工作地點</label>
                <input
                  type="text"
                  value={schoolAddress}
                  onChange={(e) => setSchoolAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-hidden focus:border-amber-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Hazard Scenario Filter Tabs */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs space-y-3 text-xs">
            <h2 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <span>🧭</span>
              <span>切換災害情境與避難方向</span>
            </h2>

            <div className="grid grid-cols-2 gap-2">
              {HAZARD_OPTIONS.map((h) => {
                const isActive = selectedHazard === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => setSelectedHazard(h.id)}
                    className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm scale-102'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span>{h.icon}</span>
                    <span>{h.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Smart Suitability Alert */}
            {selectedHazard === 'tsunami' && (
              <div className="bg-amber-100/90 text-amber-950 p-3 rounded-xl border border-amber-300 text-[11px] leading-relaxed">
                ⚠️ <strong>海嘯避難提示：</strong>附近最近的學校若位於海岸低窪處，不宜作為海嘯避難點。應優先往高處（海拔20m以上）或高樓3樓以上撤離。
              </div>
            )}
            {selectedHazard === 'air_raid' && (
              <div className="bg-amber-100/90 text-amber-950 p-3 rounded-xl border border-amber-300 text-[11px] leading-relaxed">
                🚨 <strong>防空避難提示：</strong>請尋找防空避難標章之地下室、捷運車站地下層或地下停車場。
              </div>
            )}
          </div>

          {/* Recommended Locations List */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h2 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <span>🟢</span>
                <span>推薦之適合避難地點</span>
              </h2>
              <span className="text-[11px] text-stone-400 font-semibold">
                共 {filteredLocations.length} 筆
              </span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {filteredLocations.map((loc) => {
                const isSelected = selectedLocation?.id === loc.id;
                const isChosenInPlan = plan.hazardShelters[selectedHazard]?.includes(loc.name);

                return (
                  <div
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    className={`p-3 rounded-2xl border transition cursor-pointer text-xs space-y-1.5 ${
                      isSelected
                        ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-300'
                        : 'bg-stone-50 border-stone-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 flex items-center gap-1.5">
                        <span>{loc.type === 'air_raid' ? '🔵' : '🟢'}</span>
                        <span>{loc.name}</span>
                      </span>
                      <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded-md font-semibold">
                        {loc.type === 'air_raid' ? '防空處所' : '避難收容處所'}
                      </span>
                    </div>

                    <div className="text-stone-500">{loc.address}</div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-stone-400 text-[11px]">可容納：約 {loc.capacity.toLocaleString()} 人</span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChooseShelterForHazard(loc);
                        }}
                        className={`px-3 py-1 rounded-xl text-[11px] font-bold cursor-pointer transition ${
                          isChosenInPlan
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-500 hover:bg-amber-600 text-white'
                        }`}
                      >
                        {isChosenInPlan ? '✓ 已記錄至計畫' : '選定為避難點'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 65% (md:col-span-7): Interactive Map Visualization Box */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <span>🗺️</span>
                <span>全台防衛避難地圖展視圖</span>
              </h2>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> 我</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> 避難所</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span> 防空點</span>
              </div>
            </div>

            {/* Interactive Vector / Mock Canvas Map Preview Container */}
            <div className="relative w-full h-80 md:h-[450px] bg-stone-100 rounded-2xl overflow-hidden border border-stone-200 flex flex-col justify-between p-4 shadow-inner">
              {/* Map background grid pattern */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(#d97706 1px, transparent 1px)`,
                  backgroundSize: '24px 24px'
                }}
              />

              {/* Top info badge overlay */}
              <div className="relative z-10 bg-white/90 backdrop-blur-xs px-3.5 py-2 rounded-xl text-xs border border-stone-200/80 shadow-xs max-w-xs space-y-0.5">
                <div className="font-bold text-stone-900 flex items-center gap-1">
                  <span>📍 當前檢視：</span>
                  <span>{selectedLocation?.name || '請點選避難地點'}</span>
                </div>
                <div className="text-stone-500 text-[11px]">
                  {selectedLocation?.address || '點擊左側列表選定特定地點'}
                </div>
              </div>

              {/* Pins on the Map Visualizer */}
              <div className="relative z-10 my-auto flex flex-wrap items-center justify-center gap-6 p-4">
                {filteredLocations.map((loc) => {
                  const isSelected = selectedLocation?.id === loc.id;
                  return (
                    <button
                      key={loc.id}
                      onClick={() => setSelectedLocation(loc)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition transform cursor-pointer flex items-center gap-2 shadow-md ${
                        isSelected
                          ? 'bg-amber-500 text-white border-amber-600 scale-110 ring-4 ring-amber-200 z-20'
                          : loc.type === 'air_raid'
                          ? 'bg-sky-500 text-white border-sky-600 hover:scale-105'
                          : 'bg-emerald-600 text-white border-emerald-700 hover:scale-105'
                      }`}
                    >
                      <span className="text-base">{loc.type === 'air_raid' ? '🔵' : '🟢'}</span>
                      <span className="truncate max-w-[140px]">{loc.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom official data warning */}
              <div className="relative z-10 bg-amber-500/90 text-white text-[11px] p-2.5 rounded-xl font-semibold backdrop-blur-xs flex items-center justify-between">
                <span>⚠️ 若無法確認特定極端災害適宜性，請以現場警察消防與民防指引為準。</span>
              </div>
            </div>

            {/* Currently chosen shelters summary in Plan */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs space-y-2">
              <div className="font-bold text-stone-900 flex items-center gap-2">
                <span>📌</span>
                <span>已在我的家庭計畫中記錄的避難地點：</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(plan.hazardShelters || {}).map(([hazardKey, shelterName]) => (
                  <div key={hazardKey} className="bg-white p-2 rounded-xl border border-stone-200 flex items-center justify-between">
                    <span className="font-semibold text-amber-900">
                      {HAZARD_OPTIONS.find(h => h.id === hazardKey)?.label || hazardKey}：
                    </span>
                    <span className="text-stone-700 truncate max-w-[160px] font-medium">{shelterName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
