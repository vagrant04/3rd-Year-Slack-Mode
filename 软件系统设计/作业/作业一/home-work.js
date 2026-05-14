const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
  TableOfContents, UnderlineType
} = require('docx');
const fs = require('fs');

// Color palette
const BLUE = "1F3864";
const LIGHT_BLUE = "2E75B6";
const HEADER_BG = "D6E4F0";
const ALT_ROW = "EBF3FB";
const WHITE = "FFFFFF";
const DARK_GRAY = "404040";

const border = { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" };
const borders = { top: border, bottom: border, left: border, right: border };
const thickBorder = { style: BorderStyle.SINGLE, size: 8, color: LIGHT_BLUE };
const thickBorders = { top: thickBorder, bottom: thickBorder, left: thickBorder, right: thickBorder };

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    children: [new TextRun({ text, bold: true, size: 36, color: BLUE, font: "Arial" })]
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 28, color: LIGHT_BLUE, font: "Arial" })]
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, size: 24, color: DARK_GRAY, font: "Arial" })]
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({
      text,
      size: opts.size || 22,
      bold: opts.bold || false,
      color: opts.color || "000000",
      font: "Arial",
      italics: opts.italic || false
    })]
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, font: "Arial" })]
  });
}

function cell(text, opts = {}) {
  const bgColor = opts.bg || WHITE;
  return new TableCell({
    borders,
    width: { size: opts.width || 2000, type: WidthType.DXA },
    shading: { fill: bgColor, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: VerticalAlign.TOP,
    children: [new Paragraph({
      alignment: opts.align || AlignmentType.LEFT,
      children: [new TextRun({
        text,
        bold: opts.bold || false,
        size: opts.size || 20,
        color: opts.color || "000000",
        font: "Arial",
        italics: opts.italic || false
      })]
    })]
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function spacer() {
  return new Paragraph({ spacing: { before: 120, after: 120 }, children: [new TextRun("")] });
}

// ========================
// TASK 1 TABLES
// ========================

function makeScenarioTable(rows) {
  // rows: array of [label, content]
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2200, 7160],
    rows: rows.map((r, i) => new TableRow({
      children: [
        cell(r[0], { width: 2200, bg: i === 0 ? LIGHT_BLUE : HEADER_BG, bold: true, color: i === 0 ? WHITE : BLUE }),
        cell(r[1], { width: 7160, bg: i === 0 ? LIGHT_BLUE : (i % 2 === 0 ? ALT_ROW : WHITE), color: i === 0 ? WHITE : "000000" })
      ]
    }))
  });
}

// ========================
// TASK 2 TABLE
// ========================

function makeTask2Table(data) {
  // data.headers: string[]
  // data.rows: {label, cells, isSubrow}[]
  const colWidths = [1600, 1950, 1950, 1930, 1930];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({
        children: data.headers.map((h, i) => new TableCell({
          borders: thickBorders,
          width: { size: colWidths[i], type: WidthType.DXA },
          shading: { fill: BLUE, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: h, bold: true, size: 18, color: WHITE, font: "Arial" })]
          })]
        }))
      }),
      ...data.rows.map((row, ri) => new TableRow({
        children: row.cells.map((c, ci) => new TableCell({
          borders,
          width: { size: colWidths[ci], type: WidthType.DXA },
          shading: { fill: row.isSubrow ? ALT_ROW : (ri % 2 === 0 ? WHITE : "#F5F9FF"), type: ShadingType.CLEAR },
          margins: { top: 60, bottom: 60, left: 100, right: 100 },
          children: [new Paragraph({
            children: [new TextRun({ text: c, size: 18, bold: ci === 0 && !row.isSubrow, font: "Arial" })]
          })]
        }))
      }))
    ]
  });
}

// ========================
// TASK 3 TABLE
// ========================
function makeTask3Table(rows) {
  const colWidths = [1400, 2400, 5560];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({
        children: ["设计决策类别", "设计决策", "支撑理由"].map((h, i) => new TableCell({
          borders,
          width: { size: colWidths[i], type: WidthType.DXA },
          shading: { fill: BLUE, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: h, bold: true, size: 20, color: WHITE, font: "Arial" })] })]
        }))
      }),
      ...rows.map((row, i) => new TableRow({
        children: row.map((c, ci) => new TableCell({
          borders,
          width: { size: colWidths[ci], type: WidthType.DXA },
          shading: { fill: ci === 0 ? HEADER_BG : (i % 2 === 0 ? WHITE : ALT_ROW), type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: c, size: 19, bold: ci === 0, font: "Arial" })] })]
        }))
      }))
    ]
  });
}

// ========================
// TASK 4 TABLE
// ========================
function makeTask4CompareTable(rows) {
  const colWidths = [2340, 2340, 2340, 2340];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({
        children: ["维度", "主动冗余 (Active)", "被动冗余 (Passive)", "备件 (Spare)"].map((h, i) => new TableCell({
          borders,
          width: { size: colWidths[i], type: WidthType.DXA },
          shading: { fill: BLUE, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: h, bold: true, size: 19, color: WHITE, font: "Arial" })] })]
        }))
      }),
      ...rows.map((row, i) => new TableRow({
        children: row.map((c, ci) => new TableCell({
          borders,
          width: { size: colWidths[ci], type: WidthType.DXA },
          shading: { fill: ci === 0 ? HEADER_BG : (i % 2 === 0 ? WHITE : ALT_ROW), type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [new Paragraph({ children: [new TextRun({ text: c, size: 18, bold: ci === 0, font: "Arial" })] })]
        }))
      }))
    ]
  });
}

// ========================
// DOCUMENT BUILD
// ========================
const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "○", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 360 } } } }
        ]
      }
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: BLUE },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: LIGHT_BLUE, space: 4 } } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: LIGHT_BLUE },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: DARK_GRAY },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1260, bottom: 1440, left: 1260 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: LIGHT_BLUE, space: 4 } },
          children: [
            new TextRun({ text: "软件架构课程作业", font: "Arial", size: 18, color: LIGHT_BLUE }),
            new TextRun({ text: " | AI应用架构质量属性分析", font: "Arial", size: 18, color: DARK_GRAY })
          ]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC", space: 4 } },
          children: [
            new TextRun({ text: "第 ", font: "Arial", size: 18, color: DARK_GRAY }),
            new TextRun({
                text: PageNumber.CURRENT, // 这里！不再 new PageNumber()
                font: "Arial",
                size: 18,
                color: DARK_GRAY,
            }),
            new TextRun({ text: " 页", font: "Arial", size: 18, color: DARK_GRAY })
          ]
        })]
      })
    },
    children: [

      // ===================== COVER PAGE =====================
      new Paragraph({ spacing: { before: 2000 }, children: [new TextRun("")] }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 200 },
        children: [new TextRun({ text: "软件架构", bold: true, size: 72, color: BLUE, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 100 },
        children: [new TextRun({ text: "课程作业报告", bold: true, size: 52, color: LIGHT_BLUE, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 300, after: 600 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: LIGHT_BLUE, space: 8 } },
        children: [new TextRun({ text: "AI应用架构质量属性分析", size: 36, color: DARK_GRAY, font: "Arial" })]
      }),
      new Paragraph({ spacing: { before: 400, after: 120 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Tasks 1–4: 质量属性场景 · 战术 · 设计决策 · 冗余战术辩论", size: 26, color: DARK_GRAY, font: "Arial", italics: true })] }),
      new Paragraph({ spacing: { before: 200 }, children: [new TextRun("")] }),
      pageBreak(),

      // ===================== TASK 1 =====================
      heading1("Task 1：质量属性场景分析（8分）"),

      heading2("1.1 AI使能应用与AI原生应用的差异"),
      para("随着人工智能技术的飞速发展，AI在软件系统中的角色已从辅助工具演变为核心架构要素。根据当前业界研究，AI应用主要分为两大类型：AI使能应用（AI-Enabled Applications）与AI原生应用（AI-Native Applications）。"),
      spacer(),

      heading3("1.1.1 AI使能应用（AI-Enabled Applications）"),
      para("AI使能应用是指在传统软件系统基础上，通过集成AI组件（如机器学习模型、自然语言处理模块、计算机视觉API等）来增强特定功能的应用。AI在此类系统中扮演辅助角色，而非系统的核心驱动力。"),
      para("典型特征："),
      bullet("AI功能以插件或微服务形式嵌入现有架构，系统可在无AI组件时降级运行"),
      bullet("AI推理（inference）是离散的功能调用，而非持续的系统行为"),
      bullet("传统业务逻辑主导系统控制流，AI仅在特定决策节点介入"),
      bullet("典型示例：集成了智能推荐功能的电商平台、搭载OCR功能的文档管理系统"),
      spacer(),

      heading3("1.1.2 AI原生应用（AI-Native Applications）"),
      para("AI原生应用是指从设计之初便以AI能力为核心架构基础的应用。AI不是附加功能，而是系统存在的根本价值所在，整个架构围绕AI模型的训练、推理、持续学习进行设计。"),
      para("典型特征："),
      bullet("AI模型是系统的核心计算引擎，业务逻辑以AI输出为驱动"),
      bullet("系统持续收集反馈数据，支持模型的在线学习与自适应更新"),
      bullet("架构天然支持大规模并行推理、模型版本管理与A/B测试"),
      bullet("典型示例：大型语言模型服务平台（如ChatGPT）、自动驾驶决策系统、智能代码生成工具"),
      spacer(),

      heading3("1.1.3 两类应用的核心差异对比"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2000, 3680, 3680],
        rows: [
          new TableRow({ children: [
            cell("对比维度", { width: 2000, bg: BLUE, bold: true, color: WHITE, align: AlignmentType.CENTER }),
            cell("AI使能应用", { width: 3680, bg: BLUE, bold: true, color: WHITE, align: AlignmentType.CENTER }),
            cell("AI原生应用", { width: 3680, bg: BLUE, bold: true, color: WHITE, align: AlignmentType.CENTER })
          ]}),
          new TableRow({ children: [
            cell("AI的角色", { width: 2000, bg: HEADER_BG, bold: true }),
            cell("功能增强组件，系统可降级运行", { width: 3680 }),
            cell("核心架构要素，去掉AI系统失去根本价值", { width: 3680, bg: ALT_ROW })
          ]}),
          new TableRow({ children: [
            cell("设计起点", { width: 2000, bg: HEADER_BG, bold: true }),
            cell("从已有系统出发，集成AI能力", { width: 3680, bg: ALT_ROW }),
            cell("从AI能力出发，构建完整系统", { width: 3680 })
          ]}),
          new TableRow({ children: [
            cell("数据流", { width: 2000, bg: HEADER_BG, bold: true }),
            cell("批量/按需调用AI推理", { width: 3680 }),
            cell("持续数据流驱动模型更新与推理", { width: 3680, bg: ALT_ROW })
          ]}),
          new TableRow({ children: [
            cell("可解释性需求", { width: 2000, bg: HEADER_BG, bold: true }),
            cell("较低，AI仅影响部分功能", { width: 3680, bg: ALT_ROW }),
            cell("极高，AI决策直接决定系统行为", { width: 3680 })
          ]}),
          new TableRow({ children: [
            cell("典型质量关注点", { width: 2000, bg: HEADER_BG, bold: true }),
            cell("集成复杂性、推理性能", { width: 3680 }),
            cell("模型可靠性、可解释性、持续学习", { width: 3680, bg: ALT_ROW })
          ]})
        ]
      }),
      spacer(),

      heading2("1.2 质量属性选取"),
      para("基于上述差异分析，本报告为两类应用各选取两项最高优先级质量属性："),
      spacer(),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3000, 3180, 3180],
        rows: [
          new TableRow({ children: [
            cell("质量属性", { width: 3000, bg: BLUE, bold: true, color: WHITE }),
            cell("AI使能应用", { width: 3180, bg: BLUE, bold: true, color: WHITE }),
            cell("AI原生应用", { width: 3180, bg: BLUE, bold: true, color: WHITE })
          ]}),
          new TableRow({ children: [
            cell("① 性能效率（Performance Efficiency）", { width: 3000, bg: HEADER_BG, bold: true }),
            cell("✅ 高优先级（讲义涵盖）", { width: 3180 }),
            cell("✅ 高优先级（讲义涵盖，COMMON）", { width: 3180, bg: ALT_ROW })
          ]}),
          new TableRow({ children: [
            cell("② 可集成性（Integrability）", { width: 3000, bg: HEADER_BG, bold: true }),
            cell("✅ 高优先级（讲义未涵盖）", { width: 3180, bg: ALT_ROW }),
            cell("—", { width: 3180 })
          ]}),
          new TableRow({ children: [
            cell("③ 可解释性（Explainability / XAI）", { width: 3000, bg: HEADER_BG, bold: true }),
            cell("—", { width: 3180 }),
            cell("✅ 高优先级（讲义未涵盖）", { width: 3180, bg: ALT_ROW })
          ]})
        ]
      }),
      para("说明：性能效率（Performance Efficiency）为两类应用的共同（COMMON）质量属性；可集成性（Integrability）为AI使能应用特有且讲义未涵盖；可解释性（Explainability）为AI原生应用特有且讲义未涵盖。", { italic: true }),
      spacer(),

      heading2("1.3 AI使能应用：质量属性一——可集成性（Integrability）"),
      heading3("1.3.1 通用场景（General Scenario）六要素表"),
      makeScenarioTable([
        ["质量属性", "可集成性（Integrability）—— AI使能应用"],
        ["来源（Source）", "开发团队、第三方AI服务提供商、运维团队"],
        ["刺激（Stimulus）", "将外部AI组件（如大模型API、ML微服务）集成到现有软件系统中，或在集成后对AI组件进行版本升级/替换"],
        ["制品（Artifact）", "软件系统的集成接口层、AI服务连接器、数据管道、现有业务模块"],
        ["环境（Environment）", "开发/测试/生产环境；AI组件可为云端SaaS、私有化部署或边缘推理模式"],
        ["响应（Response）", "系统通过标准化接口适配AI组件，隔离AI变更对业务逻辑的影响；集成过程中保持现有功能正常运行"],
        ["响应度量（Response Measure）", "① 集成所需修改的代码行数（LOC变更）≤ 已有代码总量的5%\n② AI组件替换导致的集成测试重新执行时间 ≤ 2小时\n③ 集成后的接口协议不兼容错误率 < 0.1%\n④ 从集成启动到首个AI功能上线的端到端时间 ≤ 3个工作日"]
      ]),
      spacer(),

      heading3("1.3.2 典型具体场景（Concrete Scenario）刺激-响应图"),
      para("场景描述：某企业OA系统（传统J2EE架构）需集成第三方大语言模型API以实现智能合同审查功能。在集成测试阶段，第三方AI服务商宣布其v2 API将于30天后停止支持，需迁移至v3 API（接口参数结构发生变更）。"),
      spacer(),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1800, 7560],
        rows: [
          new TableRow({ children: [cell("来源", { width: 1800, bg: LIGHT_BLUE, bold: true, color: WHITE }), cell("第三方AI服务提供商（LLM API供应商）", { width: 7560 })] }),
          new TableRow({ children: [cell("刺激", { width: 1800, bg: LIGHT_BLUE, bold: true, color: WHITE }), cell("AI服务商宣布v2 API 30天内下线，v3 API接口结构变更（请求体JSON Schema变更、新增必填认证字段）", { width: 7560, bg: ALT_ROW })] }),
          new TableRow({ children: [cell("制品", { width: 1800, bg: LIGHT_BLUE, bold: true, color: WHITE }), cell("OA系统中的AI集成适配层（Adapter）、合同审查业务模块、CI/CD流水线", { width: 7560 })] }),
          new TableRow({ children: [cell("环境", { width: 1800, bg: LIGHT_BLUE, bold: true, color: WHITE }), cell("生产环境正在运行v2集成；距API下线截止日期30天；系统每日处理500+合同审查请求", { width: 7560, bg: ALT_ROW })] }),
          new TableRow({ children: [cell("响应", { width: 1800, bg: LIGHT_BLUE, bold: true, color: WHITE }), cell("架构团队在适配层中新建v3 Adapter，通过功能开关（Feature Flag）并行支持v2/v3；业务逻辑层零修改；完成回归测试后在截止日期前7天完成切换", { width: 7560 })] }),
          new TableRow({ children: [
            cell("响应度量", { width: 1800, bg: LIGHT_BLUE, bold: true, color: WHITE }),
            cell("① 业务模块代码修改量：0行（完全隔离）\n② 适配层新增代码：< 300行\n③ 集成测试重新执行时间：1.5小时（< 2小时基准）\n④ 切换后合同审查API成功率：99.97%（v2基准99.95%）\n⑤ 迁移总耗时：12个工作日（< 30天截止期）", { width: 7560, bg: ALT_ROW })
          ]}),
        ]
      }),
      spacer(),

      heading2("1.4 AI使能应用：质量属性二——性能效率（Performance Efficiency）[COMMON]"),
      heading3("1.4.1 通用场景六要素表"),
      makeScenarioTable([
        ["质量属性", "性能效率（Performance Efficiency）—— AI使能应用"],
        ["来源（Source）", "终端用户、自动化流程调度器、高并发负载场景"],
        ["刺激（Stimulus）", "系统在正常运营或业务峰值期间发起AI推理请求（如批量文档分析、实时推荐计算）"],
        ["制品（Artifact）", "AI推理服务、请求调度器、资源池、缓存层"],
        ["环境（Environment）", "正常运营环境下的高并发场景；AI推理服务部署于云端GPU集群或CPU推理集群"],
        ["响应（Response）", "系统对AI推理请求进行调度优化，在资源约束内最大化吞吐量，保证响应时间SLA"],
        ["响应度量（Response Measure）", "① 单次AI推理请求的P99响应时间 ≤ 800ms\n② 系统在峰值并发下（1000 QPS）AI推理成功率 ≥ 99.5%\n③ GPU/CPU推理资源利用率维持在70%-85%区间（避免空转与过载）"]
      ]),
      spacer(),

      heading3("1.4.2 具体场景（AI使能应用性能效率）"),
      para("场景描述：某视频流媒体平台使用ML模型进行实时内容推荐（AI使能），在某大型体育赛事直播期间，并发用户量从日常5万人突增至30万人，AI推荐服务出现响应延迟激增。"),
      spacer(),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1800, 7560],
        rows: [
          new TableRow({ children: [cell("来源", { width: 1800, bg: LIGHT_BLUE, bold: true, color: WHITE }), cell("30万并发终端用户，峰值请求量约15,000 QPS", { width: 7560 })] }),
          new TableRow({ children: [cell("刺激", { width: 1800, bg: LIGHT_BLUE, bold: true, color: WHITE }), cell("AI推荐请求量在5分钟内从3,000 QPS飙升至15,000 QPS，超过预配容量6倍", { width: 7560, bg: ALT_ROW })] }),
          new TableRow({ children: [cell("制品", { width: 1800, bg: LIGHT_BLUE, bold: true, color: WHITE }), cell("ML推荐模型推理服务、请求队列、结果缓存层、自动扩缩容控制器", { width: 7560 })] }),
          new TableRow({ children: [cell("环境", { width: 1800, bg: LIGHT_BLUE, bold: true, color: WHITE }), cell("云端生产环境，已启用自动扩缩容；峰值期间延迟突增，部分节点GPU内存耗尽", { width: 7560, bg: ALT_ROW })] }),
          new TableRow({ children: [cell("响应", { width: 1800, bg: LIGHT_BLUE, bold: true, color: WHITE }), cell("系统触发弹性扩缩容在90秒内扩展至3倍节点数；启用热门内容预计算缓存降低实时推理压力；对超长队列请求降级返回规则推荐结果", { width: 7560 })] }),
          new TableRow({ children: [
            cell("响应度量", { width: 1800, bg: LIGHT_BLUE, bold: true, color: WHITE }),
            cell("① P99响应时间从峰值1,800ms恢复至650ms（< 800ms SLA）\n② 推理服务成功率：99.6%（降级期间99.1%，降级结束后99.8%）\n③ 扩容响应时间：90秒完成节点扩展\n④ 峰值期间GPU利用率：78%（在70%-85%健康区间内）", { width: 7560, bg: ALT_ROW })
          ]}),
        ]
      }),
      spacer(),

      heading2("1.5 AI原生应用：质量属性一——可解释性（Explainability / XAI）"),
      heading3("1.5.1 通用场景六要素表"),
      makeScenarioTable([
        ["质量属性", "可解释性（Explainability）—— AI原生应用（讲义未涵盖）"],
        ["来源（Source）", "最终用户、监管机构、业务审计人员、模型开发团队"],
        ["刺激（Stimulus）", "AI原生系统作出重要决策（如贷款拒绝、医疗诊断、内容过滤），利益相关方要求理解决策依据"],
        ["制品（Artifact）", "AI核心决策模型、解释生成模块（XAI组件）、审计日志、决策报告接口"],
        ["环境（Environment）", "受监管行业（金融、医疗、法律）的生产运行环境；部分场景下需满足GDPR、EU AI Act等法规要求"],
        ["响应（Response）", "系统为每项AI决策提供人类可理解的解释（特征重要性、反事实解释或自然语言说明），并记录完整的决策审计链路"],
        ["响应度量（Response Measure）", "① 解释生成延迟 ≤ 200ms（与主推理过程并行或低延迟附加）\n② 可解释性满足度评分（用户调研）≥ 4.0/5.0\n③ 监管合规审计通过率：100%\n④ 提供特征归因覆盖率：决策涉及的所有关键特征均有量化解释"]
      ]),
      spacer(),

      heading3("1.5.2 具体场景（AI原生应用可解释性）"),
      para("场景描述：某AI原生信贷审批平台的模型拒绝了一位小微企业主的贷款申请，该申请人要求银行依据GDPR\"解释权\"条款提供拒绝原因。监管机构同步要求该平台在48小时内提供该决策的完整解释报告。"),
      spacer(),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1800, 7560],
        rows: [
          new TableRow({ children: [cell("来源", { width: 1800, bg: LIGHT_BLUE, bold: true, color: WHITE }), cell("申请人（小微企业主）+ 金融监管机构", { width: 7560 })] }),
          new TableRow({ children: [cell("刺激", { width: 1800, bg: LIGHT_BLUE, bold: true, color: WHITE }), cell("申请人援引GDPR第22条提出申诉，要求获得拒贷决策的可理解解释；监管机构要求48小时内提交完整决策审计报告", { width: 7560, bg: ALT_ROW })] }),
          new TableRow({ children: [cell("制品", { width: 1800, bg: LIGHT_BLUE, bold: true, color: WHITE }), cell("信贷评分模型（XGBoost+深度学习融合）、SHAP值解释模块、决策审计日志、自然语言报告生成器", { width: 7560 })] }),
          new TableRow({ children: [cell("环境", { width: 1800, bg: LIGHT_BLUE, bold: true, color: WHITE }), cell("生产环境；决策已于3天前作出；需从审计日志中回溯重现解释结果", { width: 7560, bg: ALT_ROW })] }),
          new TableRow({ children: [cell("响应", { width: 1800, bg: LIGHT_BLUE, bold: true, color: WHITE }), cell("XAI模块基于存储的推理上下文重新生成SHAP特征归因图；NLG模块将技术解释转化为非技术性文字；系统在4小时内向申请人和监管机构分别提供差异化解释报告", { width: 7560 })] }),
          new TableRow({ children: [
            cell("响应度量", { width: 1800, bg: LIGHT_BLUE, bold: true, color: WHITE }),
            cell("① 解释报告生成时间：4小时（远 < 48小时合规要求）\n② SHAP特征覆盖率：100%（12个决策特征全部有量化归因）\n③ 用户可理解性评分：4.2/5.0（非技术用户测试）\n④ 监管审计报告合规性：100%通过\n⑤ 系统无需重新运行模型推理（基于日志回放）", { width: 7560, bg: ALT_ROW })
          ]}),
        ]
      }),
      spacer(),

      heading2("1.6 AI原生应用：质量属性二——性能效率（Performance Efficiency）[COMMON]"),
      heading3("1.6.1 通用场景六要素表"),
      makeScenarioTable([
        ["质量属性", "性能效率（Performance Efficiency）—— AI原生应用"],
        ["来源（Source）", "海量并发用户、在线学习数据流处理器、模型推理调度引擎"],
        ["刺激（Stimulus）", "大规模并发推理请求涌入，同时系统需要并行处理模型训练/微调任务，形成推理-训练资源竞争"],
        ["制品（Artifact）", "大规模AI模型（LLM/多模态模型）、推理加速引擎、训练集群、资源调度器、KV缓存系统"],
        ["环境（Environment）", "大规模GPU集群；推理与训练任务共存；低延迟高吞吐要求；模型参数规模可达数百亿"],
        ["响应（Response）", "系统通过模型并行、量化压缩、KV缓存等技术最大化推理吞吐，同时通过资源优先级调度保证推理任务的SLA不被训练任务影响"],
        ["响应度量（Response Measure）", "① 首个Token生成延迟（TTFT）≤ 500ms（P95）\n② 模型推理吞吐量（Tokens/秒）≥ 系统设计容量的85%\n③ 推理-训练任务资源隔离下，推理SLA达标率 ≥ 99.9%\n④ 模型量化后精度损失 ≤ 1%（F1 score对比）"]
      ]),
      spacer(),

      heading3("1.6.2 具体场景（AI原生应用性能效率）"),
      para("场景描述：某AI原生代码生成平台（类GitHub Copilot）在工作日上午9-10点迎来日活峰值，同时后台正在执行基于前日用户数据的模型增量微调任务。系统出现推理延迟超标，部分用户代码补全响应时间超过3秒。"),
      spacer(),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1800, 7560],
        rows: [
          new TableRow({ children: [cell("来源", { width: 1800, bg: LIGHT_BLUE, bold: true, color: WHITE }), cell("50,000并发开发者用户 + 后台模型微调任务调度器", { width: 7560 })] }),
          new TableRow({ children: [cell("刺激", { width: 1800, bg: LIGHT_BLUE, bold: true, color: WHITE }), cell("推理请求量达25,000 QPS；同时运行的微调任务占用了40% GPU资源，导致推理任务资源不足", { width: 7560, bg: ALT_ROW })] }),
          new TableRow({ children: [cell("制品", { width: 1800, bg: LIGHT_BLUE, bold: true, color: WHITE }), cell("代码生成LLM（34B参数）、TensorRT-LLM推理引擎、Continuous Batching调度器、微调任务管理器", { width: 7560 })] }),
          new TableRow({ children: [cell("环境", { width: 1800, bg: LIGHT_BLUE, bold: true, color: WHITE }), cell("共享GPU集群（A100×512卡）；峰值期间推理-训练资源竞争激烈；TTFT已达3,200ms（超出800ms SLA）", { width: 7560, bg: ALT_ROW })] }),
          new TableRow({ children: [cell("响应", { width: 1800, bg: LIGHT_BLUE, bold: true, color: WHITE }), cell("资源调度器自动暂停非紧急微调任务，将GPU资源优先保障推理；启用INT8量化降低模型内存占用；Continuous Batching优化将平均batch利用率提升至82%", { width: 7560 })] }),
          new TableRow({ children: [
            cell("响应度量", { width: 1800, bg: LIGHT_BLUE, bold: true, color: WHITE }),
            cell("① TTFT从3,200ms恢复至420ms（< 500ms P95目标）\n② 推理吞吐量：恢复至设计容量的91%\n③ 微调任务暂停响应时间：45秒（自动触发）\n④ INT8量化精度损失：0.7%（< 1%基准）\n⑤ 峰值期间推理SLA达标率：99.94%", { width: 7560, bg: ALT_ROW })
          ]}),
        ]
      }),

      pageBreak(),

      // ===================== TASK 2 =====================
      heading1("Task 2：战术分析（6分）"),
      para("本任务围绕三项质量属性（可集成性、性能效率、可解释性）分别提出改善策略与战术，并重点比较公共质量属性\"性能效率\"在两类应用中的异同。"),
      spacer(),

      heading2("2.1 可集成性（Integrability）战术分析——AI使能应用"),
      makeTask2Table({
        headers: ["层次", "策略/战术", "描述", "收益（Benefits）", "代价（Penalties）"],
        rows: [
          { cells: ["策略1", "接口标准化与抽象隔离", "通过统一接口协议与适配器模式将AI组件与业务逻辑解耦", "", ""], isSubrow: false },
          { cells: ["", "战术1.1 适配器模式（Adapter Pattern）", "为每个AI服务实现独立Adapter，统一输入输出格式，业务层通过抽象接口调用", "AI组件可独立升级/替换；业务代码零修改", "增加适配层开发与维护工作量；轻微运行时开销（约1-5ms）"], isSubrow: true },
          { cells: ["", "战术1.2 API契约先行（Contract-First API）", "采用OpenAPI/AsyncAPI规范定义AI服务接口，接口冻结后再开发实现", "显著减少集成不兼容错误；提高团队并行开发效率", "前期契约设计投入较大；接口变更需走正式变更流程（影响敏捷性）"], isSubrow: true },
          { cells: ["策略2", "服务网格与动态注册", "利用服务发现与功能开关实现AI组件的动态切换", "", ""], isSubrow: false },
          { cells: ["", "战术2.1 功能开关（Feature Flag）", "通过配置中心控制AI组件的启用/禁用，支持灰度切换与A/B测试", "零停机切换AI版本；支持快速回滚", "增加配置管理复杂度；功能开关过多导致技术债务"], isSubrow: true },
          { cells: ["", "战术2.2 服务注册与发现（Service Registry）", "AI微服务通过Consul/Eureka注册，调用方动态发现最新端点", "支持AI服务弹性扩缩容；减少硬编码依赖", "引入注册中心单点风险；增加网络开销（约3-10ms）；对性能效率有轻微负面影响"], isSubrow: true },
        ]
      }),
      spacer(),

      heading2("2.2 性能效率（Performance Efficiency）战术分析——AI使能应用"),
      makeTask2Table({
        headers: ["层次", "策略/战术", "描述", "收益（Benefits）", "代价（Penalties）"],
        rows: [
          { cells: ["策略1", "推理缓存与预计算", "对高频AI推理结果进行缓存，减少重复计算", "", ""], isSubrow: false },
          { cells: ["", "战术1.1 语义缓存（Semantic Cache）", "对语义相似的输入命中已缓存结果，不触发实际推理", "降低推理延迟80%+；降低AI服务调用成本", "缓存命中率依赖输入重复度；可能返回略微过时的结果（影响准确性）"], isSubrow: true },
          { cells: ["", "战术1.2 结果预计算（Pre-computation）", "对可预测输入（如热门商品推荐）提前计算并缓存推理结果", "实时响应接近0延迟；减少峰值计算压力", "需要维护预计算任务调度系统；存储成本增加；覆盖范围有限"], isSubrow: true },
          { cells: ["策略2", "弹性资源调度", "根据负载动态调整AI推理资源规模", "", ""], isSubrow: false },
          { cells: ["", "战术2.1 水平自动扩缩容（HPA）", "基于QPS或GPU利用率自动增减AI推理实例数量", "应对突发流量；避免资源浪费", "扩容有冷启动延迟（60-120秒）；对可用性（Availability）有短暂影响"], isSubrow: true },
          { cells: ["", "战术2.2 请求降级（Graceful Degradation）", "峰值期间对低优先级AI推理切换至轻量规则模型或缓存兜底", "防止系统过载导致全面崩溃；保证核心功能可用", "降级期间AI功能质量下降（影响功能正确性）；用户体验变差"], isSubrow: true },
        ]
      }),
      spacer(),

      heading2("2.3 性能效率（Performance Efficiency）战术分析——AI原生应用"),
      makeTask2Table({
        headers: ["层次", "策略/战术", "描述", "收益（Benefits）", "代价（Penalties）"],
        rows: [
          { cells: ["策略1", "模型推理加速", "通过模型压缩与硬件优化提升推理速度", "", ""], isSubrow: false },
          { cells: ["", "战术1.1 模型量化（Model Quantization）", "将模型权重从FP32压缩至INT8/INT4，减少显存占用与计算量", "推理速度提升2-4倍；显存占用降低50-75%", "精度轻微下降（0.5%-2%）；量化需专业工程投入；影响模型可解释性（精度损失）"], isSubrow: true },
          { cells: ["", "战术1.2 连续批处理（Continuous Batching）", "动态将不同长度请求合并为最优batch进行推理", "GPU利用率提升至85%+；吞吐量提升3-5倍", "实现复杂度高；对部分请求引入轻微延迟增加（排队等待）"], isSubrow: true },
          { cells: ["策略2", "分布式推理架构", "通过模型并行与资源隔离支撑超大规模推理", "", ""], isSubrow: false },
          { cells: ["", "战术2.1 张量并行（Tensor Parallelism）", "将模型权重分片至多GPU，并行执行矩阵运算", "支持超大参数规模模型（100B+）；降低单卡内存压力", "多卡通信开销增加（all-reduce操作）；对网络带宽要求极高；系统复杂度大幅上升"], isSubrow: true },
          { cells: ["", "战术2.2 推理-训练资源优先级调度", "建立推理任务优先级队列，峰值期间自动抢占训练任务资源", "确保推理SLA；最大化资源利用效率", "微调/训练任务延期（影响模型更新频率）；调度逻辑复杂；训练任务中断恢复成本高"], isSubrow: true },
        ]
      }),
      spacer(),

      heading2("2.4 公共属性\"性能效率\"在两类应用中的策略战术对比"),
      para("AI使能应用的性能优化重点在于减少外部AI调用次数（缓存/预计算）和弹性应对负载波动（HPA/降级）——因为AI是系统的\"外挂\"，优化方向是减少对AI的依赖或提升调用效率。"),
      para("AI原生应用的性能优化深入到模型推理本身（量化、并行化、批处理）——因为AI就是系统的核心引擎，必须从算法和硬件层面提升AI本身的执行效率。两类应用均需处理资源调度问题，但AI原生应用的调度粒度更细（GPU级别），复杂度远高于AI使能应用的容器级别扩缩容。"),
      spacer(),

      heading2("2.5 可解释性（Explainability）战术分析——AI原生应用"),
      makeTask2Table({
        headers: ["层次", "策略/战术", "描述", "收益（Benefits）", "代价（Penalties）"],
        rows: [
          { cells: ["策略1", "事后解释（Post-hoc Explanation）", "在模型推理完成后附加解释生成步骤", "", ""], isSubrow: false },
          { cells: ["", "战术1.1 SHAP值归因分析", "计算每个输入特征对输出结果的边际贡献，生成量化特征重要性报告", "模型无关，适用于任何黑盒模型；解释可量化可审计", "计算开销较大（对于树模型约10-50ms，对于深度学习可达200ms）；对性能效率有负面影响"], isSubrow: true },
          { cells: ["", "战术1.2 反事实解释（Counterfactual Explanation）", "生成\"如果输入变量X改变多少，决策将会不同\"的反事实样本", "直接指导用户改善决策条件；符合GDPR解释权要求", "生成反事实样本计算复杂；可能存在不现实的假设情境；实现难度高"], isSubrow: true },
          { cells: ["策略2", "本质可解释模型设计", "在架构设计时选用或构建本质上可解释的模型", "", ""], isSubrow: false },
          { cells: ["", "战术2.1 注意力机制可视化（Attention Visualization）", "对Transformer模型的注意力权重进行可视化，展示决策依据的上下文", "天然与推理过程一体，零额外延迟；适合NLP/多模态场景", "注意力权重与决策因果关系存在争议；可视化结果对非技术用户难以理解"], isSubrow: true },
          { cells: ["", "战术2.2 代理模型（Surrogate Model）", "训练轻量级可解释代理模型（如决策树）近似复杂黑盒模型的行为", "解释高度直观（规则可读）；计算开销低", "代理模型近似精度有限（影响解释准确性）；代理模型维护成本高；对模型可维护性有影响"], isSubrow: true },
        ]
      }),

      pageBreak(),

      // ===================== TASK 3 =====================
      heading1("Task 3：架构设计决策（6分）"),
      para("依据软件架构设计决策的七大类别，本任务从以下五类中各提出至少两项针对Task 1质量属性的重要设计决策，并阐述其支撑理由。"),
      spacer(),

      heading2("3.1 五类架构设计决策总览"),
      makeTask3Table([
        ["①模块分解", "AI集成层与业务逻辑层的严格分离（AI使能应用）", "将AI推理接口、数据适配、结果后处理封装于独立的AI Integration Layer，通过防腐层（Anti-Corruption Layer）与业务模块解耦。这直接支撑可集成性——任何AI组件的升级或替换仅在AI集成层内部处理，不扩散至业务代码。若不进行此分解，AI服务商的每次API变更都需要修改业务逻辑，导致集成成本急剧上升且影响系统稳定性。"],
        ["①模块分解", "XAI解释模块的独立微服务化（AI原生应用）", "将可解释性生成功能（SHAP计算、反事实生成、报告NLG）设计为独立微服务，与核心推理引擎解耦。理由：解释功能计算密集且需求频率低于推理功能，独立部署可按需伸缩，避免影响核心推理性能。同时解释服务可独立更新解释算法（如从SHAP升级至更先进的方法），不影响推理引擎。"],
        ["②数据模型", "推理请求/响应数据的不可变审计日志设计（AI原生应用）", "所有AI推理的输入特征、模型版本号、输出结果、推理时间戳以不可变形式持久化存储（Append-Only Event Log）。这是可解释性质量属性的基础数据架构决策——没有历史推理上下文的保存，事后解释（Post-hoc XAI）便无法对已发生的决策进行重现和解释，违反GDPR等法规的审计要求。"],
        ["②数据模型", "AI集成层接口的版本化契约数据模型设计（AI使能应用）", "为AI服务的每个版本维护独立的数据契约Schema（如使用Avro/Protobuf），实现双版本并行运行。这使得AI服务升级过程中系统可同时支持新旧版本，通过功能开关逐步切流，实现无停机迁移。传统单一Schema设计在AI服务升级时会导致集成层与服务层的版本强耦合，引发可集成性问题。"],
        ["③组件映射", "AI推理引擎与GPU资源的亲和性部署策略（AI原生应用）", "将大规模AI推理容器配置GPU亲和性（Node Affinity）与资源Quota，确保推理任务优先绑定高性能GPU节点，训练任务分配至低优先级资源池。直接支撑性能效率——避免推理和训练任务抢占同类GPU资源导致的性能抖动，确保推理SLA的可预测性。"],
        ["③组件映射", "推理服务的多级部署拓扑（AI使能应用）", "AI推理服务按地理区域和访问频率分层部署：核心API集中于主数据中心，高频预计算结果分发至CDN边缘节点，低延迟场景部署边缘推理节点。支撑性能效率——通过地理邻近性减少网络延迟，通过边缘预计算降低对中央推理服务的依赖，从物理部署层面保障响应时间SLA。"],
        ["④运行时管理", "AI模型版本管理与在线热切换机制（AI原生应用）", "部署模型版本注册表（Model Registry），支持多版本并行运行；通过影子模式（Shadow Mode）和金丝雀发布实现新版本无感知上线。理由：AI原生应用中模型持续迭代更新，没有在线热切换机制则每次模型更新都需系统停机，严重影响可用性与性能连续性。金丝雀发布还能在小流量下验证新模型的推理性能，降低上线风险。"],
        ["④运行时管理", "AI集成层的熔断与超时管理（AI使能应用）", "为每个外部AI服务调用配置独立熔断器（Circuit Breaker）和超时上限（如最大等待800ms），超时后触发降级逻辑。支撑性能效率和可用性——防止外部AI服务的慢响应或故障通过级联失败拖垮整个系统。熔断器还能在AI服务恢复后自动重新接入，实现自愈（Self-healing）而无需人工干预。"],
        ["⑤技术选型", "XAI框架选型：SHAP + 自定义NLG管道（AI原生应用）", "选用SHAP作为通用解释框架（支持树模型、深度学习、LLM等多种架构），结合自定义NLG模板生成人类可读报告，而非选用单一集成XAI平台。理由：SHAP是业界标准，具有最广泛的模型兼容性和学术验证，未来更换底层模型时无需更换解释框架。自定义NLG管道可精确控制解释文本的合规性措辞，避免第三方平台的输出格式不可控。"],
        ["⑤技术选型", "AI集成协议选型：gRPC替代REST（AI使能应用）", "对高频AI推理调用采用gRPC（HTTP/2 + Protocol Buffers）而非JSON-over-REST。理由：gRPC的二进制序列化协议使传输效率比REST JSON高30-60%，流式调用支持场景（如流式LLM输出）更加自然，且强类型Proto定义天然支持API版本管理，直接支撑性能效率与可集成性双重质量属性。"],
      ]),

      pageBreak(),

      // ===================== TASK 4 =====================
      heading1("Task 4：替代可用性战术辩论（5分）"),

      heading2("4.1 三种冗余战术的成本收益分析"),
      makeTask4CompareTable([
        ["定义", "所有冗余节点实时运行，同步处理请求，任一节点失效立即由其他节点接管", "一个主节点运行，备用节点处于热备状态（同步状态但不处理请求），主节点失效时切换至备节点", "备用节点处于冷备或关机状态，主节点失效后需要启动、加载软件和数据后才能接管"],
        ["恢复时间", "近乎0（milliseconds级），无感知切换", "秒级（1-30秒），状态同步后快速切换", "分钟级（5-30分钟），需完整启动流程"],
        ["资源成本", "极高：N个节点均全功率运行，资源利用率 1/N", "中等：备节点消耗约50-80%主节点资源（维持热备状态）", "低：备节点仅消耗存储成本，计算资源近零"],
        ["状态一致性", "极高：所有节点实时一致，无数据丢失风险", "高：主备节点通过实时复制保持同步，RPO趋近于0", "较低：备节点状态可能滞后（取决于备份频率），存在数据丢失风险"],
        ["复杂度", "高：需要负载均衡、分布式一致性协议（Raft/Paxos）、脑裂防护", "中：需要主备切换逻辑、心跳检测、脑裂防护", "低：主备切换逻辑简单，启动流程相对标准化"],
        ["适用失效类型", "硬件故障、软件崩溃、高并发过载（负载分担）", "单点故障、主节点崩溃（纯切换场景）", "硬件损毁、机房级灾难（需完整节点替换的场景）"],
        ["对性能效率影响", "正面：资源利用率高，还可分担负载提升吞吐", "中性：备节点不分担负载，主节点单独承压", "正面（常态）：节省资源；负面（故障时）：停机影响大"],
      ]),
      spacer(),

      heading2("4.2 三种场景分析——各战术的适用情境"),
      spacer(),

      heading3("场景一：AI原生LLM推理服务（大规模并发，超低延迟要求）"),
      para("推荐战术：主动冗余（Active Redundancy）"),
      para("理由：AI原生应用的核心推理服务通常需要处理每秒数万至数十万的推理请求，任何秒级以上的中断都会导致大规模用户体验崩溃。主动冗余不仅提供零停机故障恢复，还能通过负载均衡将流量分散至多个推理节点，直接提升系统吞吐量（与性能效率质量属性协同）。对于AI原生应用，推理服务的停机成本往往远高于额外节点的运营成本（OPEX）。此外，在滚动模型版本更新时，主动冗余架构支持逐节点更新而不中断服务，兼顾了可维护性。"),
      bullet("例证：ChatGPT、Claude等LLM服务平台采用多节点Active Redundancy架构，确保推理服务7×24可用"),
      bullet("成本取舍：GPU集群成本极高，但对于商业LLM服务，停机1分钟的用户损失可能超过数百万美元，故成本可接受"),
      spacer(),

      heading3("场景二：AI使能企业ERP系统中的AI审批模块（非高频，合规敏感）"),
      para("推荐战术：被动冗余（Passive Redundancy）"),
      para("理由：企业ERP系统的AI辅助审批功能（如智能报销审核、合同AI审查）通常不是高并发场景（日处理量数百到数千条），但对数据完整性和状态一致性要求极高（每一笔审批记录不能丢失）。被动冗余的主备架构能够在主节点故障时以秒级速度切换至备节点，同时通过主备实时数据同步确保RPO（恢复点目标）趋近于0，不会丢失正在处理的审批数据。相比主动冗余，被动冗余节省了约50%的服务器资源成本，对于非高频企业应用而言性价比更高。"),
      bullet("例证：Oracle ERP AI扩展模块、SAP AI Core均采用主备架构，在保证数据安全的同时控制基础设施成本"),
      bullet("成本取舍：被动冗余的备节点不承担业务负载，资源效率低于主动冗余，但显著低于为企业ERP配置全量Active Redundancy的成本"),
      spacer(),

      heading3("场景三：AI模型训练集群中的非关键后台分析作业（离线批处理，成本敏感）"),
      para("推荐战术：备件（Spare）"),
      para("理由：AI模型训练（尤其是实验性训练或离线分析任务）是典型的成本敏感型批处理场景。此类任务通常可接受较长的恢复时间（数十分钟到数小时），且训练任务具有检查点（Checkpoint）机制，节点故障后可从最近检查点恢复而非从头重来。采用Spare战术（如云厂商的竞价实例/Spot Instances作为备用计算资源），在节点故障时启动预配置的Spare节点接管剩余训练任务，既保证了作业最终完成，又将冗余成本降至最低（Spot实例成本仅为按需实例的10-30%）。主动冗余或被动冗余对离线训练场景的ROI极低。"),
      bullet("例证：AWS SageMaker、Google Vertex AI的训练集群广泛使用Spot实例+Checkpoint机制实现低成本容错"),
      bullet("成本取舍：接受分钟级到小时级中断恢复时间，换取极低的基础设施冗余成本"),
      spacer(),

      heading2("4.3 选择准则与决策框架"),
      para("综合上述分析，选择三种冗余战术的核心判断准则如下："),
      spacer(),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2800, 2187, 2187, 2186],
        rows: [
          new TableRow({ children: [
            cell("判断维度", { width: 2800, bg: BLUE, bold: true, color: WHITE }),
            cell("主动冗余", { width: 2187, bg: BLUE, bold: true, color: WHITE, align: AlignmentType.CENTER }),
            cell("被动冗余", { width: 2187, bg: BLUE, bold: true, color: WHITE, align: AlignmentType.CENTER }),
            cell("备件", { width: 2186, bg: BLUE, bold: true, color: WHITE, align: AlignmentType.CENTER })
          ]}),
          new TableRow({ children: [cell("可接受恢复时间（RTO）", { width: 2800, bg: HEADER_BG, bold: true }), cell("< 1秒", { width: 2187 }), cell("1-30秒", { width: 2187, bg: ALT_ROW }), cell("> 5分钟", { width: 2186 })] }),
          new TableRow({ children: [cell("数据丢失容忍度（RPO）", { width: 2800, bg: HEADER_BG, bold: true }), cell("零丢失", { width: 2187, bg: ALT_ROW }), cell("趋近零丢失", { width: 2187 }), cell("可接受丢失", { width: 2186, bg: ALT_ROW })] }),
          new TableRow({ children: [cell("负载是否需要分担", { width: 2800, bg: HEADER_BG, bold: true }), cell("是（高并发）", { width: 2187 }), cell("否（中低频）", { width: 2187, bg: ALT_ROW }), cell("否（离线作业）", { width: 2186 })] }),
          new TableRow({ children: [cell("预算约束", { width: 2800, bg: HEADER_BG, bold: true }), cell("宽松（收入关键型）", { width: 2187, bg: ALT_ROW }), cell("中等（企业应用）", { width: 2187 }), cell("严格（成本敏感）", { width: 2186, bg: ALT_ROW })] }),
          new TableRow({ children: [cell("AI应用典型场景", { width: 2800, bg: HEADER_BG, bold: true }), cell("LLM推理服务/AI原生实时系统", { width: 2187 }), cell("AI使能企业应用/合规系统", { width: 2187, bg: ALT_ROW }), cell("AI训练批处理/实验性任务", { width: 2186 })] }),
        ]
      }),
      spacer(),
      para("决策逻辑：首先评估RTO要求——如果业务不能承受任何秒级以上的中断，则选主动冗余；其次评估并发需求——如果系统需要通过冗余节点分担高并发负载，则同样指向主动冗余；然后评估数据一致性需求和预算约束——中等要求选被动冗余，低频/离线/成本敏感选备件。在AI应用架构中，同一系统的不同组件可混合使用不同战术：AI原生应用的推理服务采用主动冗余，其离线训练集群采用备件，其配置管理组件采用被动冗余，形成分级冗余架构，在成本与可用性之间取得最优平衡。"),
      spacer(),
      para("结语：没有放之四海而皆准的最佳冗余战术。正确的选择是在理解系统质量属性优先级（尤其是可用性的RTO/RPO指标、性能效率的并发需求）的基础上，结合业务约束（预算、故障影响范围、法规合规要求）综合判断的结果。AI使能应用与AI原生应用因其架构差异，在冗余战术选择上呈现出不同的偏好，但核心决策框架是一致的。", { italic: true }),
      spacer(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400 },
        children: [new TextRun({ text: "—— 报告完 ——", size: 22, color: DARK_GRAY, font: "Arial", italics: true })]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("./AI_Architecture_Quality_Attributes_Report.docx", buffer);
  console.log("Document created successfully!");
}).catch(err => {
  console.error("Error:", err);
});