// 我的家庭安全避難計畫 - 官方資料庫與災害知識 (Official Guidance & Hazard Content)

import { HazardScenario, GoBagItem, HouseholdSupply } from '../types';

export const OFFICIAL_BOOK_INFO = {
  title: '《臺灣全民安全指引》（俗稱小橘書）',
  publisher: '中華民國國防部全民防衛動員署 / 內政部消防署',
  summary: '本指引為我國針對各類自然災害（地震、風災、海嘯）及空襲、軍事危機時之全民安全應變指南，強調平時準備、緊急避難與家庭自救能力。',
  officialUrl: 'https://aod.mnd.gov.tw/',
  ePointUrl: 'https://119.nfa.gov.tw/'
};

export const HAZARD_SCENARIOS: HazardScenario[] = [
  {
    id: 'earthquake',
    name: '地震',
    icon: '🌏',
    category: 'natural',
    shortDesc: '地震發生極為迅速，應立即採取「趴下、掩護、穩住」保護頭頸部。',
    keyPrinciple: '室內就地避難，遠離玻璃與掉落物；搖晃停止後再巡檢瓦斯電源，必要時攜避難包前往開闊避難點。',
    quizQuestion: {
      title: '強烈地震正在搖晃，你當時人在室內，第一時間你該怎麼做？',
      scenario: '地面劇烈搖晃，吊燈與櫃子上物品開始傾倒！',
      options: [
        {
          id: 'a',
          label: '立即搭乘電梯或衝出大樓外',
          isCorrect: false,
          explanation: '再想想看！搖晃時強行移動容易被掉落物品砸傷，且電梯極可能因停電停擺而困住。應先就地掩護！'
        },
        {
          id: 'b',
          label: '立即趴下、掩護於堅固桌下，抓住桌腳保護頭頸',
          isCorrect: true,
          explanation: '答對了！「趴下 (Drop)、掩護 (Cover)、穩住 (Hold on)」是國際公認地震發生瞬間最安全有效的自我防衛防禦姿勢。'
        },
        {
          id: 'c',
          label: '跑去開大門並站在門框下',
          isCorrect: false,
          explanation: '再想想看！現代建築門框並不比室內其他結構更堅固，且強震中移動極易摔倒砸傷。桌下掩護才是最佳選擇！'
        }
      ]
    },
    officialChapterTitle: '小橘書第 1 章：自然災害應變 - 地震篇',
    officialChapterUrl: 'https://aod.mnd.gov.tw/',
    suitableShelterTypes: ['shelter', 'park']
  },
  {
    id: 'typhoon_flood',
    name: '颱風與豪雨淹水',
    icon: '🌧️',
    category: 'natural',
    shortDesc: '豪雨易引發積淹水與道路中斷，應隨時留意發布之警戒資訊。',
    keyPrinciple: '預先清理排水孔與裝設防水閘門；若發布強制撤離，應提早依官方指引前往高處或收容所。',
    quizQuestion: {
      title: '低窪地區發布豪雨淹水警戒，且水深已開始上升至腳踝，你會怎麼做？',
      scenario: '外面雨勢極大，道路已有積水現象。',
      options: [
        {
          id: 'a',
          label: '繼續留在地下室清理積水物品',
          isCorrect: false,
          explanation: '再想想看！地下室極易因瞬間暴雨淹沒出口而造成溺水危險，積水時絕不可滯留地下室！'
        },
        {
          id: 'b',
          label: '關閉水電瓦斯總開關，提早攜避難包前往二樓以上或指定的避難收容處所',
          isCorrect: true,
          explanation: '答對了！淹水時應避免徒步涉水過深道路，預先切斷水電電源並往高處或避難所撤離是最安全的做法。'
        },
        {
          id: 'c',
          label: '開車涉水強行通過積水路段',
          isCorrect: false,
          explanation: '再想想看！水深超過輪胎一半就極易造成引擎熄火漂流，強行開車非常危險！'
        }
      ]
    },
    officialChapterTitle: '小橘書第 1 章：風災淹水應變',
    officialChapterUrl: 'https://aod.mnd.gov.tw/',
    suitableShelterTypes: ['shelter', 'high_ground']
  },
  {
    id: 'tsunami',
    name: '海嘯',
    icon: '🌊',
    category: 'natural',
    shortDesc: '沿海地區強震後或收到海嘯警報時，時間就是生命！',
    keyPrinciple: '海嘯避難三原則：「往高處、往內陸、立即行動」。不要留在海岸邊觀浪。',
    quizQuestion: {
      title: '若你在海岸邊旅遊時感受到強烈地震，或聽到海岸海嘯海嘯警報聲響起？',
      scenario: '海岸水面出現異常快速退潮或巨大浪聲。',
      options: [
        {
          id: 'a',
          label: '走向海灘觀察海水是否有異常退潮',
          isCorrect: false,
          explanation: '再想想看！海嘯波速極快，看到巨浪時通常已來不及逃跑。絕不能觀浪！'
        },
        {
          label: '立即往高處（海拔20公尺以上或高樓3樓以上）及內陸方向迅速撤離',
          isCorrect: true,
          id: 'b',
          explanation: '答對了！「往高處、往內陸」是海嘯生存黃金法則。迅速離開海岸區並登上堅固高處才是正解。'
        },
        {
          id: 'c',
          label: '回到海邊車上等候官方廣播通知',
          isCorrect: false,
          explanation: '再想想看！海嘯會衝刷沿海車輛，停留在海岸邊車內極危險！'
        }
      ]
    },
    officialChapterTitle: '小橘書第 1 章：海嘯避難指引',
    officialChapterUrl: 'https://aod.mnd.gov.tw/',
    suitableShelterTypes: ['high_ground', 'shelter']
  },
  {
    id: 'mudslide',
    name: '土石流',
    icon: '⛰️',
    category: 'natural',
    shortDesc: '山坡地山區豪雨時，需嚴防土石流與道路崩塌。',
    keyPrinciple: '土石流避難應順著山坡側向（垂直土石流流向）往高處逃生，切勿順著溪谷方向向下跑。',
    quizQuestion: {
      title: '居住於土石流潛勢區，當豪雨警戒達紅色警戒時，應如何選擇避難路線？',
      scenario: '山區溪水變得混濁並伴隨巨大石頭撞擊聲。',
      options: [
        {
          id: 'a',
          label: '沿著溪谷向下游跑',
          isCorrect: false,
          explanation: '再想想看！土石流沿溪谷向下下衝速度極快，順溪流跑很容易被掩埋。'
        },
        {
          id: 'b',
          label: '垂直於土石流移動方向，往兩側高處的安全地點撤離',
          isCorrect: true,
          explanation: '答對了！垂直側向逃生能最快離開土石流路徑，並進入安全高地！'
        }
      ]
    },
    officialChapterTitle: '小橘書第 1 章：土石流與山坡地防灾',
    officialChapterUrl: 'https://aod.mnd.gov.tw/',
    suitableShelterTypes: ['shelter', 'high_ground']
  },
  {
    id: 'air_raid',
    name: '空襲警報',
    icon: '🚨',
    category: 'human_made',
    shortDesc: '聽到防空警報（長音15秒、短音5秒）或手機國家級警報時。',
    keyPrinciple: '室外人員立即進入地下防空避難處所；室內人員切斷電源瓦斯，避開窗戶戶外，採跪姿護頭保護耳膜眼部。',
    quizQuestion: {
      title: '防空警報響起時，如果你正位於家中室內，最正確的防護姿勢與位置是？',
      scenario: '防空警報聲在大街上響起，伴隨警報訊息。',
      options: [
        {
          id: 'a',
          label: '站在大陽台或靠窗戶處觀察外面狀況',
          isCorrect: false,
          explanation: '再想想看！爆炸衝擊波會震碎窗戶玻璃造成嚴重割傷，空襲時必須遠離所有窗戶！'
        },
        {
          id: 'b',
          label: '進入無窗戶之房間或地下室，採「雙膝跪地、拱背、雙手遮掩眼耳、嘴巴微張」姿勢',
          isCorrect: true,
          explanation: '答對了！這能有效防止震波傷害耳膜、胸腔與眼部，並避免玻璃碎片割傷。'
        },
        {
          id: 'c',
          label: '跑到頂樓搭乘電梯離開',
          isCorrect: false,
          explanation: '再想想看！頂樓易遭受直接衝擊，且空襲時極易停電導致困在電梯。'
        }
      ]
    },
    officialChapterTitle: '小橘書第 2 章：防空避難與警報應對',
    officialChapterUrl: 'https://aod.mnd.gov.tw/',
    suitableShelterTypes: ['air_raid']
  },
  {
    id: 'military_crisis',
    name: '軍事危機與基礎設施中斷',
    icon: '⚔️',
    category: 'human_made',
    shortDesc: '面對極端情境時，以「保護自己與家人生命安全」為唯一核心。',
    keyPrinciple: '依靠居家儲備與廣播獲取官方真實資訊；確認家庭集合點，防止資訊中斷時走散。',
    quizQuestion: {
      title: '若因突發危機導致行動網路與通訊極度不穩定時，家庭該如何獲取可靠消息與會合？',
      scenario: '手機網路訊號中斷，社群軟體無法登入。',
      options: [
        {
          id: 'a',
          label: '相信未經證實的網路傳言並盲目出門奔跑',
          isCorrect: false,
          explanation: '再想想看！資訊混亂時貿然外出極易陷入危險，應先依預定計畫進行。'
        },
        {
          id: 'b',
          label: '開啟電池式收容廣播收聽官方頻道，並前往平時約定好的第一/第二家庭集合點',
          isCorrect: true,
          explanation: '答對了！廣播與事先約定的實體集合點是通訊中斷時最可靠的家庭安全保障。'
        }
      ]
    },
    officialChapterTitle: '小橘書第 3 章：危機防護與資訊確認',
    officialChapterUrl: 'https://aod.mnd.gov.tw/',
    suitableShelterTypes: ['air_raid', 'shelter']
  }
];

export const DEFAULT_GO_BAG_PRESETS: GoBagItem[] = [
  // 水與糧食
  { id: 'item_water', category: 'water', name: '個人飲用水 (3日份)', quantity: 1, unit: '組', estimatedWeightKg: 3.15, isShared: false, note: '依體重x15mlx3天計算' },
  { id: 'item_food', category: 'food', name: '高熱量耐保存乾糧/罐頭', quantity: 3, unit: '日份', estimatedWeightKg: 1.2, isShared: false, note: '巧克力、餅乾、能量棒' },
  
  // 醫療護理
  { id: 'item_first_aid', category: 'medical', name: '急救包 (OK繃/紗布/消毒)', quantity: 1, unit: '組', estimatedWeightKg: 0.4, isShared: true, note: '全家共用' },
  { id: 'item_mask', category: 'medical', name: '防塵口罩 (N95/醫用)', quantity: 5, unit: '個', estimatedWeightKg: 0.1, isShared: false },
  
  // 照明與工具
  { id: 'item_flashlight', category: 'tools', name: 'LED手電筒 (含備用電池)', quantity: 1, unit: '支', estimatedWeightKg: 0.25, isShared: false },
  { id: 'item_whistle', category: 'tools', name: '高分貝求救哨', quantity: 1, unit: '個', estimatedWeightKg: 0.05, isShared: false, note: '隨身掛於包包外側' },
  { id: 'item_multi_tool', category: 'tools', name: '多功能瑞士刀/工具鉗', quantity: 1, unit: '把', estimatedWeightKg: 0.2, isShared: true },
  { id: 'item_radio', category: 'tools', name: '手搖/電池式防災收音機', quantity: 1, unit: '台', estimatedWeightKg: 0.3, isShared: true, note: '收聽官方廣播' },
  { id: 'item_powerbank', category: 'tools', name: '行動電源與充電線', quantity: 1, unit: '組', estimatedWeightKg: 0.3, isShared: false },

  // 保暖防護
  { id: 'item_blanket', category: 'warmth', name: '保暖救生毯 / 輕量雨衣', quantity: 1, unit: '件', estimatedWeightKg: 0.2, isShared: false },
  { id: 'item_gloves', category: 'warmth', name: '防滑工作手套', quantity: 1, unit: '雙', estimatedWeightKg: 0.1, isShared: false },

  // 重要證件與現金
  { id: 'item_docs', category: 'important_docs', name: '重要證件影本與緊急聯絡卡', quantity: 1, unit: '份', estimatedWeightKg: 0.1, isShared: false, note: '防水夾鏈袋裝' },
  { id: 'item_cash', category: 'important_docs', name: '少量零錢與現金 (含百元鈔)', quantity: 1, unit: '份', estimatedWeightKg: 0.1, isShared: false }
];

export const DEFAULT_HOUSEHOLD_SUPPLIES: HouseholdSupply[] = [
  { id: 'hs_water', category: 'water', name: '瓶裝飲用水 (每人每日3L x 7天)', recommendedAmount: '全家共 84 公升', currentAmount: '24 公升', isReady: false },
  { id: 'hs_food', category: 'food', name: '主食與罐頭糧食 (7天份)', recommendedAmount: '白米、泡麵、罐頭、冷凍食品', currentAmount: '5 天份', isReady: true },
  { id: 'hs_firstaid', category: 'first_aid', name: '家庭家庭常備藥箱', recommendedAmount: '退燒、止痛、止瀉、外傷藥水', currentAmount: '已備齊', isReady: true },
  { id: 'hs_energy', category: 'energy', name: '卡式爐與瓦斯罐 (3-5罐)', recommendedAmount: '停電停氣時烹煮使用', currentAmount: '瓦斯罐 2 罐', isReady: false },
  { id: 'hs_daily', category: 'daily', name: '衛生紙、濕紙巾與大型垃圾袋', recommendedAmount: '衛生與簡易排泄處理', currentAmount: '已備齊', isReady: true }
];
