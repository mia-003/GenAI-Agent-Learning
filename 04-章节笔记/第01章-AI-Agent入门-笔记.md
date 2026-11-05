
- Agent行为改变是从上下文适应到持续更新的过程。三条互补路径：任务内的上下文适应、跨任务的外部产物（artifact）更新，以及训练周期中的参数更新。
- 消融实验（Ablation Study）：消除某一组件观察对Agent总体行为的影响
- 上下文包括系统提示词 + 工具定义（静态前缀），用户消息 + 模型回复 + 工具执行结果（随交互不断增长的动态消息历史）。静态+动态构成完整上下文。

- ReAct Loop：reasoning+acting，想-做-看-想-做 
- context=静态前缀（stable prefix）+轨迹（trajectory 动态消息历史），model调用context做出决策，trajectory再加上这个决策构成新的trajectory。
- “模型即Agent”范式意思就是让模型自主完成ReAct循环，和传统框架的区别是工具调用和执行都在服务端而非客户端完成，模型具有自主调用的能力。eg. GPT-5.6能调用web_search（其原生工具），搜到实时数据后再闭环到reasoning，调用code_interpreter（其原生工具）进行最终输出。

- Harness工程是用于解决控制幻觉、增强可靠性的生产系统。从物理意义上可以看作位于LLM之外、Agent边界之内。Agent = Model + Harness，Harness = 上下文管理 + 工具接口 + 约束 + 验证 + 纠正，最外部则是Agent和Environment之间的交互。
