---
name: ragas-code-analyzer
description: Ragas项目源码分析助手 - 深度分析Ragas框架的代码结构、核心模块和实现原理
author: Software Engineering III Team
version: 1.0.0
---

# Ragas Code Analyzer

这是一个专门用于分析Ragas评估框架源码的AI助手技能。

## 🎯 功能说明

当用户需要理解Ragas框架的实现细节时,这个技能会:
1. 自动定位Ragas项目的关键模块和文件
2. 分析代码结构和调用关系
3. 提取核心API的使用方法和示例
4. 生成带有中文注释的代码分析报告

## 📋 使用场景

- 需要理解Ragas的评估指标(如answer_relevancy, faithfulness)实现原理
- 查找某个功能的源码位置
- 学习Ragas的架构设计和代码风格
- 为自己的项目集成Ragas框架做技术准备

## 🚀 使用方法

直接向Claude提问Ragas相关的技术问题,例如:
- "分析Ragas的answer_relevancy指标是如何计算的"
- "Ragas框架的核心模块有哪些?"
- "如何在自己的项目中集成Ragas评估功能?"

## 🔧 工作流程

### 步骤1: 定位目标代码
根据用户的问题,使用Grep工具搜索Ragas项目中的关键词:
- 评估指标相关: `metrics/`, `answer_relevancy.py`, `faithfulness.py`
- 数据集生成: `testset_generation/`
- 核心引擎: `llms/`, `embeddings/`, `run_config.py`

### 步骤2: 读取和分析代码
使用Read工具读取相关文件,重点关注:
- 类的定义和继承关系
- 核心方法的实现逻辑
- 依赖的第三方库
- 配置参数和默认值

### 步骤3: 生成分析报告
输出包含以下内容的markdown报告:
```markdown
# Ragas [模块名称] 分析报告

## 1. 模块概述
[简要说明模块的作用]

## 2. 核心类和方法
[列出主要的类、方法及其功能]

## 3. 代码实现原理
[用中文解释关键代码的逻辑]

## 4. 使用示例
[提供Python代码示例]

## 5. 注意事项
[列出使用时需要注意的点]
```

### 步骤4: 保存报告
将分析报告保存到: `软工三/大作业/迭代一/代码分析/[模块名]-分析报告.md`

## 📝 输出格式

### 代码结构分析
```markdown
## Ragas代码结构

软工三/知识库/开发资源/ragas/
├── src/ragas/
│   ├── metrics/           # 评估指标实现
│   │   ├── _answer_relevance.py
│   │   ├── _faithfulness.py
│   │   ├── _context_precision.py
│   │   └── ...
│   ├── testset_generation/  # 测试集生成
│   ├── llms/                # LLM接口封装
│   ├── embeddings/          # 向量嵌入
│   └── run_config.py        # 配置管理
```

### 核心API分析
```python
# answer_relevancy 指标使用示例

from ragas.metrics import answer_relevancy
from ragas import evaluate

# 准备评估数据
data = {
    "question": ["你好吗?"],
    "answer": ["我很好,谢谢!"],
    "context": [["相关上下文信息"]]
}

# 执行评估
result = evaluate(
    data,
    metrics=[answer_relevancy]
)

print(result)
# 输出: {'answer_relevancy': 0.95}
```

### 实现原理解析
```markdown
## answer_relevancy 实现原理

1. **输入**: 问题(question)和答案(answer)
2. **处理流程**:
   - 使用LLM从answer中反向生成可能的问题
   - 计算生成问题与原始问题的语义相似度
   - 使用embedding模型计算余弦相似度
3. **输出**: 0-1之间的相关性分数
4. **核心代码**: `src/ragas/metrics/_answer_relevance.py`
```

## ⚠️ 注意事项

1. **Ragas项目位置**: 确保Ragas源码已克隆到 `软工三/知识库/开发资源/ragas/`
2. **版本兼容性**: 本分析基于Ragas v0.1.x版本,不同版本可能有差异
3. **深度vs广度**: 优先分析与课程任务相关的核心模块,避免过度深入细节
4. **中文注释**: 所有分析报告使用中文,方便团队成员理解

## 🔗 相关资源

- Ragas GitHub: https://github.com/explodinggradients/ragas
- Ragas官方文档: https://docs.ragas.io/
- 学长分析报告: `软工三/知识库/参考资料/学长-Ragas项目分析文档.pdf`

## 🎓 学习建议

1. **先看整体,再看细节**: 先理解Ragas的整体架构,再深入某个模块
2. **对比学习**: 对比学长的分析报告和自己的发现,找出创新点
3. **动手实验**: 边分析代码边运行示例,加深理解
4. **做好笔记**: 分析过程中的疑问和收获记录下来

---

*本技能由Claude Code为软工三课程定制开发*
