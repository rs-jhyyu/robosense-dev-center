---
title: 简介
sidebar_position: 1
---
# 简介

`rslidar_sdk` 是 RoboSense 为 Ubuntu 环境开发的激光雷达驱动软件包。它是将 RoboSense 激光雷达集成到机器人软件栈中的推荐方式。

该软件包包含：

* 驱动内核：**rs_driver**
* ROS 扩展功能（支持 Ubuntu 16.04、Ubuntu 18.04、Ubuntu 20.04）
* ROS2 扩展功能（支持 Ubuntu 18.04、Ubuntu 20.04、Ubuntu 22.04）

当前 GitHub 仓库中的 SDK 和驱动版本仅支持 **表 1.1** 中列出的激光雷达产品。若需将 SDK 用于 **表 1.2** 中的其他激光雷达产品，请联系 RoboSense 技术支持以获取相应版本的软件包。

---

## 支持的激光雷达型号

### 表 1.1 —— GitHub 中的 SDK 支持的激光雷达型号

| 机械式 / 通用型 | MEMS / 固态 |
| --- | --- |
| RS-LiDAR-16 | RS-Ruby-80 |
| RS-LiDAR-32 | RS-Ruby-Plus-128 |
| RS-Bpearl | RS-Ruby-Plus-80 |
| RS-Helios | RS-Ruby-Plus-48 |
| RS-Helios-16P | RS-LiDAR-M1 |
| RS-Ruby-128 | RS-LiDAR-M2 |
| RS-LiDAR-E1 | RS-LiDAR-M3 |
| RS-LiDAR-Airy | RS-LiDAR-MX |
| RS-LiDAR-Fairy | RS-LiDAR-EMX |

### 表 1.2 —— 额外支持的激光雷达型号

| 型号 | 型号 |
| --- | --- |
| RS-LiDAR-EM4 | RS-LiDAR-AiryLite |
| RS-LiDAR-E1R | |

---

## 架构概览

`rslidar_sdk` 构建于核心驱动 `rs_driver` 之上：

* **rs_driver** —— 解码内核。它接收来自激光雷达的 MSOP/DIFOP/IMU 数据包（在线）或 PCAP 文件（离线），将其解码为点云，并通过回调函数暴露数据。它可以作为独立的 C++ 库使用，也可以作为子模块使用。
* **rslidar_sdk** —— 对 `rs_driver` 进行封装，提供 ROS / ROS2 集成、基于 YAML 的配置接口，以及开箱即用的 launch 文件。

请根据你的使用场景选择合适的层级：

* 当你在 ROS / ROS2 生态系统中工作并希望将点云作为话题发布时，使用 **rslidar_sdk**。
* 当你需要轻量、无 ROS 依赖的 C++ 集成，或需要随附的命令行工具（`rs_driver_viewer`、`rs_driver_pcdsaver`）时，直接使用 **rs_driver**。
* 当你无需编写任何代码、只想快速可视化点云时，使用 **RSView**。
