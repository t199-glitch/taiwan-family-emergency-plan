// 我的家庭安全避難計畫 - TypeScript Data Models

export type RelationType = '我' | '爸爸' | '媽媽' | '哥哥' | '姊姊' | '弟弟' | '妹妹' | '爺爺' | '奶奶' | '寵物' | '其他';

export type SpecialNeedTag = 
  | 'daily_medicine'
  | 'glasses'
  | 'hearing_aid'
  | 'limited_mobility'
  | 'infant'
  | 'sanitary'
  | 'pet'
  | 'other';

export interface FamilyMember {
  id: string;
  relation: RelationType;
  customName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  specialNeeds: SpecialNeedTag[];
  customSpecialNeedText?: string;
}

export type ItemCategory = 'water' | 'food' | 'medical' | 'tools' | 'warmth' | 'hygiene' | 'important_docs' | 'special';

export interface GoBagItem {
  id: string;
  category: ItemCategory;
  name: string;
  quantity: number;
  unit: string;
  estimatedWeightKg: number;
  ownerMemberId?: string; // If assigned to a specific member
  isShared: boolean; // If it's shared across family
  isAutoAdded?: boolean; // Added based on special needs
  note?: string;
}

export interface HouseholdSupply {
  id: string;
  category: 'water' | 'food' | 'first_aid' | 'daily' | 'energy';
  name: string;
  recommendedAmount: string;
  currentAmount: string;
  isReady: boolean;
}

export interface HazardQuizOption {
  id: string;
  label: string;
  isCorrect: boolean;
  explanation: string;
}

export interface HazardScenario {
  id: string;
  name: string;
  icon: string; // Emoji or Lucide icon key
  category: 'natural' | 'human_made';
  shortDesc: string;
  keyPrinciple: string;
  quizQuestion: {
    title: string;
    scenario: string;
    options: HazardQuizOption[];
  };
  officialChapterTitle: string;
  officialChapterUrl: string;
  suitableShelterTypes: ('shelter' | 'air_raid' | 'high_ground')[];
}

export interface EmergencyLocation {
  id: string;
  name: string;
  county: string;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'shelter' | 'air_raid' | 'park' | 'hospital';
  capacity: number;
  suitableHazards: string[]; // e.g. ['earthquake', 'tsunami', 'air_raid']
  phone?: string;
  isDangerZoneNotice?: boolean;
}

export interface FamilyPlanData {
  members: FamilyMember[];
  goBagItems: GoBagItem[];
  householdSupplies: HouseholdSupply[];
  primaryMeetingPoint: {
    name: string;
    address: string;
    note: string;
  };
  secondaryMeetingPoint: {
    name: string;
    address: string;
    note: string;
  };
  offlineCommunications: string[]; // e.g. ['廣播收音機', '村里辦公室通知板', '1991報平安專線']
  customOfflineCommsText: string;
  memberResponsibilities: Record<string, string>; // memberId -> duty
  thoughtExperimentAnswer: string;
  hazardShelters: Record<string, string>; // hazardId -> locationId or locationName
  completedSteps: number[];
  currentStep: number;
  lastUpdated: string;
}

export interface ReadinessScore {
  familyMemberScore: 'green' | 'yellow' | 'red';
  goBagScore: 'green' | 'yellow' | 'red';
  householdSupplyScore: 'green' | 'yellow' | 'red';
  locationScore: 'green' | 'yellow' | 'red';
  meetingPointScore: 'green' | 'yellow' | 'red';
  communicationScore: 'green' | 'yellow' | 'red';
  topActions: string[];
}
