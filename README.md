# Week 10 · LAX Small Multiples Workshop

SM6351 Information Visualization 的英文教学网站，主题为 **用 D3 实现 Interactive Small Multiples**。项目独立放在 `Presentations/`，不与 `Assignments/` 中的复刻作业混放。

本版采用复古航空旅行手册视觉：奶油白纸张、海军蓝印刷感标题、砖红章节标记与暖灰细线。无图片横幅，打开后直接看到研究问题、紧凑工具栏和完成版图表。教学顺序为：观察效果 → 逐步实现 → 加入交互 → 动手练习。适合两个人完成约 25 分钟课堂教学，不需要 slides。

## 打开方式

- 教学网站：[index.html](index.html)。
- 课堂练习：[exercises/index.html](exercises/index.html)。
- 当前检查时未找到 `TEAM-PLAN.md`；此次保留现有教学内容，不另行恢复可能已被移除的分工文件。

整个文件夹可以单独分享。D3、数据、脚本和样式均在项目内，教学与图表无需联网；外部数据来源链接需要联网。已移除外部照片及其署名，不再有图片网络依赖。

## GitHub Pages 自动部署

工作流位于 [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)。推送到 `main` 时自动部署，也可在 GitHub 的 Actions 页面选择 **Deploy to GitHub Pages → Run workflow** 手动运行。

首次使用时，在仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**，然后推送工作流。项目是纯静态网站，无需安装依赖或构建；工作流会发布首页、独立预览页、样式、脚本、数据、练习页及本地 D3。

当前仓库部署成功后的地址为：https://guihuala.github.io/SM6351_Pre/ 。练习页位于该地址下的 `exercises/`。实际发布地址也会显示在工作流的 `github-pages` 部署环境中。

## 页签

| 页签 | 教学内容 | 课堂用途 |
| --- | --- | --- |
| Demo | 研究问题、紧凑分段控件和完整交互图表，详细说明移至图表下方 | 先展示同学最终要得到的效果 |
| Build | CSV 解析、分组、月份对齐、共同坐标轴、逐面板绘图；叠加图与小多图对比 | 讲清静态小多图如何实现 |
| Interact | 两个航站楼的实时示例、选择→状态→处理→更新链、关键代码；同步月份作为进阶内容 | 说明事件如何影响数据与图表 |
| Practice | 两个代码练习、提示、可展开答案、预期结果和可运行练习页 | 让同学修改代码并解释变化 |

## 分步实现说明

Build 和 Interact 中的代码是**带上下文的关键片段**，不是可单独运行的完整程序。
每一步都链接到对应源文件，说明作用、前提和预期结果。

1. `lax-data.js`：读取 CSV，解析 UTC 月份和数值，排除无效记录并处理重复统计组合。
2. 筛选年份和到达／出发后，使用 `d3.group` 按航站楼、月时间戳和国内／国际分类。
3. 按共同月份序列生成面板，求和存在的记录，保留 `null`、实际组成数量与预期组成数量。
4. `lax-charts.js`：建立共同时间轴与共享纵轴，重复创建每个航站楼的 SVG。
5. 使用 `d3.line().defined(...)` 保留缺失月份的断线。
6. `main.js`：控件更新 state，经 aggregate → draw → 月份恢复，更新图表、数值表及动态发现。

## 课堂练习

练习单独使用 `exercises/index.html`，不会破坏 Demo 完成版。

- 学生只修改 `exercises/exercise.js` 中的两个 TODO 返回值。
- TODO 1：让 `chooseScale(selected)` 把选择传给纵轴模式。
- TODO 2：让 `chooseTraffic(selected)` 把选择传给客流筛选。
- 初始状态的两个函数固定返回 shared 和 Both，因此选择控件有意不生效；这是练习起点，不是完成版缺陷。
- 修改后保存并刷新练习页，观察纵轴上限、线条类别、已应用状态和已报告总量。
- 页面不提供在线代码编辑器或自动评分。Practice 中有人工判断的成功条件和可展开参考答案；`reference-answers.js` 仅供复制，不被自动加载。
- 练习复用完成版数据处理和绘图函数；课堂重点是贯通控件、状态、聚合和绘图。D3 内部的具体实现由 Build / Interact 讲解。

## 数据与功能

来源：[Los Angeles Open Data · Passenger Traffic by Terminal](https://data.lacity.org/Transportation/Los-Angeles-International-Airport-Passenger-Traffi/g3qu-7q2u/about_data)。

- 下载日期 2026-10-27；实际报告范围 2006-01 至 2023-10。
- 7,883 条原始记录，12 个航站楼类别；当前快照未发现重复统计组合。
- 默认 Demo 为 2018–2022；练习固定到快照最新完整报告年 2022。
- 一条记录为月份 × 航站楼 × 到达／出发 × 国内／国际，附客流和提取时间。
- 客流是流动人次，不是独立人数。缺失不补零，部分总量以 `*` 标记。完整报告年不保证每个类别都完整。
- TBIT 和 TBIT West Gates 保持独立。排序按已报告总量，不代表运力。
- 保留时间筛选、预设、统一／独立纵轴、排序、同步悬停、键盘月份滑块及数值表。
- 不通过流量变化单独推断因果。快照来源记录见 [data/provenance.json](data/provenance.json)。

## 文件结构

| 文件 | 职责 |
| --- | --- |
| `index.html` | 四个教学页签、实现片段、提示与答案 |
| `style.css` | 统一复古手册主题变量、导航、代码排版与响应式布局 |
| `js/lax-tabs.js` | 页签、键盘及历史导航 |
| `js/lax-config.js` | 标签、颜色与顺序 |
| `js/lax-data.js` | 数据加载和聚合 |
| `js/lax-charts.js` | 图表、月份联动和表格 |
| `js/main.js` | 完成版状态、预设、筛选和初始化 |
| `exercises/index.html` | 单独的可运行练习页 |
| `exercises/exercise.js` | 两个 TODO 及已完成的支撑代码 |
| `exercises/reference-answers.js` | 两个函数的参考答案 |
| `data/` | CSV 快照与来源记录 |
| `vendor/d3.v7.min.js` | 本地 D3 |
| `screenshots/` | Demo、Build、Interact、Practice、练习页及窄屏实机截图 |
| `VALIDATION.md` | 本轮运行检查、范围与截图说明 |

## 视觉与交互规范

- 主题变量集中在 `style.css`：纸张 `#F6F0E3`、内容 `#FFFCF5`、海军蓝 `#193B4A`、砖红 `#B64B3C`、正文 `#2C3032`、边线 `#CDBFA7`。
- 不使用外部字体或纹理。标题使用 Arial Narrow / Avenir Next Condensed 等系统字体栈，正文使用系统无衬线字体，编号与代码使用系统等宽字体。不同系统会有字体回退差异。
- 国内客流仍为 `#2463A0` 蓝实线，国际为 `#AF501E` 橙虚线；Demo、实时示例、练习页与图例保持一致。Total 保留为额外合计选项。
- Demo 的 traffic / scale 从下拉框改为原生 radio 分段组，支持 Tab 与方向键；其他筛选保留下拉框。原有预设在图表下方折叠区域中。
- 航站楼卡片使用原始 T1–T8、TBIT 及显示简称 WEST、IMP、MISC，同时保留完整名称。简称不改变分组或数据。
- Build / Interact 步骤宽屏左右排版，窄屏按解释→代码→结果排列；Practice 使用两张编号任务卡，参考答案仍默认收起。
- 独立练习页继续保留两个固定返回值 TODO；未将其自动改为完成版。

## 本轮验证与截图

按本轮明确要求进行了实际浏览器操作、JavaScript 语法检查和本地引用检查。记录见 [VALIDATION.md](VALIDATION.md)。

- [Demo](screenshots/01-demo.png)
- [Build](screenshots/02-build.png)
- [Interact](screenshots/03-interact.png)
- [Practice](screenshots/04-practice.png)
- [独立练习页](screenshots/05-exercise.png)
- [手机宽度 Demo](screenshots/06-demo-mobile.png)

通过本地 Web Server 打开本项目，避免直接使用 file:// 加载 CSV。所有功能使用项目内 D3 与数据，网络不是图表运行的前提。
