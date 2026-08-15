// 我的家庭安全避難計畫 - 計算邏輯與公式 (Calculations & Formulas)

import { FamilyMember, GoBagItem, ReadinessScore, FamilyPlanData } from '../types';

/**
 * 計算單一人員最低飲水量
 * 依據官方指引公式：每日最低 體重 × 15 ml，三日份即 體重 × 15 × 3 ml
 */
export function calculateWaterRequirement(weightKg: number, days = 3): {
  dailyMl: number;
  totalMl: number;
  totalKg: number;
  formattedText: string;
} {
  const safeWeight = Math.max(0, weightKg || 0);
  const dailyMl = safeWeight * 15;
  const totalMl = dailyMl * days;
  const totalKg = parseFloat((totalMl / 1000).toFixed(2));

  return {
    dailyMl,
    totalMl,
    totalKg,
    formattedText: `${totalMl.toLocaleString()} ml (${totalKg} kg)`
  };
}

/**
 * 計算特定成員或全家避難包的項目與總重量
 */
export function calculateBagWeightForMember(
  member: FamilyMember,
  allGoBagItems: GoBagItem[],
  allMembersCount: number
): {
  waterKg: number;
  foodKg: number;
  personalItemsKg: number;
  sharedSplitKg: number;
  totalKg: number;
  recommendedMaxKg: number;
  isOverweight: boolean;
} {
  // 1. 水分重量
  const waterInfo = calculateWaterRequirement(member.weight || 60, 3);
  const waterKg = waterInfo.totalKg;

  // 2. 成員專屬物品重量
  const memberItems = allGoBagItems.filter(item => item.ownerMemberId === member.id && !item.isShared);
  const personalItemsKg = memberItems.reduce((sum, item) => sum + (item.estimatedWeightKg * item.quantity), 0);

  // 3. 食物重量估計（若無自訂，依人天 0.4kg * 3天 = 1.2kg）
  const foodItems = memberItems.filter(i => i.category === 'food');
  const foodKg = foodItems.length > 0 
    ? foodItems.reduce((sum, item) => sum + (item.estimatedWeightKg * item.quantity), 0)
    : 1.2;

  // 4. 共用物資分攤重量
  const sharedItems = allGoBagItems.filter(item => item.isShared || !item.ownerMemberId);
  const totalSharedKg = sharedItems.reduce((sum, item) => sum + (item.estimatedWeightKg * item.quantity), 0);
  const memberCount = Math.max(1, allMembersCount);
  const sharedSplitKg = parseFloat((totalSharedKg / memberCount).toFixed(2));

  // 5. 空包基本重 0.8kg
  const basePackKg = 0.8;

  // 總重
  const totalKg = parseFloat((waterKg + personalItemsKg + foodKg + sharedSplitKg + basePackKg).toFixed(1));

  // 參考建議上限（男性 15kg，女性 10kg，青少年 12kg）
  let recommendedMaxKg = 12;
  if (member.gender === 'male' && member.age >= 18) recommendedMaxKg = 15;
  if (member.gender === 'female' && member.age >= 18) recommendedMaxKg = 10;
  if (member.age < 12) recommendedMaxKg = 5;

  return {
    waterKg,
    foodKg,
    personalItemsKg,
    sharedSplitKg,
    totalKg,
    recommendedMaxKg,
    isOverweight: totalKg > recommendedMaxKg
  };
}

/**
 * 評估家庭計畫準備狀況 (紅/黃/綠燈號評分)
 */
export function evaluatePlanReadiness(plan: FamilyPlanData): ReadinessScore {
  const topActions: string[] = [];

  // 1. 成員資料
  const familyMemberScore = plan.members.length > 0 ? 'green' : 'red';
  if (plan.members.length === 0) {
    topActions.push('填寫家庭成員資訊與需求');
  }

  // 檢查特殊需求是否有準備物品
  const specialMembers = plan.members.filter(m => m.specialNeeds && m.specialNeeds.length > 0);
  if (specialMembers.length > 0) {
    specialMembers.forEach(m => {
      if (m.specialNeeds.includes('daily_medicine')) {
        topActions.push(`為 ${m.customName || m.relation} 準備至少 7 日份慢性病個人用藥`);
      }
    });
  }

  // 2. 避難包物資
  const goBagScore = plan.goBagItems.length >= 8 ? 'green' : plan.goBagItems.length >= 4 ? 'yellow' : 'red';
  if (plan.goBagItems.length < 5) {
    topActions.push('準備個人緊急避難包的基本飲水與手電筒');
  }

  // 3. 居家儲備物資
  const householdSupplyScore = plan.householdSupplies.some(s => s.isReady) ? 'yellow' : 'red';
  if (!plan.householdSupplies.some(s => s.isReady)) {
    topActions.push('整理全家至少 7 天份的居家糧食與飲水儲備');
  }

  // 4. 避難地點選定
  const selectedLocationCount = Object.keys(plan.hazardShelters || {}).length;
  const locationScore = selectedLocationCount >= 3 ? 'green' : selectedLocationCount >= 1 ? 'yellow' : 'red';
  if (selectedLocationCount < 2) {
    topActions.push('查明並記錄住家附近適合地震與防空之避難處所');
  }

  // 5. 集合點
  const meetingPointScore = (plan.primaryMeetingPoint.name && plan.secondaryMeetingPoint.name)
    ? 'green'
    : plan.primaryMeetingPoint.name
    ? 'yellow'
    : 'red';
  if (!plan.primaryMeetingPoint.name) {
    topActions.push('與家人討論並約定住家附近的第一集合點');
  }

  // 6. 通訊預備方案
  const communicationScore = (plan.offlineCommunications && plan.offlineCommunications.length > 0) ? 'green' : 'yellow';
  if (!plan.offlineCommunications || plan.offlineCommunications.length === 0) {
    topActions.push('確認手機通訊中斷時的官方廣播與報平安專線');
  }

  // 選取前 3 個最重要的行動
  const uniqueTopActions = Array.from(new Set(topActions)).slice(0, 3);
  if (uniqueTopActions.length === 0) {
    uniqueTopActions.push('定期與家人共同檢查避難包與食品有效期限');
    uniqueTopActions.push('實地走訪一次第一集合點與避難路線');
    uniqueTopActions.push('將計畫列印或保存於手機中');
  }

  return {
    familyMemberScore,
    goBagScore,
    householdSupplyScore,
    locationScore,
    meetingPointScore,
    communicationScore,
    topActions: uniqueTopActions
  };
}
