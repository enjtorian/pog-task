# POG Task — AI-Native Task Governance Model

![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)

A governance-first framework for managing tasks as structured, auditable units of work that live inside your codebase, designed for environments where AI Agents are first-class participants.

🌐 **Website**: [https://enjtorian.github.io/pog-task](https://enjtorian.github.io/pog-task)
🛒 **Marketplace**: [POG Task Manager](https://marketplace.visualstudio.com/items?itemName=enjtorian.pog-task-manager)

---

## 📖 About

This repository contains the specification and reference implementation for **POG Task**, a core component of the Prompt Orchestration Governance (POG) framework.

POG Task bridges the gap between human intent and agent execution. It treats tasks not as transient chat messages, but as strictly typed **Units of Intention** — structured, timestamped, and versioned assets that persist in your Git history.

### Key Concepts

*   **AI-Native Structured Tasks (JSONL)**: A deterministic format for machine interpretation, minimizing hallucinations.
*   **Reasoning & Execution Trace (`record.md`)**: Captures the "why" behind AI actions, not just the "what".
*   **File-Native Governance**: Zero vendor lock-in; tasks live in your repo and evolve with your code.
*   **Multi-Agent Collaboration**: Designed for complex handoffs between human and AI agents.

## 👥 Author

**Created by:** Ted Enjtorian  
*Framework Observer & Primary Author*

> Behind the immense execution power of LLMs, I noticed a critical gap: we granted AI the agency to modify systems, yet left its instructions buried in ephemeral chat logs, lacking a structural unit, like a Git Commit, to define the boundaries of behavior.

> POG Task isn't creating a new need; it's filling a missing, overdue structural layer. It acknowledges AI as a legitimate workforce and elevates its behavior to the status of a formal artifact, transforming AI work from ephemeral notes into binding contracts.

Connect:
*   🔗 LinkedIn: [https://tw.linkedin.com/in/enjtorian](https://tw.linkedin.com/in/enjtorian)
*   💻 GitHub: [@enjtorian](https://github.com/enjtorian)

See [AUTHORS.md](AUTHORS.md) for complete contributor information.

## 🌍 Language Versions

*   **English**: Full documentation and specifications.
*   **繁體中文 (Traditional Chinese)**: Complete translation of the whitepaper and core concepts.

---

## 🚀 Quick Start

### View Online

Visit the published documentation:
*   [https://enjtorian.github.io/pog-task](https://enjtorian.github.io/pog-task)

### Local Development

1.  **Clone the repository**
    ```bash
    git clone https://github.com/enjtorian/pog-task.git
    cd pog-task
    ```

2.  **Install Plugin**
    ```bash
    code --install-extension enjtorian.pog-task
    ```

3.  **Understand the POG Task**
    - Read the [POG Task Handbook](pog-task/README.md)
    - Read the [Agent Guide](pog-task/pog-task-agent-instructions.md)
    - Read the [System Design](pog-task/pog-task-design.md)

4.  **Start First Task**
    ```bash
    # Step 1: Read Context
    Please read the following documents and resources:
    - pog-task/pog-task-agent-instructions.md
    - pog-task/declare.jsonl

    # Step 2: Create or Join Task
    Please perform the following in pog-task/list:
    - project: {${project}}
    - module: {${module}}
    - If task does not exist → Create new task
    - If task already exists → Join the task
    - parent task id: {task.parent_task}

    # Step 3: Understand the Task
    Current Task:
        xxxxxxxx

    # Step 4: Generate Task Record
    Please generate a record.md file (located at pog-task/list/record/{task-uuid}/record.md), containing:
    - Original Prompt
    - Task Objective
    - Execution Plan / Checklist
    - Relevant References
    ```

## 📁 Repository Structure

```
pog-task/
├── docs/                                   # Documentation source
│   ├── index.md                            # Main whitepaper (English)
│   └── zh-tw/                              # Chinese (Traditional) version
│       ├── index.md                        # 主要白皮書（繁體中文）
├── pog-task/                               # The POG Task reference structure
│   ├── list/                               # Where active tasks live (JSONL)
│   ├── pog-task-agent-instructions.md      # Agent instructions
│   ├── pog-task-design.md                  # Design
│   └── declare.jsonl                       # Task definitions
├── pog-task-manager/                       # (Optional) VS Code Plugin implementation
├── mkdocs.yml                              # Site configuration
└── README.md                               # This file
```

---

## 📂 Documentation Structure

### Core Documentation
*   **Whitepaper**: `docs/index.md` - comprehensive theory and design.

### Language Support
*   English: `/docs`
*   繁體中文: `/docs/zh-tw`

## 📊 Architecture

POG Task utilizes a **Governance Layer** consisting of:
1.  **Structured Stream of State** (`*.jsonl`)
2.  **Execution & Reasoning Logs** (`record.md`)
3.  **Agent-Guided Workflows**

---

## 📝 Contributing

We welcome contributions! Here's how you can help:

### Content Improvements

- Submit issues for typos, unclear explanations, or missing content
- Propose new sections or diagrams
- Improve translations

### Translation

- Help translate to other languages
- Review and improve existing translations

### Technical Enhancements

- Improve diagram clarity
- Enhance website navigation
- Add interactive features

### Submitting Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Test locally (`mkdocs serve`)
5. Commit and push (`git push origin feature/improvement`)
6. Open a Pull Request

---

## 📜 License

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).

### What This Means

#### ✅ You Are Free To:
- **Share** — Copy and redistribute the material in any medium or format
- **Adapt** — Remix, transform, and build upon the material
- **Commercial Use** — Use the material for commercial purposes
- **Global Use** — Apply worldwide without restrictions

#### 📝 Under These Terms:
- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.

### Why CC BY 4.0?

We chose this license to:
- 🌍 **Maximize knowledge sharing** — Enable anyone to learn from and implement POG
- 💼 **Enable enterprise adoption** — Allow organizations to use POG commercially
- 🤝 **Encourage contributions** — Foster a collaborative community
- 📝 **Protect attribution** — Ensure the original work is always credited
- 🚀 **Promote innovation** — Allow derivative works and adaptations

This license is widely used in academic and open-source communities, making it familiar and legally clear.

### How to Attribute

When using this work, please include:
```
Based on "POG Task" by [Enjtorian, Ted], licensed under CC BY 4.0.
https://github.com/enjtorian/pog-task
Licensed under CC BY 4.0
```

For detailed citation information, see [AUTHORS.md](https://github.com/enjtorian/pog-task/blob/main/AUTHORS.md).

---

## 🙏 Acknowledgments

This whitepaper builds upon insights from:
- Software engineering best practices
- AI governance frameworks
- Enterprise architecture patterns
- Community feedback and contributions

---

## 📧 Contact

For questions, suggestions, or collaboration opportunities:

- **Issues**: [GitHub Issues](https://github.com/enjtorian/pog-task/issues)
- **Discussions**: [GitHub Discussions](https://github.com/enjtorian/pog-task/discussions)

---

**Version:** 1.0.1  
**Last Updated:** January 2026  
**Status:** Published

---

## ⭐ Star History

If you find this framework useful, please consider starring the repository!
