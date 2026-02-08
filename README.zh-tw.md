# POG Task — AI 原生任務治理模型

![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)

一個以治理為核心的框架，將任務管理為存在於程式碼庫中的結構化、可審計的工作單元，專為 AI Agent 作為一等公民參與的環境而設計。

🌐 **網站**: [https://enjtorian.github.io/pog-task](https://enjtorian.github.io/pog-task)
🛒 **Marketplace**: [POG Task Manager](https://marketplace.visualstudio.com/items?itemName=enjtorian.pog-task-manager)

---

### 提示編排治理 (Prompt Orchestration Governance, POG)
一個將提示詞 (Prompts) 視為軟體開發生命週期 (SDLC) 中一等軟體資產的綜合管理框架。POG 提供了系統化的流程來發現、標準化、驗證、版本控制和部署提示詞，同時維持治理與品質控制。

📖 **白皮書**: [Prompt Orchestration Governance Whitepaper](https://enjtorian.github.io/prompt-orchestration-governance-whitepaper/zh-tw/)

---

## 📖 關於

本儲存庫包含 **POG Task** 的規範與參考實作，它是提示編排治理 (POG) 框架的核心組件。

POG Task 彌補了人類意圖與 Agent 執行之間的鴻溝。它不將任務視為短暫的對話訊息，而是將其視為嚴格類型的 **意圖單元 (Units of Intention)** —— 存在於 Git 歷史記錄中、具備結構化、標記時間戳記且具備版本的資產。

### 核心概念

*   **AI 原生結構化任務 (YAML)**：一種用於機器解讀的確定性格式，最大程度地減少幻覺。
*   **推理與執行軌跡 (`record.md`)**：捕捉 AI 行動背後的「原因」，而不僅僅是「結果」。
*   **檔案原生治理**：無供應商鎖定；任務存在於您的儲存庫中，並隨程式碼演進。
*   **多 Agent 協作**：專為人類與 AI Agent 之間的複雜交接而設計。

## 👥 作者

**由 Ted Enjtorian 建立**  
*框架觀察者與主要作者*

> 在 LLM 巨大執行力背後，我注意到一個關鍵缺口：我們賦予了 AI 修改系統的代理權，卻將其指令埋藏在短暫的對話日誌中，缺乏像 Git Commit 這樣定義行為邊界的結構化單元。

> POG Task 並非在創造新需求，而是填補一個缺失已久、遲來的結構層。它承認 AI 為合法的勞動力，並將其行為提升為正式資產的地位，將 AI 的工作從短暫的筆記轉化為具有約束力的合約。

聯繫方式：
*   🔗 LinkedIn: [https://tw.linkedin.com/in/enjtorian](https://tw.linkedin.com/in/enjtorian)
*   💻 GitHub: [@enjtorian](https://github.com/enjtorian)

參閱 [AUTHORS.zh-tw.md](AUTHORS.zh-tw.md) 以取得完整貢獻者資訊。

## 🌍 語言版本

*   **English**: 完整的文檔與規範。
*   **繁體中文 (Traditional Chinese)**：白皮書與核心概念的完整翻譯。

---

## 🚀 快速上手

### 線上閱讀

訪問已發佈的文檔：
*   [https://enjtorian.github.io/pog-task](https://enjtorian.github.io/pog-task)

### 本地開發

1.  **複製儲存庫**
    ```bash
    git clone https://github.com/enjtorian/pog-task.git
    cd pog-task
    ```

2.  **安裝插件**
    ```bash
    code --install-extension enjtorian.pog-task
    ```

3.  **了解 POG Task**
    - 閱讀 [POG Task 手冊](pog-task/README.md)
    - 閱讀 [Agent 指南](pog-task/pog-task-agent-instructions.md)
    - 閱讀 [系統設計](pog-task/pog-task-design.md)

4.  **開始第一個任務**
    ```bash
    # 步驟 1：閱讀上下文
    請閱讀以下文件與資源：
    - pog-task/pog-task-agent-instructions.md
    - pog-task/task.schema.json

    # 步驟 2：建立或加入任務
    請在 pog-task/list 中進行以下操作：
    - project: {${project}}
    - module: {${module}}
    - 若任務不存在 → 建立新任務
    - 若任務已存在 → 加入任務
    - 父任務 ID: {task.parent_task}

    # 步驟 3：理解任務
    當前任務：
        xxxxxxxx

    # 步驟 4：產生任務記錄
    請產生 record.md 檔案（位於 pog-task/list/{project}/{module}/record/{task-uuid}/record.md），內容包含：
    - 原始提示詞 (Original Prompt)
    - 任務目標
    - 執行計畫 / 檢核表 (Checklist)
    - 相關參考資料
    ```

## 📁 儲存庫結構

```
pog-task/
├── docs/                                   # 文檔原始碼
│   ├── index.md                            # 主要白皮書 (英文)
│   └── zh-tw/                              # 繁體中文版本
│       ├── index.md                        # 主要白皮書（繁體中文）
├── pog-task/                               # POG Task 參考結構
│   ├── list/                               # 活躍任務存放處
│   │   └── {project}/
│   │       └── {module}/
│   │           ├── {task-title}.yaml
│   │           └── record/{uuid}/record.md
│   ├── pog-task-agent-instructions.md      # Agent 操作指令
│   ├── pog-task-design.md                  # 設計文檔
│   └── task.schema.json                    # YAML Schema
├── pog-task-manager/                       # (選用) VS Code 插件實作
├── mkdocs.yml                              # 網站配置
└── README.md                               # 本檔案
```

---

## 📂 文檔結構

### 核心文檔
*   **白皮書**: `docs/index.md` — 全面的理論與設計。

### 語言支援
*   英文: `/docs`
*   繁體中文: `/docs/zh-tw`

## 📊 架構

POG Task 利用一個 **治理層 (Governance Layer)**，由以下組成：
1.  **結構化狀態流** (`*.yaml`)
2.  **執行與推理日誌** (`record.md`)
3.  **Agent 引導的工作流**

---

## 📝 貢獻

我們歡迎各類貢獻！以下是您的參與方式：

### 內容改進

- 針對錯別字、解釋不清或內容缺失提交 Issue
- 提議新的章節或圖表
- 改進翻譯

### 翻譯

- 協助翻譯至其他語言
- 審查並改進現有翻譯

### 技術增強

- 提高圖表清晰度
- 增強網站導覽
- 添加互動功能

### 提交變更

1. Fork 儲存庫
2. 建立功能分支 (`git checkout -b feature/improvement`)
3. 進行變更
4. 本地測試 (`mkdocs serve`)
5. 提交並推播 (`git push origin feature/improvement`)
6. 開啟 Pull Request

---

## 📜 授權條款

本作品採用 [創用 CC 姓名標示 4.0 國際授權條款 (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/deed.zh_TW) 進行授權。

### 這代表什麼

#### ✅ 您可以：
- **分享** — 以任何媒介或格式重製及散布本素材
- **修改** — 翻製、修改及依本素材建立新素材
- **商業利用** — 可將本素材用於商業目的
- **全球使用** — 全球通用，不受限制

#### 📝 須遵守以下條款：
- **姓名標示** — 您必須給予適當表彰、提供指向本授權條款的連結，並說明是否進行了變更。您可以用任何合理的方式表達，但不得暗示授權人為您或您的使用背書。

### 為什麼選擇 CC BY 4.0?

我們選擇此授權條款是為了：
- 🌍 **最大化知識共享** — 讓任何人都能學習並實作 POG
- 💼 **利於企業採用** — 允許組織商業化使用 POG
- 🤝 **鼓勵貢獻** — 培養協作社區
- 📝 **保護署名權** — 確保原始作品始終獲得表彰
- 🚀 **促進創新** — 允許衍生作品與改作

此授權條款在學術界和開源社區被廣泛使用，使其既熟悉且法律定義明確。

### 如何標註

使用本作品時，請包含：
```
基於 [Enjtorian, Ted] 的 "POG Task"，採用 CC BY 4.0 授權。
https://github.com/enjtorian/pog-task
Licensed under CC BY 4.0
```

詳細的引用資訊請參閱 [AUTHORS.zh-tw.md](https://github.com/enjtorian/pog-task/blob/main/AUTHORS.zh-tw.md)。

---

## 🙏 致謝

本白皮書建立在以下領域的洞察之上：
- 軟體工程最佳實踐
- AI 治理框架
- 企業架構模式
- 社群回饋與貢獻

---

## 📧 聯繫我們

如有疑問、建議或合作機會：

- **Issues**: [GitHub Issues](https://github.com/enjtorian/pog-task/issues)
- **Discussions**: [GitHub Discussions](https://github.com/enjtorian/pog-task/discussions)

---

**版本:** 1.1.0
**最後更新:** 2026年2月  
**狀態:** 已發佈

---

## ⭐ Star 歷史

如果您覺得這個框架有用，請考慮為儲存庫點亮星星！
