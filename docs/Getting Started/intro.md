---
title: Introduction
sidebar_position: 1
---

# Welcome to RoboSense Developer Center

This site collects the setup guides, tool manuals, and development references for RoboSense LiDAR products. The documentation is organized around what you are trying to do, so you can follow it top to bottom the first time and jump straight to a section later.

## Where to start

If this is your first time working with a RoboSense LiDAR, follow these in order:

1. [Network Connection and Wireshark Capture](./network_and_wireshark.md) — wire up the LiDAR, set the host IP, and confirm data is arriving. Most "no point cloud" problems are solved here.
2. [RSView Quick Start](../RSView/quick_start.md) — see the point cloud with the desktop viewer.
3. [Web Configuration Guide](../Configuration Tools/web_configuration.md) — change IP, ports, and other LiDAR parameters.

For AiryLite units using the 485 / serial interface instead of Ethernet, see [AiryLite 485 / Serial Version Guide](./airylite_485.md).

## Documentation map

| Section | What it covers |
| --- | --- |
| **Getting Started** | Physical and network connection, packet capture, serial (485) setup |
| **RSView** | Point cloud visualization, playback, interaction, data export |
| **Configuration Tools** | LiDAR web page, LidarAssistant (E / EM platforms), M1P tool, tool downloads |
| **rslidar_sdk & rs_driver** | ROS / ROS2 driver and SDK: build, configure, run, troubleshoot |
| **RS-LiDAR API** | C++ control library for programmatic configuration and firmware updates |
| **Feature Guides** | Time synchronization, leap second offset, IMU data, FAST-LIO mapping |

## Additional resources

- [Manual Resources](https://www.robosense.cn/resources) — product manuals and datasheets
- [ROS SDK & Driver](https://github.com/RoboSense-LiDAR/) — official source repositories

If you cannot find what you need, contact RoboSense technical support.
