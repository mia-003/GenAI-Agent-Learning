
- Agent行为改变是从上下文适应到持续更新的过程。三条互补路径：任务内的上下文适应、跨任务的外部产物（artifact）更新，以及训练周期中的参数更新。
- 消融实验（Ablation Study）：消除某一组件观察对Agent总体行为的影响
- 上下文包括系统提示词 + 工具定义（静态前缀），用户消息 + 模型回复 + 工具执行结果（随交互不断增长的动态消息历史）。静态+动态构成完整上下文。

- ReAct Loop：reasoning+acting，想-做-看-想-做 
- context=静态前缀（stable prefix）+轨迹（trajectory 动态消息历史），model调用context做出决策，trajectory再加上这个决策构成新的trajectory。
- “模型即Agent”范式意思就是让模型自主完成ReAct循环，和传统框架的区别是工具调用和执行都在服务端而非客户端完成，模型具有自主调用的能力。eg. GPT-5.6能调用web_search（其原生工具），搜到实时数据后再闭环到reasoning，调用code_interpreter（其原生工具）进行最终输出。

- Harness工程是用于解决控制幻觉、增强可靠性的生产系统。从物理意义上可以看作位于LLM之外、Agent边界之内。Agent = Model + Harness，Harness = 上下文管理 + 工具接口 + 约束 + 验证 + 纠正，最外部则是Agent和Environment之间的交互。
- 选择模型需要关注闭源/开源模型、策略边界（合规调用/考虑真实业务需求）、支持思考（动态决策或多步骤思考）、输出速度和多模态能力
- 编排模式决定了上下文如何在LLM调用之间流动、工具如何被调度、执行路径预先设定or动态生成。包括工作流和自主。工作流的执行路径是确定的，只在每个节点内部调用LLM负责理解和生成。eg.文生图工作流将自然语言改写成模型习惯的提示词格式供LLM思考，而GPT-image多模态则直接调用出图。自主Agent具备根据环境反馈实时决定下一步的能力，所以需要能识别失败和调整策略的能力，必须设计明确的停止条件（任务完成、达到最大迭代次数或遭遇不可恢复的错误），避免陷入死循环或过度执行。可以结合两种模式，在同一个系统里同时使用workflow节点和自主agent节点；也可以由自主agent写出工作流再由工作流执行具体任务。
- 护栏（Guardrails）构建保障agent行为安全、可控的分层防线，用于管理数据隐私风险或防止模型输出有害/危险的回答，可以在发现新漏洞时逐步添加。防护位置氛围三层：上下文层（相关性分类器/安全分类器/内容审核标记/基于规则保护）、执行层（在动作生效前验证）、数据层（最终输出或调用前审查）。

## 消融实验观察上下文能力（工具调用）对Agent输出的影响
- 目录：[cd "/Users/zhouxiangyue/Desktop/AI-Agent学习/.materials/ai-agent-book/chapter1/context"]
- 第1轮运行（完全看到上下文）：工具调用2次迭代1次，得到答案
```
- MAX_ITERATIONS=4 python main.py --mode single --provider deepseek --🔴context-mode full --task "请调用计算器计算 (125 + 375) * 8， 并给出结果。" --output results/w1d4-no-tool-results.json 
```
- 第2轮运行（不让上下文看到工具调用结果）：调用了calculator，但未输出答案，达到harness护栏给定的迭代上限。
```
- MAX_ITERATIONS=4 python main.py --mode single --provider deepseek --🔴context-mode no_tool_results --task "请调用计算器计算 (125 + 375) * 8， 并给出结果。" --output results/w1d4-no-tool-results.json
```

