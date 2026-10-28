# LAX Small Multiples Workshop

SM6351 Information Visualization 的英文交互教学网站，使用 D3.js 和洛杉矶国际机场（LAX）真实月度客流数据，讲解如何构建与交互小多图（Small Multiples）。学习路径为 **Data → Charts → Code → Workspace → Files**。旧链接 `#demo`、`#build`、`#interact` 仍可打开对应的新页面。

项目采用原生 HTML、CSS 和 JavaScript，无需安装前端依赖。D3 与 CSV 数据随完整工程保存在仓库中的 `SM6351_Pre_latest.zip` 内。页面以英文为主，右上角可显示或隐藏中文。

## 快速开始

### 本地运行

先下载并解压 [SM6351_Pre_latest.zip](SM6351_Pre_latest.zip)，将内容放入项目根目录。工程包含当前的多文件源码、数据、字体、未完成练习包和正常的 Pages 工作流。解压时会用当前工程替换根目录的单文件预览首页。

然后在项目根目录执行（需已安装 Python 3）：

```bash
python3 -m http.server 8000
```

打开 [教学网站](http://localhost:8000/) 或 [课堂练习](http://localhost:8000/learn/index.html)。也可以在 VS Code 中使用 Live Server 打开 `index.html`。

源码页面通过 HTTP 加载 CSV，请通过本地服务访问。启动后，图表和教学内容使用本地资源，无需连接外网。

### 单文件预览

双击 [PREVIEW.html](PREVIEW.html) 可离线查看主站预览，所需样式、脚本、D3 和数据已内嵌。

`PREVIEW.html` 是独立快照。解压后的工程另有 `downloads/lax-workspace.html`；修改 `index.html`、`app.css` 或 `app/` 后，可运行 `python scripts/make-offline.py` 重新生成单文件版。开发与课堂练习请使用本地服务运行源码。

## 教学内容

| 页签 | 内容 |
| --- | --- |
| Data | 原始记录、月度汇总，以及相同数据下叠加图与小多图的对比 |
| Charts | 各航站楼小多图，支持年份、进出港、客流类别、坐标轴模式、排序及年月联动 |
| Code | 五段关键 D3 片段与运行示例：读取、分组、月份对齐、坐标轴、折线和控件 |
| Workspace | 两道可编辑代码练习、分步提示、短答案、运行结果和独立练习页 |
| Files | 数据字段、缺失记录说明和未完成练习包 |

Code 保留了读取 CSV、分组、月份对齐、共享坐标轴和逐面板绘图的说明。控件示例继续展示“选择 → 状态 → 数据处理 → 更新图表”的交互链路。网页只展示带上下文的关键片段，完整实现见解压后的对应源文件。

## 课堂练习

解压完整工程后，通过本地服务打开 `learn/index.html`，修改 `learn/choices.js` 中的两个 TODO：

1. `peakMonths(values, key)`：返回每张图达到最高客流的所有月份。
2. `orderPanels(panels, mode)`：选择 Volume 时，按已报告全年合计从高到低排列图表。

初始代码返回空的峰值数组，并保留航站楼原顺序；这是练习的预期起点。练习使用快照中最新完整报告年（2022 年）的四个航站楼国内客流。

保存后刷新本地练习页面，检查四张图是否出现峰值月份，以及 Volume 顺序是否变为 T2 → T1 → T6 → TBIT。切回 Terminal order 后应恢复 T1 → T2 → T6 → TBIT。标注和排序不改变客流数字。

主站 Workspace 提供两处短编辑区，点击 Run code 可运行并检查结果；“View & apply answer” 会填入当前题目的答案并自动运行，保留另一题的内容。展示者参考答案为解压后的 `learn/answers.js`，该文件不会被课堂页面自动加载。发给同学的 `downloads/lax-workshop-student.zip` 不包含答案文件。

## 数据说明

数据集为 Los Angeles Open Data 的 **Los Angeles International Airport — Passenger Traffic By Terminal**。来源链接、获取方式与类别列表见 [data/provenance.json](data/provenance.json)，快照统计见 [data/preview-validation.json](data/preview-validation.json)。

| 项目 | 当前快照 |
| --- | --- |
| 获取日期 | 2026-10-27 |
| 报告范围 | 2006-01 至 2023-10 |
| 原始记录 | 7,883 条 |
| 航站楼类别 | 12 类 |
| 重复统计组合 | 0 |

解读图表时请注意：

- 客流表示旅客流动人次，包含到达与出发，不能视为去重人数。
- 2023 年只有 1–10 月，不能直接与完整年份比较全年总量。
- 缺失月份保留空缺；`*` 表示预期组成项不全的部分小计。
- TBIT 与 TBIT West Gates 保持为独立类别。
- 共享纵轴适合比较绝对量，独立纵轴适合观察各面板内部趋势；独立纵轴下的线条高度不能直接跨面板比较。
- 按已报告总量排序不代表运力排名，流量变化本身也不能证明因果关系。

## GitHub Pages 部署

工作流位于 [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)，推送到 `main` 时自动运行，也支持手动触发。

首次部署：

1. 在 GitHub 仓库的 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。
2. 将工作流与项目文件提交并推送到 `main`。
3. 在 **Actions → Deploy to GitHub Pages** 查看结果；也可以选择 **Run workflow** 手动部署。

网页上传版先将 `SM6351_Pre_latest.zip` 解压到 `_site`，运行 260 项数据与练习检查，再发布当前首页、样式、脚本、数据、字体、练习页、学生 ZIP 与本地 D3。无需安装前端依赖。测试、脚本、备课文档和展示者答案不放入发布目录。

完整工程 ZIP 内也保留了普通的多文件发布工作流。之后在本地将工程解压到仓库根目录并提交全部源码时，该工作流会直接发布当前多文件工程。

部署成功后的访问地址：

- [教学网站](https://guihuala.github.io/SM6351_Pre/)
- [课堂练习](https://guihuala.github.io/SM6351_Pre/learn/index.html)

以工作流中 `github-pages` 环境显示的实际发布地址为准。

## 项目结构

仓库根目录的网页上传版：

```text
.github/workflows/deploy-pages.yml  解压当前工程、检查并自动部署
index.html                        当前内嵌资源首页
PREVIEW.html                      当前内嵌资源预览
SM6351_Pre_latest.zip              当前完整可编辑工程
README.md                         项目说明
```

解压完整工程后的主要文件：

```text
index.html / app.css               页面内容、样式与响应式布局
app/
  data.js                         CSV 加载、校验、筛选与聚合
  chart.js                        坐标轴、折线、月份联动与峰值
  main.js                         页签、状态、控件事件与初始化
  lessons.js / steps.js            关键代码片段与运行示例
  practice.js                     两处编辑区、运行、检查与导出
learn/                            独立练习页、TODO 与展示者答案
steps/                            五个运行示例
data/                             CSV 与来源记录
vendor/d3.v7.min.js                本地 D3 库
fonts/                            Nunito 字体与许可证
downloads/                        当前单文件网页与学生练习 ZIP
tests/verify-data.cjs              260 项数据和练习检查
scripts/make-offline.py            重新生成单文件版
```

修改页面内容请编辑解压后的 `index.html`，修改视觉样式请编辑 `app.css`，修改数据处理与交互请编辑 `app/` 下的对应文件。仓库中的早期 `js/`、`exercises/`、`style.css`、`screenshots/` 和交接说明保留供对照，不是当前工作流的发布来源。

## 验证记录

[VALIDATION.md](VALIDATION.md) 保留了 2026-10-27 的运行检查记录；`screenshots/` 为早期视觉版本截图。它们不能代表当前简约预览版已完成全部浏览器交互与手机布局验收。预览包状态与待验证事项见 [START_HERE.txt](START_HERE.txt)。


当前工程另有 `tests/verify-data.cjs`：260 项检查已通过，覆盖源数据合计、缺失值、真实零值、并列峰值和排序恢复。以上检查不等同于所有手机布局均已验收。
