# LAX Small Multiples Workshop

SM6351 Information Visualization 的英文交互教学网站，使用 D3.js 和洛杉矶国际机场（LAX）真实月度客流数据，讲解如何构建与交互小多图（Small Multiples）。学习路径为 **Demo → Build → Interact → Practice**。

项目采用原生 HTML、CSS 和 JavaScript，无需安装前端依赖或执行构建。D3 与 CSV 数据均保存在仓库中。

## 快速开始

### 本地运行

在项目根目录执行（需已安装 Python 3）：

```bash
python3 -m http.server 8000
```

打开 [教学网站](http://localhost:8000/) 或 [课堂练习](http://localhost:8000/exercises/)。也可以在 VS Code 中使用 Live Server 打开 `index.html`。

源码页面通过 HTTP 加载 CSV，请通过本地服务访问。启动后，图表和教学内容使用本地资源，无需连接外网。

### 单文件预览

双击 [PREVIEW.html](PREVIEW.html) 可离线查看主站预览，所需样式、脚本、D3 和数据已内嵌。

`PREVIEW.html` 是独立快照，修改 `index.html`、`style.css` 或 `js/` 后不会自动同步到它。开发与课堂练习请使用本地服务运行源码。

## 教学内容

| 页签 | 内容 |
| --- | --- |
| Demo | 完整的小多图，支持年份、进出港、客流类别、坐标轴模式、排序及月份联动 |
| Build | CSV 解析、分组、月份对齐、共享坐标轴、逐面板绘图，以及叠加图与小多图的对比 |
| Interact | 通过实时示例讲解选择 → 状态 → 数据处理 → 更新图表的交互链路 |
| Practice | 两道代码练习、提示、参考答案及独立练习页 |

Build 和 Interact 中的代码为带上下文的关键片段，完整实现见对应源文件。

## 课堂练习

通过本地服务打开 [exercises/index.html](exercises/index.html)，修改 [exercises/exercise.js](exercises/exercise.js) 中的两个 TODO：

1. `chooseScale(selected)`：让所选值控制共享或独立纵轴。
2. `chooseTraffic(selected)`：让所选值控制国内或国际客流筛选。

初始代码固定返回 `shared` 和 `Both`，因此这两个选择控件暂时不会改变图表；这是练习的预期起点。

保存后刷新页面，检查纵轴上限、线条类别、已应用状态和已报告总量是否随选择更新。练习使用快照中最新完整报告年（当前为 2022 年）。

参考答案见 [exercises/reference-answers.js](exercises/reference-answers.js)，该文件不会自动加载。页面不提供在线代码编辑器或自动评分。

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

工作流直接打包静态资源，无需安装依赖。发布内容包括首页、单文件预览、样式、脚本、数据、练习页与本地 D3。

部署成功后的访问地址：

- [教学网站](https://guihuala.github.io/SM6351_Pre/)
- [课堂练习](https://guihuala.github.io/SM6351_Pre/exercises/)

以工作流中 `github-pages` 环境显示的实际发布地址为准。

## 项目结构

```text
.github/workflows/deploy-pages.yml  GitHub Pages 自动部署
index.html                        教学主页面
PREVIEW.html                      内嵌资源的独立预览快照
style.css                         页面样式与响应式布局
js/
  lax-config.js                   标签、颜色、顺序与数据路径
  lax-data.js                     CSV 加载、校验、筛选与聚合
  lax-charts.js                   坐标轴、折线、月份联动与表格
  lax-tabs.js                     页签、键盘与历史导航
  main.js                         状态、控件事件与初始化
exercises/                        独立练习页、TODO 与参考答案
data/                             CSV、来源记录与快照统计
vendor/d3.v7.min.js                本地 D3 库
screenshots/                      早期版本截图，供历史对照
START_HERE.txt                    预览包交接说明
VALIDATION.md                     早期版本运行检查记录
```

修改页面内容请编辑 `index.html`，修改视觉样式请编辑 `style.css`，修改数据处理与交互请编辑 `js/` 下的对应文件。

## 验证记录

[VALIDATION.md](VALIDATION.md) 保留了 2026-10-27 的运行检查记录；`screenshots/` 为早期视觉版本截图。它们不能代表当前简约预览版已完成全部浏览器交互与手机布局验收。预览包状态与待验证事项见 [START_HERE.txt](START_HERE.txt)。
