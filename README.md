# 🛡️ 我的家庭安全避難計畫 (My Family Emergency Safety Plan)

> **跟著小橘書，一步一步為自己與家人做好準備。**

本專案是一個專為臺灣高中生及家庭設計的 Web 互動式安全避難計畫工具。引導學生閱讀、理解並運用《臺灣全民安全指引》（俗稱「小橘書」），建立份屬於自己與家人的安全避難計畫。

---

## 🌟 核心特色與亮點

1. **非測驗、非問卷的「安全任務」**
   - 採用「學一點 → 想一想 → 做一個決定 → 完成一小步」無壓力引導。
   - 答錯提供友善的「再想想看」觀念解析，而非嚴厲扣分。

2. **個人化水份與背包重量動態計算**
   - **飲水量**：嚴格依據官方公式 `體重 (kg) × 15 ml × 3 天` 進行隔離計算。
   - **負重評估**：針對全家每位成員年齡、性別、體重計算背包總重，並提供參考基準（男性 ~15kg、女性 ~10kg）。
   - **特殊需求自動帶入**：依家人之慢性病用藥、眼鏡、嬰幼兒、寵物等標籤，自動分配專屬品項。

3. **災害適宜性避難地圖**
   - 區分「地震避難收容處所」與「防空避難處所」。
   - 突破傳統「只看距離」迷思，提示海嘯與淹水低窪處不宜作為避難點之觀念。

4. **完整家庭集合與通訊計畫**
   - 規劃「第一集合點」與「第二集合點（備用）」。
   - 規劃手機與行動網路中斷時之官方廣播與 1991 報平安留言板預案。
   - 產出全家成員責任分工。

5. **隱私與 LocalStorage 保存**
   - 100% 本地存取，無須註冊登入，嚴格保護住址與家人個資。

6. **友善列印與 PDF 輸出**
   - 一鍵切換 Print-Friendly 排版，便於列印貼在冰箱上或保存於手機中。

---

## 🛠️ 技術架構

- **框架**：React 18 + TypeScript + Vite
- **樣式**：Tailwind CSS (小橘書溫暖橘 Theme + Modern Responsive UI)
- **狀態管理**：React Context + LocalStorage Hook
- **部署**：GitHub Actions 自動化部署至 GitHub Pages

---

## 🚀 本機啟動與開發方式

### 前置需求
- Node.js >= 18.0.0
- npm >= 9.0.0

### 安裝與啟動指令

```bash
# 1. 安裝套件
npm install

# 2. 啟動本機開發伺服器
npm run dev

# 3. 專案打包 (TypeScript 型別檢查 + Vite Build)
npm run build

# 4. 預覽打包產物
npm run preview
```

---

## 📦 Git & GitHub Pages 部署步驟

```bash
# 1. 初始化 Git 儲存庫
git init

# 2. 加入所有檔案並提交
git add .
git commit -m "feat: complete My Family Emergency Safety Plan application"

# 3. 連接至您的 GitHub 遠端 Repository
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/taiwan-family-emergency-plan.git
git branch -M main
git push -u origin main
```

推送至 `main` 分支後，GitHub Actions (`.github/workflows/deploy.yml`) 將會自動完成 Build 並部署至 GitHub Pages！

---

## ⚠️ 免責與著作權聲明

本網站為教育與家庭防災準備學習工具，內容參考《臺灣全民安全指引》（小橘書）與內政部消防署指引。
災害發生時，請以政府機關、警察、消防、民防人員及現場最新指示為準。網站提供的地點與資訊不能取代現場緊急避難指示。
