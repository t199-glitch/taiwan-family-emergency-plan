# 🛡️ 我的家庭安全避難計畫 (My Family Emergency Safety Plan) - 產品規格與規劃書 (BRIEF.md)

> **引導臺灣高中生閱讀、理解並運用《臺灣全民安全指引》（俗稱「小橘書」），一步一步建立一份真正屬於自己與家人的安全避難計畫。**

---

## 1. 產品目標與使用者定位 (Product Goal & Target Audience)

### 🎯 產品目標
將政府發行的《臺灣全民安全指引》（小橘書）轉化為「互動式行動指引工具」。引導高中生自主閱讀、思考家庭需求、判斷災害風險、規劃物資與集合點，最終產出一份可與家人（父母、祖父母）共同討論與實踐的**「家庭安全避難計畫書」**。

### 👥 目標使用者
- **主要使用者**：臺灣高中生（約 16–18 歲），具備手機操作能力與學習自導能力。
- **延伸溝通對象**：高中生之家庭成員（ parents, grandparents, siblings，年齡層 16–70 歲）。

### 🎨 視覺與體驗原則
- **色調**：小橘書溫暖橘主色 (`#F97316` / `#EA580C`)、暖白背景 (`#FAFAF9`)、深藍內文 (`#1E293B`)、綠色完成 (`#10B981`)、黃色提醒 (`#F59E0B`)、紅色緊急 (`#EF4444`)。
- **風格**：現代手機 App × 質感地圖工具 × 家庭溫暖親和感。絕不使用廢墟、飛彈、軍事迷彩、血腥與災難恐怖圖片。
- **UX 心法**：非問卷、非測驗（錯了提供「再想想看」與解析）、無壓力學習（學一點 → 想一想 → 做決定 → 完成）。

---

## 2. 網站架構 (Sitemap)

```
🛡️ 我的家庭安全避難計畫 (App Root)
├── PAGE 0: 首頁 ( / ) - 願景引導與功能總覽
├── PAGE 1: 認識我的家人 ( /family ) - 成員與特殊需求登錄
├── PAGE 2: 閱讀小橘書與物資概念 ( /prepare ) - 小橘書導讀與避難包/儲備差異
├── PAGE 3: 我的家庭避難包 ( /go-bag ) - 個人化水份/重量計算與清單編輯
├── PAGE 4: 認識不同災害 ( /hazards ) - 6 大災害應對邏輯與情境題
├── PAGE 5: 我的家庭避難地圖 ( /map ) - 地圖層/災害切換/避難所適宜性判斷
├── PAGE 6: 我的家庭集合計畫 ( /family-plan ) - 兩階段集合點與通訊分工
└── PAGE 7: 完成我的家庭安全計畫 ( /my-plan ) - 總結報告/完成度評估/列印保存
```

---

## 3. 使用者旅程 (User Flow)

```
[ 首頁 ( / ) ]
  │  按下「開始建立我的家庭安全計畫」
  ▼
[ 1. 認識我的家人 ( /family ) ] ── (新增成員、年齡、身浮、體重、特殊需求)
  │  按下「下一步：我們需要準備什麼？」
  ▼
[ 2. 閱讀小橘書與物資概念 ( /prepare ) ] ── (選取情境物品、導讀小橘書、觀念問答)
  │  按下「建立我的家庭避難包」
  ▼
[ 3. 我的家庭避難包 ( /go-bag ) ] ── (計算水份 體重x15mlx3天、背包總重、微調物資)
  │  按下「下一步：認識不同災害」
  ▼
[ 4. 認識不同災害 ( /hazards ) ] ── (地震、淹水、海嘯、土石流、空襲、軍事侵略情境判斷)
  │  按下「下一步：找到適合的避難地點」
  ▼
[ 5. 我的家庭避難地圖 ( /map ) ] ── (設定家/校/工作地，切換災害情境與避難所適度提示)
  │  按下「下一步：和家人建立集合計畫」
  ▼
[ 6. 我的家庭集合計畫 ( /family-plan ) ] ── (設定第 1 & 2 集合點、無網路通訊、家庭分工)
  │  按下「產生我的家庭安全計畫」
  ▼
[ 7. 完成我的家庭安全計畫 ( /my-plan ) ] ── (檢查準備狀況紅黃綠、產出 PDF / 友善列印)
```

---

## 4. 7 大主頁面 Wireframe 規劃

### 📱 PAGE 0: 首頁 (`/`)
- **Header**: Logo 🛡️ 我的家庭安全避難計畫 + 全站進度條（7 步驟）
- **Hero Banner**:
  - 大標：🏠 和家人一起，做好安全準備
  - 副標：跟著小橘書，一步一步建立屬於你們家的安全避難計畫。
  - 4 個圖示特色卡：🎒 準備什麼 | 📍 去哪裡 | 🧭 怎麼避難 | 👨‍👩‍👧‍👦 家人怎麼照顧
  - **CTA**：大型橘色按鈕「開始建立我的家庭安全計畫 →」（標註：約 10–15 分鐘 | 手機可完成 | 自動存檔）
- **Section 2 (獲得什麼)**：3 張功能展示卡片（家庭物資、避難地圖、完整安全計畫）
- **Section 3**: 溫馨提醒「不用等災害發生才開始想，現在就和家人一起準備。」

---

### 📱 PAGE 1: 認識我的家人 (`/family`)
- **Header**: Progress STEP 1 / 7 👨‍👩‍👧‍👦 認識家人
- **Title**: 👨‍👩‍👧‍👦 先認識我們家
- **Default Member Card**: 成員「我」（可設定稱呼、年齡、性別、身高、體重）
- **Special Needs Checkboxes**:
  - ☐ 每日用藥  ☐ 眼鏡  ☐ 助聽器  ☐ 行動不便  ☐ 嬰幼兒  ☐ 女性生理用品  ☐ 寵物  ☐ 其他
- **Add Member Button**: ＋ 新增家人（快速選單：爸爸、媽媽、哥哥、姊姊、弟弟、妹妹、爺爺、奶奶、其他）
- **Member Cards Overview**: 展示全家卡片網格（包含基本數值與特殊需求標籤）
- **Footer Navigation**: [ 下一步：我們需要準備什麼？ → ]

---

### 📱 PAGE 2: 閱讀小橘書與物資概念 (`/prepare`)
- **Header**: Progress STEP 2 / 7 🎒 閱讀小橘書
- **Section 1 (情境思考)**:
  - 提問：「如果今天家裡突然不能待了，你只能帶一個包離開，你會帶什麼？」
  - 互動物品卡：水 💧、食物 🍙、手機 📱、藥物 💊、衣服 🧥、手電筒 🔦、證件 📄、其他 🧸
- **Section 2 (小橘書觀念)**:
  - 圖文說明：🎒 緊急避難包（隨身帶走 1-3 天） vs 🏠 居家儲備（留在家中 7 天以上）
  - 按鈕：📖 閱讀《臺灣全民安全指引》(開啟官方連結)
- **Section 3 (微觀答題)**:
  - 選擇題：「你覺得『避難包』和『居家儲備』最大的差別是什麼？」
  - 即時解析反饋（答錯提示「再想想看」，說明兩者用途）
- **Footer Navigation**: [ 建立我的家庭避難包 → ]

---

### 📱 PAGE 4: 我的家庭避難包 (`/go-bag`) (PAGE 3 in URL)
- **Header**: Progress STEP 3 / 7 🎒 家庭避難包
- **Member Tabs Switcher**: `[ 👦 我 ]` `[ 👨 爸爸 ]` `[ 👩 媽媽 ]` `[ 👵 奶奶 ]`
- **Dynamic Weight & Water Calculation**:
  - **飲水量**: `體重 (kg) × 15 ml × 3 天`（例如 70kg -> 3,150 ml = 3.15 kg）
  - **總重量**: 水 + 食物 + 個人物資 + 家庭共用物資 + 背包重
  - **負重標準提示**: 男性參考約 15 kg，女性參考約 10 kg（附註：以個人實際能力為準）
- **Visual Bag Breakdown**: 中央背包視覺示意圖，顯示各分類重與品項
- **Category Lists (可 ＋ － ✎ 🗑)**:
  - 👤 個人物資（證件、用藥、眼鏡、個人糧食）
  - 👨‍👩‍👧‍👦 家庭共用物資（手電筒、收音機、急救包、多功能工具）
  - ⚡ 自動帶入：頁面 1 設定的特殊需求（如奶奶的慢性藥、嬰兒尿布）
- **Footer Summary**: 全家目前需要準備：4 個個人避難包、1 組家庭共用包、7 天居家儲備
- **Footer Navigation**: [ 下一步：認識不同災害 → ]

---

### 📱 PAGE 4: 認識不同災害 (`/hazards`)
- **Header**: Progress STEP 4 / 7 🌏 認識災害
- **Hazard Cards Grid (6-8 種)**:
  - 🌏 地震 | 🌧️ 颱風/豪雨 | 🌊 海嘯 | ⛰️ 土石流 | 🌊 淹水 | 🚨 空襲 | ⚔️ 軍事侵略
- **Interactive Scenario Modal / Card Expansion**:
  - 點擊後跳出情境選擇（例：地震發生時在室內，應 A.衝出門 B.趴下掩護穩住 C.搭電梯）
  - 選擇後顯示友善說明與《臺灣全民安全指引》對應章節延伸閱讀連結。
- **Footer Navigation**: [ 下一步：找到適合的避難地點 → ]

---

### 📱 PAGE 5: 我的家庭避難地圖 (`/map`)
- **Header**: Progress STEP 5 / 7 📍 避難地圖
- **Layout**: Desktop 雙欄（左 35% 控制面板，右 65% 地圖） / Mobile 上下分割
- **User Location Inputs**:
  - 設定：🏠 家中位置 | 🏫 學校位置 | 💼 工作地點
- **Hazard Scenario Filters**:
  - Selector: `[ 地震 ]` `[ 淹水 ]` `[ 海嘯 ]` `[ 土石流 ]` `[ 空襲 ]`
- **Smart Recommendation Engine**:
  - 依災害別過濾避難所層（避難收容處所 🟢 vs 防空避難處所 🔵）
  - 若地理區域/災害類型資料不完整，警示：「⚠️ 目前無法確認此地點是否適合此災害情境，請以現場官方指示為準。」
- **Footer Navigation**: [ 下一步：和家人建立集合計畫 → ]

---

### 📱 PAGE 6: 我的家庭集合計畫 (`/family-plan`)
- **Header**: Progress STEP 6 / 7 🤝 家庭約定
- **Section 1: 第一集合點**: 家附近公園或指定地點
- **Section 2: 第二集合點**: 跨區備用學校或體育館
- **Section 3: 通訊中斷預備方案**: 廣播、派出所、村里辦公室、1991 報平安留言板
- **Section 4: 家庭成員分工**: 爸爸（協助奶奶）、媽媽（照顧弟弟）、我（攜帶共用急救包）
- **Section 5: 情境思考題**: 手機中斷時如何相聚？紀錄約定文字。
- **Footer Navigation**: [ 產生我的家庭安全計畫 → ]

---

### 📱 PAGE 7: 完成我的家庭安全計畫 (`/my-plan`)
- **Header**: Progress STEP 7 / 7 🛡️ 計畫完成
- **Section 1: 家庭概況**: 成員數與特殊需求摘要
- **Section 2: 全家物資清單**: 每個人的避難包重量、飲水量與儲備概況
- **Section 3: 災害應變與避難地圖總表**: 矩陣顯示不同災害主要/備用避難地點
- **Section 4: 家庭約定紀錄**: 集合點與成員分工
- **Section 5: 計畫完成度診斷**:
  - 🟢 避難包規劃 | 🟡 居家物資儲備 | 🟢 避難地點選定 | 🔴 家庭集合點確認
- **Section 6: 下一步建議行動 (Top 3)**:
  1. 準備奶奶的個人備用藥物
  2. 與父母實地走一次第一集合點
  3. 列印本計畫貼在冰箱上
- **Action Buttons**: 📄 下載 PDF / 🖨️ 友善列印 / 📱 儲存至手機（LocalStorage）

---

## 5. 資料模型 (TypeScript Interfaces)

```typescript
// 1. 家庭成員數據
export interface FamilyMember {
  id: string;
  relation: string; // '我' | '爸爸' | '媽媽' | '爺爺' | '奶奶' | '其他'
  customName?: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  specialNeeds: Array<
    | 'daily_medicine'
    | 'glasses'
    | 'hearing_aid'
    | 'limited_mobility'
    | 'infant'
    | 'sanitary'
    | 'pet'
    | string
  >;
}

// 2. 避難包物資品項
export interface GoBagItem {
  id: string;
  category: 'water' | 'food' | 'medical' | 'tools' | 'warmth' | 'hygiene' | 'special';
  name: string;
  quantity: number;
  unit: string;
  estimatedWeightKg: number; // 重量 (kg)
  ownerMemberId?: string; // 指定成員包，或 undefined 代表共用
  isShared: boolean; // 是否為家庭共用物資
  isAutoAdded?: boolean; // 是否依據特殊需求自動加入
}

// 3. 災害情境
export interface HazardScenario {
  id: string;
  name: string;
  icon: string;
  shortDesc: string;
  quizQuestion: {
    question: string;
    options: { label: string; isCorrect: boolean; explanation: string }[];
  };
  evacuationPrinciple: string;
  officialSourceUrl: string;
}

// 4. 避難地點
export interface EmergencyLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'shelter' | 'air_raid' | 'hospital' | 'park';
  suitableHazards: string[]; // ['earthquake', 'tsunami', 'flood', 'air_raid']
  notes?: string;
}

// 5. 家庭約定與分工
export interface FamilyPlan {
  members: FamilyMember[];
  goBags: Record<string, GoBagItem[]>; // memberId -> items
  sharedItems: GoBagItem[];
  primaryMeetingPoint: string;
  secondaryMeetingPoint: string;
  offlineCommunication: string[];
  memberResponsibilities: Record<string, string>; // memberId -> responsibility
  locations: Record<string, EmergencyLocation>; // hazard -> location
  completedSteps: number[]; // e.g. [1, 2, 3, 4, 5, 6, 7]
  lastUpdated: string;
}
```

---

## 6. 計算公式與數據邏輯

### 💧 飲水量公式
- **每日最低攝取量** = `體重 (kg) × 15 ml`
- **3日避難包水分量** = `體重 (kg) × 15 ml × 3`
- **專屬 Utility**:
```typescript
export function calculateWaterRequirement(weightKg: number, days = 3): { ml: number; kg: number } {
  const ml = weightKg * 15 * days;
  const kg = ml / 1000;
  return { ml, kg };
}
```

### 🎒 背包重量計算與參考對照
- **背包總重** = `飲水重量 + 糧食重量 + 個人藥物/衣物重量 + (共用物資總重 / 攜帶人數) + 空包重(0.8kg)`
- **建議上限基準**（提示供參考，不強制限制）：
  - 男性參考基準：~15 kg
  - 女性參考基準：~10 kg
  - 警示條目：當預估重量超過參考基準時，提示「⚠️ 建議減少非緊急物品或分配給其他家人攜帶」。

---

## 7. 官方資料來源對照

1. **《臺灣全民安全指引》（小橘書）**：國防部全動署 / 內政部消防署官方指引
2. **消防防災 e 點通 / 國家災害防救科技中心 (NCDR)**：災害避難原則與避難收容處所分類
3. **內政部警政署防空避難專區**：防空避難處所標示與選擇邏輯

---

## 8. MVP 開發與部署計畫

1. **環境建置**：React 18 + Vite + TypeScript + Tailwind CSS + Lucide Icons + Leaflet (React-Leaflet)
2. **架構設計**：
   - App Layout (進度 Step Header + Mobile Bottom Navigation)
   - Store / State Context (React Context + LocalStorage Hook)
3. **頁面開發順序**：
   - Phase 1: Header / Navigation + Data Models & Utilities
   - Phase 2: Page 0 (Home), Page 1 (Family), Page 2 (Prepare)
   - Phase 3: Page 3 (Go-Bag Calculator), Page 4 (Hazards)
   - Phase 4: Page 5 (Map with Leaflet & Hazard filters), Page 6 (Family Plan)
   - Phase 5: Page 7 (Final Plan & Print/PDF Export)
4. **部署流程**：
   - GitHub Repository: `taiwan-family-emergency-plan`
   - GitHub Actions 自動化部署至 GitHub Pages
