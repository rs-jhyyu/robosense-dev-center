---
title: 点云录制为 PCD
sidebar_position: 5
---

# 点云录制为 PCD

本文介绍如何录制 ROS 的点云 topic，并保存为 `.pcd` 格式以便后续处理。

需要其他导出方式？导出 PCD/CSV 请参考 [进阶操作](./advanced_operations.md)，抓取原始 `.pcap` 数据包请参考 [网络连接与 Wireshark 抓包](../Getting Started/network_and_wireshark.md)，驱动自带的 `rs_driver_pcdsaver` 工具请参考 [rs_driver 使用指南](../rslidar_sdk & rs_driver/rs_driver_user_guide.md)。

## 第一步：获取点云的 topic 名称

在 Rviz 中点击左栏的 topic 获取点云 topic 名称，也可以通过 `rostopic list` 指令列出当前所有 topic，从中找到需要录制的 topic。

<figure className="doc-figure">
  <img src={require('./images/recording/image_1.png').default} alt="Rviz 左栏显示点云 topic 名称" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 1：在 Rviz 中获取点云 topic 名称</figcaption>
</figure>

## 第二步：创建或进入用于保存点云文件的目录

使用 `cd` 命令进入用于保存点云文件的目录，或在目标文件夹中右键打开终端。

`rosbag` 与 `rosrun pcl_ros pointcloud_to_pcd input:=<topic>` 指令默认的保存路径为运行该命令终端的当前路径。

## 第三步：录制点云

### 方法一：直接录制为 PCD

使用以下指令将点云录制为 PCD 格式：

```bash
rosrun pcl_ros pointcloud_to_pcd input:=<topic>
```

以第一步获取到的 topic 为例：

```bash
rosrun pcl_ros pointcloud_to_pcd input:=/bp_points3
```

<figure className="doc-figure">
  <img src={require('./images/recording/image.png').default} alt="终端运行 pointcloud_to_pcd 并写出 PCD 文件" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 2：录制点云为 PCD 文件</figcaption>
</figure>

输入指令回车后开始录制，按 `Ctrl+C` 终止录制即可保存文件。

### 方法二：先录 bag 再转换

使用 `rosbag` 指令将点云 topic 录制为 `.bag` 文件，然后再转换为 `.pcd` 文件：

```bash
rosbag record <topic>
rosrun pcl_ros bag_to_pcd <inputfile.bag> <topic> <output_directory>
```
