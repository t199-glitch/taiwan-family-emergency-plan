// 我的家庭安全避難計畫 - 全站 React Context 狀態管理 (PlanContext)

import React, { createContext, useContext, useState, useEffect } from 'react';
import { FamilyMember, GoBagItem, HouseholdSupply, FamilyPlanData } from '../types';
import { DEFAULT_GO_BAG_PRESETS, DEFAULT_HOUSEHOLD_SUPPLIES } from '../data/officialGuidance';

const STORAGE_KEY = 'my_family_safety_plan_v1';

const DEFAULT_MEMBER: FamilyMember = {
  id: 'member_self',
  relation: '我',
  customName: '我',
  age: 17,
  gender: 'male',
  height: 175,
  weight: 70,
  specialNeeds: []
};

const DEFAULT_PLAN_DATA: FamilyPlanData = {
  members: [DEFAULT_MEMBER],
  goBagItems: DEFAULT_GO_BAG_PRESETS,
  householdSupplies: DEFAULT_HOUSEHOLD_SUPPLIES,
  primaryMeetingPoint: {
    name: '住家附近OO公園',
    address: '公園正門大樹旁告示牌前',
    note: '若住家受損無法待著，全家第一優先在此集合'
  },
  secondaryMeetingPoint: {
    name: 'OO國民小學體育館大門',
    address: '校門口司令台後方區域',
    note: '若第一集合點遭受破壞或危險時的備用集合點'
  },
  offlineCommunications: ['廣播收音機', '村里辦公室公告欄', '1991報平安專線'],
  customOfflineCommsText: '',
  memberResponsibilities: {
    'member_self': '攜帶全家共用急救包與手電筒、維護通訊廣播'
  },
  thoughtExperimentAnswer: '若爸爸在公司、媽媽在家、我在學校，且手機完全無訊號，我們約定在下午5點或強震結束後，於「住家附近OO公園」正門告示牌集合。',
  hazardShelters: {
    'earthquake': '住家附近學校避難收容處所',
    'air_raid': '附近捷運站地下防空避難處所'
  },
  completedSteps: [0],
  currentStep: 0,
  lastUpdated: new Date().toISOString()
};

interface PlanContextType {
  plan: FamilyPlanData;
  setCurrentStep: (step: number) => void;
  markStepCompleted: (step: number) => void;
  addMember: (member: Omit<FamilyMember, 'id'>) => void;
  updateMember: (id: string, updated: Partial<FamilyMember>) => void;
  removeMember: (id: string) => void;
  addGoBagItem: (item: Omit<GoBagItem, 'id'>) => void;
  updateGoBagItem: (id: string, updated: Partial<GoBagItem>) => void;
  removeGoBagItem: (id: string) => void;
  toggleHouseholdSupplyReady: (id: string) => void;
  updateMeetingPoints: (primary: FamilyPlanData['primaryMeetingPoint'], secondary: FamilyPlanData['secondaryMeetingPoint']) => void;
  updateOfflineComms: (comms: string[], customText: string) => void;
  updateMemberResponsibility: (memberId: string, duty: string) => void;
  updateThoughtExperiment: (answer: string) => void;
  updateHazardShelter: (hazardId: string, shelterName: string) => void;
  resetPlan: () => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plan, setPlan] = useState<FamilyPlanData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load plan from localStorage', e);
    }
    return DEFAULT_PLAN_DATA;
  });

  // 自動寫入 LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch (e) {
      console.warn('Failed to save plan to localStorage', e);
    }
  }, [plan]);

  const setCurrentStep = (step: number) => {
    setPlan(prev => {
      const completed = prev.completedSteps.includes(step) ? prev.completedSteps : [...prev.completedSteps, step];
      return {
        ...prev,
        currentStep: step,
        completedSteps: completed,
        lastUpdated: new Date().toISOString()
      };
    });
  };

  const markStepCompleted = (step: number) => {
    setPlan(prev => {
      if (prev.completedSteps.includes(step)) return prev;
      return { ...prev, completedSteps: [...prev.completedSteps, step] };
    });
  };

  const addMember = (memberData: Omit<FamilyMember, 'id'>) => {
    const id = `member_${Date.now()}`;
    const newMember: FamilyMember = { ...memberData, id };
    
    // 自動根據特殊需求增加對應物品
    const autoItems: GoBagItem[] = [];
    if (newMember.specialNeeds.includes('daily_medicine')) {
      autoItems.push({
        id: `item_med_${id}`,
        category: 'medical',
        name: `${newMember.customName || newMember.relation} 的個人處方用藥 (7日份)`,
        quantity: 1,
        unit: '份',
        estimatedWeightKg: 0.2,
        ownerMemberId: id,
        isShared: false,
        isAutoAdded: true
      });
    }
    if (newMember.specialNeeds.includes('glasses')) {
      autoItems.push({
        id: `item_glasses_${id}`,
        category: 'special',
        name: `${newMember.customName || newMember.relation} 的備用眼鏡`,
        quantity: 1,
        unit: '副',
        estimatedWeightKg: 0.1,
        ownerMemberId: id,
        isShared: false,
        isAutoAdded: true
      });
    }
    if (newMember.specialNeeds.includes('sanitary')) {
      autoItems.push({
        id: `item_sanitary_${id}`,
        category: 'hygiene',
        name: `${newMember.customName || newMember.relation} 的生理用品`,
        quantity: 1,
        unit: '包',
        estimatedWeightKg: 0.3,
        ownerMemberId: id,
        isShared: false,
        isAutoAdded: true
      });
    }
    if (newMember.specialNeeds.includes('infant')) {
      autoItems.push({
        id: `item_infant_${id}`,
        category: 'special',
        name: `嬰幼兒奶粉/尿布/奶瓶`,
        quantity: 1,
        unit: '組',
        estimatedWeightKg: 1.0,
        ownerMemberId: id,
        isShared: false,
        isAutoAdded: true
      });
    }
    if (newMember.specialNeeds.includes('pet')) {
      autoItems.push({
        id: `item_pet_${id}`,
        category: 'special',
        name: `寵物飼料/牽繩/水碗`,
        quantity: 1,
        unit: '組',
        estimatedWeightKg: 0.8,
        ownerMemberId: id,
        isShared: false,
        isAutoAdded: true
      });
    }

    setPlan(prev => ({
      ...prev,
      members: [...prev.members, newMember],
      goBagItems: [...prev.goBagItems, ...autoItems]
    }));
  };

  const updateMember = (id: string, updated: Partial<FamilyMember>) => {
    setPlan(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === id ? { ...m, ...updated } : m)
    }));
  };

  const removeMember = (id: string) => {
    setPlan(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== id),
      goBagItems: prev.goBagItems.filter(item => item.ownerMemberId !== id)
    }));
  };

  const addGoBagItem = (itemData: Omit<GoBagItem, 'id'>) => {
    const id = `item_${Date.now()}`;
    setPlan(prev => ({
      ...prev,
      goBagItems: [...prev.goBagItems, { ...itemData, id }]
    }));
  };

  const updateGoBagItem = (id: string, updated: Partial<GoBagItem>) => {
    setPlan(prev => ({
      ...prev,
      goBagItems: prev.goBagItems.map(item => item.id === id ? { ...item, ...updated } : item)
    }));
  };

  const removeGoBagItem = (id: string) => {
    setPlan(prev => ({
      ...prev,
      goBagItems: prev.goBagItems.filter(item => item.id !== id)
    }));
  };

  const toggleHouseholdSupplyReady = (id: string) => {
    setPlan(prev => ({
      ...prev,
      householdSupplies: prev.householdSupplies.map(s => s.id === id ? { ...s, isReady: !s.isReady } : s)
    }));
  };

  const updateMeetingPoints = (primary: FamilyPlanData['primaryMeetingPoint'], secondary: FamilyPlanData['secondaryMeetingPoint']) => {
    setPlan(prev => ({
      ...prev,
      primaryMeetingPoint: primary,
      secondaryMeetingPoint: secondary
    }));
  };

  const updateOfflineComms = (comms: string[], customText: string) => {
    setPlan(prev => ({
      ...prev,
      offlineCommunications: comms,
      customOfflineCommsText: customText
    }));
  };

  const updateMemberResponsibility = (memberId: string, duty: string) => {
    setPlan(prev => ({
      ...prev,
      memberResponsibilities: {
        ...prev.memberResponsibilities,
        [memberId]: duty
      }
    }));
  };

  const updateThoughtExperiment = (answer: string) => {
    setPlan(prev => ({
      ...prev,
      thoughtExperimentAnswer: answer
    }));
  };

  const updateHazardShelter = (hazardId: string, shelterName: string) => {
    setPlan(prev => ({
      ...prev,
      hazardShelters: {
        ...prev.hazardShelters,
        [hazardId]: shelterName
      }
    }));
  };

  const resetPlan = () => {
    if (window.confirm('確定要重置家庭安全計畫嗎？所有輸入資料將恢復預設值。')) {
      setPlan(DEFAULT_PLAN_DATA);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  return (
    <PlanContext.Provider
      value={{
        plan,
        setCurrentStep,
        markStepCompleted,
        addMember,
        updateMember,
        removeMember,
        addGoBagItem,
        updateGoBagItem,
        removeGoBagItem,
        toggleHouseholdSupplyReady,
        updateMeetingPoints,
        updateOfflineComms,
        updateMemberResponsibility,
        updateThoughtExperiment,
        updateHazardShelter,
        resetPlan
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within a PlanProvider');
  return ctx;
};
