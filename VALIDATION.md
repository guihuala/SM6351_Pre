# Vintage Airline Guide · 运行检查

日期：2026-10-27。验证方式：本机 HTTP 服务 + Codex 浏览器实际操作。未新增测试框架。

## 检查结果

- 主网站成功加载本地 CSV 与 D3，生成 12 个航站楼面板。
- Domestic / International / Both / Total 分段控件连接现有状态、聚合和绘图逻辑；International 实际显示橙色虚线，图例同步。
- Shared / Independent 点击和键盘方向键切换均更新轴模式与说明。
- 年份起点选择 2023 时终点跟随调整为 2023，范围实际显示 Jan–Oct、10 个月。
- 月份滑块使用 Home、ArrowRight 后显示 Feb 2018，联动数值更新。
- Reset 恢复默认年份、客流、尺度和排序；月份沿用仍处于范围内的选中月份（保留原有行为）。
- Build 的 One chart / Small multiples 切换分别生成 1 / 6 个 SVG。
- Interact 实际操作可更新 choice、state、transform、redraw 四段说明与两张图。无记录类别显示明确空态，不画零线。
- Practice 可展开参考答案；练习按钮切到 Demo 并设置 2022、Total、Shared、Volume 排序。
- 独立练习页正常加载图表；选择 Independent / International 时仍保持 shared / Both 的已应用状态，符合未完成 TODO 的教学机制。没有改写学生练习答案。
- 主页面及练习页浏览器未报告 JavaScript 错误。
- JavaScript 语法检查通过；HTML 无重复 ID、本地引用无缺失，main.js 使用的固定 ID 均存在。
- 1440px 宽屏及 390px 手机宽度实际查看；390px 下 Demo 与 Build 的页面宽度与内容宽度相同，无整体水平溢出。代码块单独允许横向滚动。

## 截图

截图由浏览器直接生成，未制作效果合成图。

| 文件 | 视图 |
| --- | --- |
| `screenshots/01-demo.png` | 完成版 Demo 首屏 |
| `screenshots/02-build.png` | 解释、代码与结果的宽屏排版 |
| `screenshots/03-interact.png` | 真实数据联动与状态链 |
| `screenshots/04-practice.png` | 两张编号任务卡 |
| `screenshots/05-exercise.png` | 保留 TODO 的独立练习页 |
| `screenshots/06-demo-mobile.png` | 390px 窄屏布局 |

## 限制

- 未在所有浏览器和操作系统上检查；系统字体存在回退差异。
- 未将练习 TODO 临时改为答案；本轮检查的是原有练习机制不被视觉改版破坏。
- 当前项目中未找到 TEAM-PLAN.md，已检查现有 README、课程 AGENTS.md、页面与脚本；未擅自恢复已缺失文件。
