---
title: Introduction
sidebar_position: 1
---
# Introduction

`rslidar_sdk` is a LiDAR driver software package developed by RoboSense for the Ubuntu environment. It is the recommended way to integrate RoboSense LiDARs into a robotics software stack.

The package includes:

* The driver kernel: **rs_driver**
* ROS extension features (supports Ubuntu 16.04, Ubuntu 18.04, Ubuntu 20.04)
* ROS2 extension features (supports Ubuntu 18.04, Ubuntu 20.04, Ubuntu 22.04)

The SDK and driver versions in the current GitHub repository only support the LiDAR products listed in **Table 1.1**. For SDK usage requirements with other LiDAR products in **Table 1.2**, please contact RoboSense technical support to obtain the corresponding version of the software package.

---

## Supported LiDAR Models

### Table 1.1 — LiDAR models supported by the SDK in GitHub

| Mechanical / General | MEMS / Solid-State |
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

### Table 1.2 — Additional supported LiDAR models

| Model | Model |
| --- | --- |
| RS-LiDAR-EM4 | RS-LiDAR-AiryLite |

---

## Architecture Overview

`rslidar_sdk` is layered on top of the core driver `rs_driver`:

* **rs_driver** — the decoding kernel. It receives MSOP/DIFOP/IMU packets from the LiDAR (online) or PCAP files (offline), decodes them into point clouds, and exposes the data through callbacks. It can be used standalone as a C++ library or as a submodule.
* **rslidar_sdk** — wraps `rs_driver` and provides ROS / ROS2 integration, a YAML-based configuration interface, and ready-to-run launch files.

Choose the layer that fits your use case:

* Use **rslidar_sdk** when you work inside a ROS / ROS2 ecosystem and want point clouds published as topics.
* Use **rs_driver** directly when you want a lightweight, ROS-free C++ integration, or when you need the bundled command-line tools (`rs_driver_viewer`, `rs_driver_pcdsaver`).
