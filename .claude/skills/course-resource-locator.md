---
name: course-resource-locator
description: Intelligent resource locator for all third-year courses using the dual resource system
trigger: Use when user asks for course materials, review resources, or needs to locate specific documents across the repository
userInvocable: true
---

# Course Resource Locator

Universal resource finder for all third-year computer science courses in this repository.

## 🎯 Purpose

Helps you quickly locate course materials using the **dual resource system**:
- **Level 1**: Course-local resources (`[课程名]/复习资料/`, `[课程名]/旧课件/`)
- **Level 2**: Cross-course resources (`复习资料/【保研】[课程名]/`)

## 📚 Supported Courses

1. **软件系统设计** (Software System Design) ⭐ - Has full dual system
2. **软件工程与计算III** (Software Engineering III) - Has cross-course resources
3. **软件质量与管理** (Software Quality Management) - Has cross-course resources
4. **Linux 系统编程** (Linux System Programming)
5. **云计算** (Cloud Computing)
6. **数据集成** (Data Integration)

⭐ = Course with in-course review materials (`复习资料/` subdirectory)

## 🔍 Resource Types

### 课件 (Course Slides)
- **Current**: `[课程名]/课件/`
- **Historical**: `[课程名]/旧课件/[instructor]/`
- **Consolidated**: `复习资料/【保研】[课程名]/PPT/`

### 作业 (Homework)
- **Course-local**: `[课程名]/作业/`
- **Past homework**: `[课程名]/复习资料/作业/` (if available)
- **Consolidated**: `复习资料/【保研】[课程名]/Assignments/`

### 复习资料 (Review Materials)
**For courses with in-course review** (e.g., 软件系统设计):
- **笔记**: `[课程名]/复习资料/笔记/` - Senior students' lecture notes
- **机试**: `[课程名]/复习资料/机试/` - Past practical exams
- **往年题**: `[课程名]/复习资料/往年题/` - Past written exams
- **作业**: `[课程名]/复习资料/作业/` - Past homework

**Cross-course comprehensive review**:
- `复习资料/【保研】[课程名]/lxc资料/` - Li Xuecheng's materials
- `复习资料/【保研】[课程名]/yhgg资料/` - yhgg's materials
- `复习资料/【保研】[课程名]/zhy复习资料/` - Zhao Haoyu's materials

### 旧课件 (Historical Course Materials)
- **Purpose**: Compare teaching styles and perspectives from different instructors
- **Location**: `[课程名]/旧课件/`
- **Instructor-specific**: `[课程名]/旧课件/[instructor_name]/`
  - Known instructors: pmx (for 软件系统设计)

## 🤖 Automated Search Logic

### Step 1: Parse User Request
Identify:
- **Course name** (软件系统设计, 软工三, etc.)
- **Resource type** (课件, 作业, 机试, 笔记, etc.)
- **Instructor preference** (if mentioned: pmx, etc.)
- **Senior student preference** (if mentioned: lxc, yhgg, zhy)
- **Context** (exam prep, homework, daily study)

### Step 2: Determine Search Locations
Apply this decision tree:

```
IF 课件 requested:
  IF instructor specified → [课程]/旧课件/[instructor]/
  ELSE → [课程]/课件/ (current first)

IF 复习资料 requested:
  IF exam prep context → Both Level 1 and Level 2
  IF specific senior requested → 复习资料/【保研】[课程]/[senior]资料/
  ELSE → [课程]/复习资料/ (if exists)

IF 作业 requested:
  → [课程]/作业/ (current assignments)
  → [课程]/复习资料/作业/ (past, if available)
  → 复习资料/【保研】[课程]/Assignments/ (consolidated)

IF 机试 requested:
  → [课程]/复习资料/机试/ (if available)
  → 复习资料/【保研】[课程]/机试/ (consolidated)

IF 往年题 requested:
  → [课程]/复习资料/往年题/ (if available)
  → 复习资料/【保研】[课程]/ (look for exam-related files)

IF 笔记 requested:
  → [课程]/复习资料/笔记/ (if available)
  → 复习资料/【保研】[课程]/[senior]资料/ (senior-specific)
```

### Step 3: Execute Search
Use Glob tool with appropriate patterns:
```
# Current slides
"[课程名]/课件/**/*.pdf"

# PMX instructor materials
"软件系统设计/旧课件/pmx/**/*.pdf"

# All historical materials
"[课程名]/旧课件/**/*"

# In-course review materials
"[课程名]/复习资料/[类型]/**/*"

# Cross-course senior materials
"复习资料/【保研】[课程名]/[senior]资料/**/*"

# All practical exams
"软件系统设计/复习资料/机试/**/*"
"复习资料/【保研】软件系统设计/机试/**/*"
```

### Step 4: Present Results
Group results by:
1. **Resource type** (课件/作业/复习资料)
2. **Location** (Level 1 vs Level 2)
3. **Source** (current semester / instructor / senior student)

## 💡 Smart Recommendations

Based on user context, proactively suggest:

### For "帮我准备考试"
→ Recommend checking **both**:
- `[课程]/复习资料/往年题/` for past exams
- `[课程]/复习资料/笔记/` for key points
- `复习资料/【保研】[课程]/lxc资料/` for comprehensive review

### For "我要做作业"
→ Recommend:
- `[课程]/课件/` to understand current requirements
- `[课程]/复习资料/作业/` for reference (if available)
- **Warning**: Reference for learning approach, not for copying

### For "对比不同老师的教学"
→ Recommend:
- `[课程]/课件/` (current instructor)
- `[课程]/旧课件/` (past instructors)

### For "机试准备"
→ Recommend:
- `[课程]/复习资料/机试/` for recent exams
- `复习资料/【保研】[课程]/机试/` for comprehensive collection
- `复习资料/【保研】[课程]/Assignments/` for code examples

## 📊 Output Format

When presenting found resources, use this format:

```markdown
## 找到以下资源:

### 📍 当前课程资料 ([课程名]/)
- [资源1路径] - [类型说明]
- [资源2路径] - [类型说明]

### 📚 复习资料 ([课程名]/复习资料/)
- **笔记**: [X个文件]
- **机试**: [X个文件]
- **往年题**: [X个文件]
- **作业**: [X个文件]

### 🎓 保研综合资料 (复习资料/【保研】[课程名]/)
- **lxc资料**: [X个文件]
- **yhgg资料**: [X个文件]
- **zhy复习资料**: [X个文件]

### 💡 推荐使用策略:
[根据用户需求给出具体建议]
```

## ⚠️ Important Notes

1. **Respect hierarchy**: Level 1 (course-local) is for immediate needs; Level 2 (cross-course) is for comprehensive review
2. **Academic integrity**: Always remind users to understand and adapt materials, not copy directly
3. **Version awareness**: Materials from different instructors/years may have different content focus
4. **Senior attribution**: Always attribute materials to specific seniors (lxc/yhgg/zhy) when presenting

## 🔗 Integration with Other Skills

- **ssd-resource-navigator**: Specialized version for Software System Design course only
- **ragas-code-analyzer**: Use for Software Engineering III technical analysis
- Use this general skill when user's request spans multiple courses or is not course-specific

---

*本技能支持所有第三学年课程的智能资源定位*
