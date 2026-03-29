---
name: ssd-resource-navigator
description: Navigate and retrieve Software System Design (软件系统设计) course resources
trigger: Use this skill when the user asks about Software System Design course materials, exam preparation, homework, or wants to find resources from different instructors or senior students
userInvocable: true
---

# Software System Design Resource Navigator

This skill helps you efficiently locate and utilize Software System Design course resources.

## Resource Map

### Two Main Resource Locations

#### Location 1: `软件系统设计/` (Current Semester)
- **课件/**: Current semester course slides
- **旧课件/**: Historical materials from past instructors
  - `pmx/`: Professor PMX's materials
  - (root): Other instructors' materials
- **复习资料/**: In-course review materials
  - `笔记/`: Senior students' lecture notes (学长学姐课堂笔记)
  - `机试/`: Past practical exams (往年上机考试)
  - `往年题/`: Past written exams (往年笔试题)
  - `作业/`: Past homework assignments (往年作业)

#### Location 2: `复习资料/【保研】软件系统设计/` (Graduate School Prep)
- **lxc资料/**: Li Xuecheng's comprehensive review materials
- **yhgg资料/**: yhgg's materials (focus on practice & code)
- **zhy复习资料/**: Zhao Haoyu's materials (focus on key points)
- **PPT/**: Consolidated course slides
- **机试/**: Practical exam compilation
- **Assignments/**: Homework compilation
- **software_design_211850016_体系结构代码作业/**: Architecture coding assignment example

## Usage Guide

### When the user asks for...

#### "课件" or "slides"
1. Check `软件系统设计/课件/` first (current semester)
2. If looking for specific instructor: `软件系统设计/旧课件/[instructor]/`
3. For consolidated view: `复习资料/【保研】软件系统设计/PPT/`

#### "复习资料" or "exam prep"
**Decision tree**:
- General review → `复习资料/【保研】软件系统设计/`
- Practical exam prep → `软件系统设计/复习资料/机试/` + `复习资料/【保研】软件系统设计/机试/`
- Written exam prep → `软件系统设计/复习资料/往年题/`
- Lecture notes → `软件系统设计/复习资料/笔记/`

#### "作业" or "homework"
1. Past homework: `软件系统设计/复习资料/作业/`
2. More examples: `复习资料/【保研】软件系统设计/Assignments/`
3. Specific architecture assignment: `复习资料/【保研】软件系统设计/software_design_211850016_体系结构代码作业/`

#### "学长资料" or "senior materials"
**By name**:
- lxc/李薛成 → `复习资料/【保研】软件系统设计/lxc资料/`
- yhgg → `复习资料/【保研】软件系统设计/yhgg资料/`
- zhy/赵浩宇 → `复习资料/【保研】软件系统设计/zhy复习资料/`
- 课堂笔记 → `软件系统设计/复习资料/笔记/`

#### "pmx老师" or comparing instructors
- PMX materials → `软件系统设计/旧课件/pmx/`
- Current instructor → `软件系统设计/课件/`
- Other instructors → `软件系统设计/旧课件/` (root level)

## Task Execution Steps

When user requests Software System Design materials:

1. **Identify request type** (current materials, exam prep, homework, instructor-specific)
2. **Determine search locations** based on the usage guide above
3. **Use Glob tool** to find relevant files:
   ```
   Pattern examples:
   - All current slides: "软件系统设计/课件/**/*.pdf"
   - All practical exams: "软件系统设计/复习资料/机试/**/*"
   - PMX materials: "软件系统设计/旧课件/pmx/**/*.pdf"
   - All lxc materials: "复习资料/【保研】软件系统设计/lxc资料/**/*"
   ```
4. **List found resources** with clear categorization
5. **Read or analyze** the requested files using the Read tool

## Important Notes

- **Dual resource system**: In-course `复习资料/` for quick access, cross-course `复习资料/【保研】xxx/` for comprehensive review
- **Instructor diversity**: Comparing different instructors' materials helps understand concepts from multiple perspectives
- **Senior notes value**: `笔记/` directory contains distilled knowledge from students who already passed the course
- **Practical exam focus**: `机试/` directories are critical for hands-on coding test preparation

## Example Prompts That Trigger This Skill

- "帮我找软件系统设计的复习资料"
- "我想看pmx老师的课件"
- "软件系统设计的往年题有哪些?"
- "帮我准备软件系统设计的机试"
- "对比不同老师讲设计模式的方式"
- "学长的软件系统设计笔记在哪里?"
