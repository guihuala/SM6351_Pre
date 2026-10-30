# LAX Small Multiples Workshop

SM6351 信息可视化课程项目，使用 D3.js 展示 LAX 各航站楼月度客流。包含 Data、Charts、Code 和 Workspace 四个页签，支持显示中文。

## 访问与下载

- [教学网站](https://guihuala.github.io/SM6351_Pre/)
- [课堂练习](https://guihuala.github.io/SM6351_Pre/learn/index.html)
- [离线预览](PREVIEW.html)：下载后双击打开。
- [完整工程](SM6351_Pre_latest.zip)：包含源码、数据和练习文件。

## 本地运行

解压完整工程后，在解压目录运行：

```bash
python3 -m http.server 8000
```

打开 [本地网站](http://localhost:8000/)。无需安装前端依赖。

## 数据与素材

数据来自 [Los Angeles Open Data](https://data.lacity.org/Transportation/Los-Angeles-International-Airport-Passenger-Traffi/g3qu-7q2u/about_data)，范围为 2006 年 1 月至 2023 年 10 月。客流为到达与出发人次，2023 年为不完整年度。

SVG 图标来自 [Lucide](https://lucide.dev)，许可证保存在 `assets/icons/LICENSE`。
