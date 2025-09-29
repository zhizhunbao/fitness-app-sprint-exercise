# FitLife Sprint Planning Dashboard

一个现代化的 Sprint Planning 静态页面项目，为 FitLife 健身管理应用的敏捷开发规划而设计。

## 项目概述

本项目为 Algonquin College 的 Sprint Planning 课堂练习创建了一个完整的演示页面，包含：

- 📊 **用户故事管理** - 5个详细的用户故事及其子任务分解
- 👥 **团队分工** - 4名团队成员的角色分配和技能展示
- 📈 **容量规划** - 可视化的容量对比承诺工作量
- 📋 **任务看板** - Todo/In Progress/Done 三栏看板展示
- 🏊 **泳道图** - Mermaid 渲染的团队任务分配流程图
- 🎯 **交付物管理** - 功能性、文档性、流程性三类交付物
- 🌐 **国际化支持** - 中英文双语切换

## 项目结构

```
fitness-app-sprint-exercise-v2/
├── src/                          # 源代码目录
│   ├── index.html               # 主页面入口
│   ├── main.js                  # 应用主逻辑
│   ├── styles/                  # 样式文件
│   │   └── main.css            # 主样式文件
│   └── data/                   # 数据文件
│       ├── sprint_data.json    # Sprint 数据
│       └── i18n.json          # 国际化配置
├── docs/                        # 文档目录
│   ├── fitlife_sprint_planning.md
│   └── sprint_planning_class_exercise.doc
└── README.md                    # 项目说明
```

## 功能特性

### 🎨 现代化设计
- 响应式布局，支持移动端访问
- 渐变背景和卡片式设计
- 动画效果和交互反馈
- 专业的表格和图表展示

### 📊 数据驱动
- JSON 文件驱动的内容渲染
- 动态计算团队分工和容量规划
- 自动生成任务分配表格

### 🌍 国际化
- 英文为主，中文为辅
- 实时语言切换
- 完整的双语支持

### 📈 可视化图表
- Mermaid 泳道图展示团队协作流程
- 容量规划进度条
- 彩色编码的优先级标识

## 快速开始

### 运行项目

1. 克隆或下载项目到本地
2. 使用本地服务器运行（推荐）：

```bash
# 使用 Python
cd src
python -m http.server 8000

# 使用 Node.js
cd src
npx http-server

# 使用 Live Server (VS Code 扩展)
# 右键点击 src/index.html -> "Open with Live Server"
```

3. 在浏览器中访问 `http://localhost:8000`

### 数据修改

- 修改 `src/data/sprint_data.json` 来更新 Sprint 数据
- 修改 `src/data/i18n.json` 来调整多语言内容
- 页面会自动重新渲染更新的数据

## 团队信息

### 团队成员角色分配

- **Travis** - Product Manager & Scrum Master
  - 负责产品策略、用户研究、Sprint 规划、利益相关者管理

- **Lainne** - Frontend Developer & UX Designer  
  - 负责 React、Vue.js、UI/UX 设计、移动端开发

- **Hunt** - Backend Developer & DevOps Engineer
  - 负责 Node.js、Python、数据库设计、API 开发、云基础设施

- **Frank** - Full-Stack Developer & QA Engineer
  - 负责 JavaScript、测试自动化、代码审查、系统集成、质量保证

## Sprint 规划详情

### Sprint 目标
开发用户仪表板和目标设置模块，为 FitLife 健身应用建立核心的用户交互基础。

### 时间安排
- **Sprint 持续时间**: 2周 (10个工作日)
- **总容量**: 320小时 (4人 × 2周 × 40小时/周)
- **已承诺工作**: 252小时
- **缓冲时间**: 20% (68小时)

### 故事点统计
- **P1 高优先级**: 42 故事点 (US1: 8, US2: 13, US3: 21)
- **P2 中优先级**: 13 故事点 (US4: 13)
- **P3 低优先级**: 8 故事点 (US5: 8)
- **总计**: 63 故事点

## 技术实现

### 前端技术栈
- **HTML5** - 语义化标记
- **CSS3** - 现代样式和动画
- **Vanilla JavaScript** - 无框架依赖
- **Mermaid.js** - 图表渲染

### 架构设计
- 模块化的 JavaScript 代码结构
- 数据与视图分离
- 事件驱动的交互逻辑
- 异步数据加载

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 许可证

MIT License - 详见 LICENSE 文件

---

**课堂演示提示**: 此项目专为 Sprint Planning 课堂练习设计，展示了完整的敏捷开发规划流程和最佳实践。 