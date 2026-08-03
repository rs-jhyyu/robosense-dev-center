---
title: rs_driver 用户指南
sidebar_position: 4
---
# rs_driver 用户指南

`rs_driver` 是 `rslidar_sdk` 底层的解码内核。它可以作为独立的 C++ 库、第三方依赖或子模块使用。它还附带了用于可视化和 PCD 导出的命令行工具。

---

## 环境依赖

`rs_driver` 支持的操作系统和编译器如下：

* **Ubuntu**（16.04、18.04、20.04）
  * gcc（4.8+）
* **Windows**
  * MSVC（已在 Win10 / VS2019 上测试）

### 第三方依赖

| 依赖 | 何时可以忽略 |
| --- | --- |
| **libpcap** | 如果不需要解析 PCAP 文件 |
| **eigen3** | 如果不需要内置的坐标变换 |
| **PCL** | 如果不需要可视化工具 |
| **Boost** | 如果不需要可视化工具 |

一键安装命令如下：

```shell-session
user@user:~$ sudo apt-get install libpcap-dev libeigen3-dev libboost-dev libpcl-dev
```

---

## 编译与安装

执行以下命令将 `rs_driver` 编译并安装到 Ubuntu 系统环境中。

```shell-session
user@user:~$ git clone https://github.com/RoboSense-LiDAR/rs_driver.git
user@user:~$ cd rs_driver
user@user:~/rs_driver$ mkdir build && cd build
user@user:~/rs_driver/build$ cmake -DCOMPILE_DEMOS=ON ..     # Compile demo
user@user:~/rs_driver/build$ cmake -DCOMPILE_TOOLS=ON ..     # Compile tool
user@user:~/rs_driver/build$ make -j4
```

### 作为第三方库使用

配置 `CMakeLists.txt` 文件，使用 `find_package()` 命令定位 `rs_driver` 库并进行链接。

```cmake
find_package(rs_driver REQUIRED)
include_directories(${rs_driver_INCLUDE_DIRS})
target_link_libraries(your_project ${rs_driver_LIBRARIES})
```

### 作为子模块使用

将 `rs_driver` 作为子模块添加到你的项目中，配置 `CMakeLists.txt` 文件，使用 `find_package()` 命令定位该库并进行链接。

```cmake
add_subdirectory(${PROJECT_SOURCE_DIR}/rs_driver)
find_package(rs_driver REQUIRED)
include_directories(${rs_driver_INCLUDE_DIRS})
target_link_libraries(project ${rs_driver_LIBRARIES})
```

---

## 工具使用

在使用与 `rs_driver` 相关的工具之前，用户同样需要确保激光雷达已正确连接到计算机。具体步骤请参考[激光雷达连接](./rslidar_sdk_user_guide.md#lidar-connection)章节。

### 运行示例 demo

```shell-session
user@user:~$ cd rs_driver/build/demo
user@user:~/rs_driver/build/demo$ ./demo_online
user@user:~/rs_driver/build/demo$ ./demo_online_multi_lidars
user@user:~/rs_driver/build/demo$ ./demo_pcap
```

> **注意：** demo 文件中的激光雷达参数一旦编译完成便无法更改。如果用户需要更改 **IP 地址** 或 **端口号** 等参数，必须修改源码文件并重新编译。源码文件路径为：`rs_driver/demo/demo_*.cpp`。

### rs_driver_viewer

`rs_driver` 提供了一个点云可视化工具 —— `rs_driver_viewer` —— 它位于 `rs_driver/tool` 目录中。该工具可用于简单的在线/离线查看点云图像。具体命令及相关参数如下：

```shell-session
user@user:~$ cd rs_driver/build/tool
user@user:~/rs_driver/build/tool$ ./rs_driver_viewer -h
---------------------------------------------------------------
                  RS_Driver Viewer Version: v1.5.*
---------------------------------------------------------------
Arguments:
 -type  = LiDAR type
 -pcap  = The path of the pcap file, off-line mode if it is true.
 -msop  = LiDAR msop port number, the default value is 6699
 -difop = LiDAR difop port number, the default value is 7788
 -group = LiDAR destination group address if multi-cast mode.
 -host  = Host address.
 -x     = Transformation parameter, unit: m
 -y     = Transformation parameter, unit: m
 -z     = Transformation parameter, unit: m
 -roll  = Transformation parameter, unit: radian
 -pitch = Transformation parameter, unit: radian
 -yaw   = Transformation parameter, unit: radian
```

可视化工具命令示例：

```shell-session
user@user:~/rs_driver/build/tool$ ./rs_driver_viewer -type Airy -msop 6699 -difop 7788
# Online Airy, MSOP 6699, DIFOP 7788
```

### rs_driver_pcdsaver

`rs_driver` 还提供了一个点云 PCD 格式转换工具 —— `rs_driver_pcdsaver` —— 它同样位于 `rs_driver/tool` 目录中。该工具可用于简单地将在线/离线点云图像转换为 PCD 格式文件。具体命令及相关参数如下：

```shell-session
user@user:~$ cd rs_driver/build/tool
user@user:~/rs_driver/build/tool$ ./rs_driver_pcdsaver -h
---------------------------------------------------------------
                  RS_Driver PCD Saver Version: v1.5.*
---------------------------------------------------------------
Arguments:
 -type  = LiDAR type
 -pcap  = The path of the pcap file, off-line mode if it is true.
 -msop  = LiDAR msop port number, the default value is 6699
 -difop = LiDAR difop port number, the default value is 7788
 -group = LiDAR destination group address if multi-cast mode.
 -host  = Host address.
 -x     = Transformation parameter, unit: m
 -y     = Transformation parameter, unit: m
 -z     = Transformation parameter, unit: m
 -roll  = Transformation parameter, unit: radian
 -pitch = Transformation parameter, unit: radian
 -yaw   = Transformation parameter, unit: radian
```

保存工具命令示例：

```shell-session
user@user:~/rs_driver/build/tool$ ./rs_driver_pcdsaver -type Airy -msop 6699 -difop 7788
# Online Airy, MSOP 6699, DIFOP 7788
```
