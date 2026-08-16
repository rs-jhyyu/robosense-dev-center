---
title: 简介
sidebar_position: 1
---

# 欢迎来到速腾开发者中心

本站汇总了速腾聚创激光雷达产品的上手指南、工具手册与开发参考。文档按使用场景组织，首次使用可以从上到下依次阅读，之后可直接跳转到需要的章节。

## 从哪里开始

如果你第一次使用速腾激光雷达，建议按以下顺序阅读：

1. [网络连接与 Wireshark 抓包](./network_and_wireshark.md) —— 完成雷达接线、配置主机 IP，并确认数据已正常到达。大部分「没有点云」的问题都在这一步解决。
2. [RSView 快速上手](../RSView/quick_start.md) —— 用上位机软件查看点云。
3. [Web 端配置指南](../Configuration Tools/web_configuration.md) —— 修改 IP、端口及其他雷达参数。

如果你的 AiryLite 使用 485/串口接口而非以太网，请参考 [AiryLite 485/串口版本使用指南](./airylite_485.md)。

## 文档导航

| 分类 | 内容 |
| --- | --- |
| **入门与连接** | 物理连接与网络配置、抓包、串口（485）连接 |
| **上位机与可视化** | 点云可视化、回放、交互操作、数据导出 |
| **雷达配置工具** | 雷达 Web 端、LidarAssistant（E / EM 平台）、M1P 小工具、工具下载 |
| **驱动与 SDK** | ROS / ROS2 驱动与 SDK 的编译、配置、运行与排障 |
| **开发接口** | 用于配置雷达与升级固件的 C++ 控制库 |
| **功能专题** | 时间同步、闰秒偏差、IMU 数据、FAST-LIO 建图 |

## 更多资源

- [手册/产品资料下载](https://www.robosense.cn/resources) —— 产品手册与规格书
- [ROS SDK & Driver](https://github.com/RoboSense-LiDAR/) —— 官方源码仓库

如果没有找到你需要的内容，请联系速腾聚创技术支持。
