---
title: Configuration Guide
sidebar_position: 2
---
# Configuration Guide

This section explains how the SDK is configured and where to find detailed parameter references and advanced-usage documentation.

---

## Basic Parameters

The SDK is configured through the `config.yaml` file located at `src/rslidar_sdk/config/config.yaml`.

Taking the `config.yaml` file of SDK version 1.5.19 as an example (**Figure 2.1**), the default parameter configuration when connecting to an Airy LiDAR online is as follows.

![Common parameters and introduction](./images/figure_2_1.png)

*Figure 2.1 — Common parameters and introduction*

In addition to the above parameters, the SDK software package also includes editable **advanced parameters**. Users can obtain detailed explanations of both basic and advanced parameters in the `rslidar_sdk/doc/intro` path within the software package.

---

## Advanced Usage

In various practical application scenarios of the SDK, advanced operations such as loading offline PCAP files or connecting multiple LiDARs may be required. For ease of use, the SDK software package provides relevant documentation for reference. See **Table 2.1** for details.

### Table 2.1 — Common advanced usages of the SDK

| Advanced Usage | GitHub Link |
| --- | --- |
| How to change point type | [05_how_to_change_point_type.md](https://github.com/RoboSense-LiDAR/rslidar_sdk/blob/main/doc/howto/05_how_to_change_point_type.md) |
| How to decode online LiDAR | [06_how_to_decode_online_lidar.md](https://github.com/RoboSense-LiDAR/rslidar_sdk/blob/main/doc/howto/06_how_to_decode_online_lidar.md) |
| Online LiDAR — Advanced Topics (e.g. Multiple LiDARs) | [07_online_lidar_advanced_topics.md](https://github.com/RoboSense-LiDAR/rslidar_sdk/blob/main/doc/howto/07_online_lidar_advanced_topics.md) |
| How to decode PCAP file | [08_how_to_decode_pcap_file.md](https://github.com/RoboSense-LiDAR/rslidar_sdk/blob/main/doc/howto/08_how_to_decode_pcap_file.md) |
| PCAP File — Advanced Topics | [09_pcap_file_advanced_topics.md](https://github.com/RoboSense-LiDAR/rslidar_sdk/blob/main/doc/howto/09_pcap_file_advanced_topics.md) |
| How to use coordinate transformation | [10_how_to_use_coordinate_transformation.md](https://github.com/RoboSense-LiDAR/rslidar_sdk/blob/main/doc/howto/10_how_to_use_coordinate_transformation.md) |
| How to record and replay Packet rosbag | [11_how_to_record_replay_packet_rosbag.md](https://github.com/RoboSense-LiDAR/rslidar_sdk/blob/main/doc/howto/11_how_to_record_replay_packet_rosbag.md) |
| How to solve ROS2 humble frame rate drop | [13_how_to_solve_ROS2_humble_frame_rate_drop.md](https://github.com/RoboSense-LiDAR/rslidar_sdk/blob/main/doc/howto/13_how_to_solve_ROS2_humble_frame_rate_drop.md) |

In addition to the SDK-related documentation, the core driver `rs_driver` also provides relevant advanced usages and instructions. See **Table 2.2**.

### Table 2.2 — Common advanced usages of the Driver

| Advanced Usage | GitHub Link |
| --- | --- |
| Introduction to rs_driver CMake macros | [05_cmake_macros_intro.md](https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/intro/05_cmake_macros_intro.md) |
| SDK/Driver Common error codes | [06_error_code_intro.md](https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/intro/06_error_code_intro.md) |
| How to visualize point cloud | [14_how_to_use_rs_driver_viewer.md](https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/howto/14_how_to_use_rs_driver_viewer.md) |
| How to transform point cloud | [15_how_to_transform_pointcloud.md](https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/howto/15_how_to_transform_pointcloud.md) |
| How to compile rs_driver on Windows | [16_how_to_compile_on_windows.md](https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/howto/16_how_to_compile_on_windows.md) |
| How to avoid Packet Loss | [17_how_to_avoid_packet_loss.md](https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/howto/17_how_to_avoid_packet_loss.md) |
| Point Type and Point Layout | [18_about_point_layout.md](https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/howto/18_about_point_layout.md) |
| Splitting Rule | [19_about_splitting_frame.md](https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/howto/19_about_splitting_frame.md) |
| CPU Usage and Memory Usage | [20_about_usage_of_cpu_and_memory.md](https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/howto/20_about_usage_of_cpu_and_memory.md) |
| How to Parse DIFOP Packet | [21_how_to_parse_difop.md](https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/howto/21_how_to_parse_difop.md) |
