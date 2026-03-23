# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a university coursework repository for third-year computer science courses. It serves as a central hub for AI-assisted learning, containing course materials, assignments, experimental reports, and review materials.

## Repository Structure

```
3rd-Year-Slack-Mode/
├── Linux 系统编程/         # Linux System Programming course
│   ├── 作业/               # Assignments
│   └── 课件/               # Course materials (PDFs)
├── 云计算/                 # Cloud Computing course
│   └── 课件/
├── 数据集成/               # Data Integration course
│   ├── 作业/
│   └── 课件/
├── 软件系统设计/           # Software System Design course
│   └── 课件/
├── 软件质量与管理/         # Software Quality Management course
│   └── 课件/
├── 软工三/                 # Software Engineering III course
│   ├── 大作业/             # Major assignments
│   └── 课件/
└── 复习资料/               # Review materials (for graduate school prep)
    ├── 【保研】软件系统设计/
    ├── 【保研】软件工程与计算III/
    └── 【保研】软件质量管理/
```

## Key Context

- **Language**: All course materials and documentation are in Chinese (Simplified)
- **File Types**: Primarily PDFs (课件/slides, 作业/assignments, 实验报告/lab reports), with DOCX and compressed archives as secondary formats
- **Git Workflow**: Simple main branch workflow; `.gitignore` excludes PPT directories and all `.zip` files to manage repository size
- **No Source Code**: This repository contains academic materials and documentation, not application code

## Working with This Repository

### File Organization
- Course materials (课件) are typically PDFs stored in course-specific directories
- Assignments (作业) and lab reports (实验报告) are stored in dedicated subdirectories
- Review materials (复习资料) include past exams, reference documents, and student notes

### When Assisting with Tasks

1. **Document Analysis**: When asked to analyze course materials, read PDF files directly using the Read tool
2. **Assignment Help**: Course content is theoretical (software architecture, design patterns, quality management, Linux programming, cloud computing)
3. **File Management**: Respect the `.gitignore` patterns - do not track PPT directories or zip files
4. **Language**: Respond in the language the user uses (likely Chinese for course-specific questions, English for technical discussions)

### Repository Philosophy

Per the README, this repository follows an "AI-assisted learning" approach where AI tools help with coursework completion. When working here:
- Focus on understanding and explaining concepts from course materials
- Help organize and structure assignments based on course requirements
- Assist with creating reports, documentation, and theoretical analyses
- Do not create unnecessary files; work with existing course structure

---

## 软工三 (Software Engineering III) 专项指引

### 🎯 项目概述

**课程名称**: 软件工程与计算III
**项目主题**: Agent应用及评估系统搭建
**核心技术**: LLM Agent, Ragas评估框架, Python
**开发规模**: 12,000行代码
**团队规模**: 6人团队协作
**开发模式**: 螺旋模型 (Spiral Model)
**学期**: 2026年春季学期

### 📅 三次迭代时间线

#### 迭代一: 学习开源 (4周, 截止3月30日)
**任务目标**:
- 深入阅读Ragas开源项目源码
- 理解RAG评估框架的核心原理
- 完成基础评估实验
- 撰写开源项目分析文档

**关键交付物**:
- Ragas项目代码分析报告
- 基础评估实验代码及结果
- 迭代一项目文档

#### 迭代二: 基础搭建 (6周, 截止5月11日)
**任务目标**:
- 初步搭建Agent应用系统
- 构建Agent评估平台
- 集成Ragas框架到自有系统

**关键交付物**:
- Agent应用原型系统
- 评估平台基础架构
- 系统设计文档

#### 迭代三: 深入探索 (6周, 截止6月15日)
**任务目标**:
- Agent产品化
- 系统深度优化
- 完善用户体验

**关键交付物**:
- 完整的Agent评估系统
- 产品使用文档
- 答辩PPT和演示视频

### 📊 评分标准

- **系统各阶段迭代产物**: 60% (迭代1→迭代2→迭代3)
- **软件工程过程产物**: 30% (GitLab提交记录,个人贡献度评估)
- **其他过程**: 10% (答辩表现,文档质量等)

**重要提醒**: 所有工作必须记录在GitLab上,个人工作评估根据对产物的贡献度判定

### 📂 重要文档索引

#### 课程要求文档
- 课程说明: `软工三/课件/2026软工三-课程说明-0302.pdf`
- 团队创建要求: `软工三/大作业/2026软工三-团队创建与软件过程要求.pdf`
- 迭代一任务: `软工三/大作业/迭代一/2026软工三-迭代一任务说明.pdf`
- 开源项目示例: `软工三/大作业/迭代一/2026软工三-开源项目分析文档示例.pdf`

#### 学长参考资料 (保研复习资料)
- 学长整理资料: `复习资料/【保研】软件工程与计算III/SECIII/`
- 往年作业答案: `复习资料/【保研】软件工程与计算III/SECIII/迭代一/Ragas项目分析文档.pdf`
- 往年考试题目: `复习资料/【保研】软件工程与计算III/`
- lxc学长资料: `复习资料/【保研】软件工程与计算III/lxc资料/`

**学长资料命名规则**:
- `lxc资料` = 李薛成学长的资料
- `要背的-蔡之恒` = 蔡之恒学长整理的重点
- `yhgg资料` = yhgg学长的资料

#### 知识库目录结构
```
软工三/知识库/
├── 课程要求/          # 所有官方课程文档
├── 参考资料/          # 学长资料和参考文档
├── 技术文档/          # Ragas, Agent框架等技术文档
├── 开发资源/          # Ragas项目源码,示例代码
└── 团队文档/          # 团队内部文档,会议记录
```

### 🔧 核心技术栈

#### 主要框架
- **Ragas**: RAG (Retrieval-Augmented Generation) 评估框架
  - 评估指标: answer_relevancy, faithfulness, context_precision等
  - GitHub: https://github.com/explodinggradients/ragas
- **LLM Agent框架**:
  - 可选: LangChain, AutoGPT, Claude Agent SDK
- **评估平台技术**:
  - 后端: Python, FastAPI
  - 前端: React/Vue (可选)
  - 数据库: PostgreSQL/MongoDB

#### 开发环境
- Python 3.10+
- Git + GitLab (必须,用于评分)
- Docker (推荐,用于环境复现)
- Jupyter Notebook (用于实验演示)

### 🤖 AI辅助开发原则

#### 代码生成
- **严格遵循Ragas项目代码风格**
- **保持代码可读性**: 添加详细的中文注释
- **实验可复现性**: 每个实验都要能一键运行
- **避免抄袭**: AI生成代码后需要重构和个性化调整

#### 文档撰写
- **参考学长示例格式**: 阅读`复习资料/SECIII/`中的往年文档
- **突出创新点**: 不要完全照搬学长的思路
- **图文并茂**: 使用架构图,流程图,实验结果图表
- **规范引用**: 引用开源项目和论文时标注来源

#### Git提交规范
- **清晰的commit message**: 使用格式 `feat(iteration1): 实现XXX功能 - [姓名]`
- **频繁提交**: 每完成一个小功能就提交,方便追踪个人贡献
- **分支管理**: 每个迭代使用独立分支 `iteration1-yourname`

#### 实验设计
- **基于课程要求**: 严格按照任务说明设计实验
- **对照组设置**: 设计多组实验进行对比
- **结果可视化**: 使用matplotlib/seaborn生成图表
- **实验报告**: 每个实验都要有详细的报告文档

### 🎓 学术诚信声明

本项目使用AI辅助工具Claude Code加速开发流程,但遵循以下原则:
1. **AI是助手,不是替代**: 核心设计思路和技术决策由团队完成
2. **理解优先**: 所有AI生成的代码都必须理解其原理
3. **独立验证**: AI生成的实验结果需要人工验证正确性
4. **标注AI贡献**: 在文档中透明说明哪些部分使用了AI辅助
5. **避免抄袭**: 不直接复制学长的代码和文档

### 🚨 风险控制

#### 代码重复度风险
- **问题**: 课程可能使用查重工具检测代码相似度
- **对策**:
  - AI生成代码后,要求重构使用不同的变量名和函数结构
  - 添加团队特色的工具函数和注释风格
  - 参考学长代码时只学习思路,不复制代码

#### 答辩准备风险
- **问题**: 答辩时老师会深入提问技术细节
- **对策**:
  - 每次迭代结束生成"答辩问答手册"
  - 对核心模块进行代码走查,理解实现原理
  - 提前准备技术难点的解释话术

#### GitLab贡献度风险
- **问题**: 评分依据GitLab提交记录,需要体现个人贡献
- **对策**:
  - 每次AI生成代码后立即commit,注明个人姓名
  - 在commit message中说明自己的调整和优化
  - 定期生成个人贡献报告

### 📝 AI辅助工作流程示例

#### 迭代一典型工作流程

**第1步: 项目理解** (使用ragas-code-analyzer技能)
```
prompt: "分析Ragas框架的核心架构,重点关注评估指标的实现原理"
```

**第2步: 对比学习**
```
prompt: "对比学长的Ragas分析文档(复习资料/SECIII/迭代一/Ragas项目分析文档.pdf)
和官方文档,总结关键知识点,列出学长可能遗漏的创新点"
```

**第3步: 实验设计**
```
prompt: "根据迭代一任务说明,设计3个Ragas基础评估实验,
实验需要覆盖answer_relevancy, faithfulness, context_precision三个指标,
生成实验方案文档(包含实验目的/数据集/评估指标/预期结果)"
```

**第4步: 代码实现**
```
prompt: "为第一个实验生成Python脚本,使用Ragas评估answer_relevancy指标,
代码需要包含详细中文注释,生成可视化结果图表,并保存实验日志"
```

**第5步: 文档生成** (使用seciii-doc-generator技能)
```
prompt: "生成迭代一项目报告,参考学长文档结构,
章节包括: 1.项目背景 2.Ragas框架分析 3.实验设计与实现 4.实验结果与分析 5.总结与展望"
```

### 🛠️ 自定义技能 (Skills)

#### ragas-code-analyzer
**用途**: 分析Ragas项目源码结构
**触发**: 当需要理解Ragas框架实现细节时
**位置**: `.claude/skills/ragas-code-analyzer.md`

#### seciii-doc-generator
**用途**: 生成软工三课程文档(报告/设计文档/测试文档)
**触发**: 当需要撰写迭代报告时
**位置**: `.claude/skills/seciii-doc-generator.md`

#### agent-experiment-runner
**用途**: 运行Agent评估实验并生成报告
**触发**: 在迭代二/三需要执行实验时
**位置**: `.claude/skills/agent-experiment-runner.md`

### 📖 快速开始指南

#### 新迭代开始时
1. 阅读本迭代的任务说明PDF
2. 阅读学长对应迭代的参考资料
3. 让Claude生成本迭代的工作计划
4. 创建本迭代的Git分支

#### 日常开发时
1. 提出具体明确的需求给Claude
2. 审查AI生成的代码和文档
3. 运行和测试代码
4. 提交到GitLab并注明个人贡献

#### 迭代结束时
1. 生成迭代报告和技术文档
2. 准备答辩材料
3. 代码Review和重构
4. 合并分支到主分支

### 🔗 相关资源

- **Ragas官方文档**: https://docs.ragas.io/
- **项目制课程管理平台**: https://xmzkc.nju.edu.cn/
- **教师邮箱**: fangchunrong@nju.edu.cn (有异常情况及时邮件说明)

### 💡 最佳实践提示

1. **早开始,多迭代**: 不要等到deadline前才开始,每周都要有进展
2. **频繁沟通**: 团队内部保持沟通,定期同步进度
3. **文档先行**: 先写设计文档再写代码
4. **实验记录**: 每次实验都要记录详细日志,便于复现
5. **答辩预演**: 每次迭代结束后模拟答辩,提前发现问题

---
