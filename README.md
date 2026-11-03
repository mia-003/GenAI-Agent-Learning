# GenAI Agent · Learning Lab

Mia 的 AI Agent 原理学习与工程实践记录。以《深入理解 AI Agent：设计原理与工程实践》为主线，结合机制实验、失败分析和一个可验证的个人项目。

**[打开可视化学习工作台](https://mia-003.github.io/GenAI-Agent-Learning/)** · [16周路线](01-学习计划/16周学习路线.md) · [使用指南](03-学习笔记/使用指南.md) · [公开笔记](public-notes/)

## 当前进度

- 已验收任务：0/80（0%）
- 完成学习周：0/16
- 累计记录：0.0 小时
- 目标投入：每周14小时，按任务块灵活安排

任务完成度表示路线任务勾选情况，不等同于能力评分；学习时长单独记录。工作台从Markdown生成，公开页面为最近一次同步的快照。

## 学习路线

第1章 → 第2章 → 第4章 → 第3章 → 第5章 → 第7章 → 第9章 → 第6章 → 第10章 → 第8章 → 项目整合。

- [ ] [W01 · Agent的核心循环](01-%E5%AD%A6%E4%B9%A0%E8%AE%A1%E5%88%92/%E5%91%A8%E4%BB%BB%E5%8A%A1/W01.md)
- [ ] [W02 · 消息与提示设计](01-%E5%AD%A6%E4%B9%A0%E8%AE%A1%E5%88%92/%E5%91%A8%E4%BB%BB%E5%8A%A1/W02.md)
- [ ] [W03 · 上下文的边界](01-%E5%AD%A6%E4%B9%A0%E8%AE%A1%E5%88%92/%E5%91%A8%E4%BB%BB%E5%8A%A1/W03.md)
- [ ] [W04 · 给Agent可靠的工具](01-%E5%AD%A6%E4%B9%A0%E8%AE%A1%E5%88%92/%E5%91%A8%E4%BB%BB%E5%8A%A1/W04.md)
- [ ] [W05 · 跨会话的记忆](01-%E5%AD%A6%E4%B9%A0%E8%AE%A1%E5%88%92/%E5%91%A8%E4%BB%BB%E5%8A%A1/W05.md)
- [ ] [W06 · 从检索到证据](01-%E5%AD%A6%E4%B9%A0%E8%AE%A1%E5%88%92/%E5%91%A8%E4%BB%BB%E5%8A%A1/W06.md)
- [ ] [W07 · Coding作为能力](01-%E5%AD%A6%E4%B9%A0%E8%AE%A1%E5%88%92/%E5%91%A8%E4%BB%BB%E5%8A%A1/W07.md)
- [ ] [W08 · 建立评估闭环](01-%E5%AD%A6%E4%B9%A0%E8%AE%A1%E5%88%92/%E5%91%A8%E4%BB%BB%E5%8A%A1/W08.md)
- [ ] [W09 · 让失败产生价值](01-%E5%AD%A6%E4%B9%A0%E8%AE%A1%E5%88%92/%E5%91%A8%E4%BB%BB%E5%8A%A1/W09.md)
- [ ] [W10 · 观察与动作的扩展](01-%E5%AD%A6%E4%B9%A0%E8%AE%A1%E5%88%92/%E5%91%A8%E4%BB%BB%E5%8A%A1/W10.md)
- [ ] [W11 · 协作是否值得](01-%E5%AD%A6%E4%B9%A0%E8%AE%A1%E5%88%92/%E5%91%A8%E4%BB%BB%E5%8A%A1/W11.md)
- [ ] [W12 · 理解模型后训练](01-%E5%AD%A6%E4%B9%A0%E8%AE%A1%E5%88%92/%E5%91%A8%E4%BB%BB%E5%8A%A1/W12.md)
- [ ] [W13 · 串联全书原理](01-%E5%AD%A6%E4%B9%A0%E8%AE%A1%E5%88%92/%E5%91%A8%E4%BB%BB%E5%8A%A1/W13.md)
- [ ] [W14 · 项目：端到端构建](01-%E5%AD%A6%E4%B9%A0%E8%AE%A1%E5%88%92/%E5%91%A8%E4%BB%BB%E5%8A%A1/W14.md)
- [ ] [W15 · 项目：用证据改进](01-%E5%AD%A6%E4%B9%A0%E8%AE%A1%E5%88%92/%E5%91%A8%E4%BB%BB%E5%8A%A1/W15.md)
- [ ] [W16 · 项目：交付与表达](01-%E5%AD%A6%E4%B9%A0%E8%AE%A1%E5%88%92/%E5%91%A8%E4%BB%BB%E5%8A%A1/W16.md)

## 工作方式

1. 在Obsidian打开笔记库，进入学习工作台。
2. 学习一个机制，完成实现与对照，记录失败与下一步。
3. 勾选已验收任务，保存每日累计分钟。
4. 点击同步GitHub，更新公开快照。

## 资料与来源

- [官方教材与实验](https://github.com/bojieli/ai-agent-book)
- [作者的学习建议](https://github.com/bojieli/ai-agent-book/blob/main/docs/zh-CN/LEARNING.md)
- 本仓库保存个人路线、公开笔记与工作台源码；官方教材和外部实验留在本地并链接到上游，避免重复分发大型仓库。
- 每日日记、概念笔记和实验笔记默认本地；设置publish: true才导出全文，时间和任务进度用于公开统计。

## 工作台源码

workbench/ 包含无第三方依赖的界面、Markdown解析和Obsidian适配；scripts/build.mjs构建公开快照，scripts/sync.mjs提交并推送。使用node scripts/build.mjs重建；scripts/install-plugin.mjs安装本地插件。所有统计初始为0，未预填任何学习成果。
