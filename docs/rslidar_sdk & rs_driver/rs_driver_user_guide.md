---
title: rs_driver User Guide
sidebar_position: 4
---
# rs_driver User Guide

`rs_driver` is the decoding kernel underneath `rslidar_sdk`. It can be used as a standalone C++ library, as a third-party dependency, or as a submodule. It also ships with command-line tools for visualization and PCD export.

---

## Environment Dependencies

The operating systems and compilers supported by `rs_driver` are as follows:

* **Ubuntu** (16.04, 18.04, 20.04)
  * gcc (4.8+)
* **Windows**
  * MSVC (Win10 / VS2019 tested)

### Third-party dependencies

| Dependency | When it can be ignored |
| --- | --- |
| **libpcap** | If PCAP file parsing is not required |
| **eigen3** | If built-in coordinate transformation is not required |
| **PCL** | If visualization tools are not required |
| **Boost** | If visualization tools are not required |

The one-click installation command is as follows:

```shell-session
user@user:~$ sudo apt-get install libpcap-dev libeigen3-dev libboost-dev libpcl-dev
```

---

## Compilation and Installation

Execute the following commands to compile and install `rs_driver` into the Ubuntu system environment.

```shell-session
user@user:~$ git clone https://github.com/RoboSense-LiDAR/rs_driver.git
user@user:~$ cd rs_driver
user@user:~/rs_driver$ mkdir build && cd build
user@user:~/rs_driver/build$ cmake -DCOMPILE_DEMOS=ON ..     # Compile demo
user@user:~/rs_driver/build$ cmake -DCOMPILE_TOOLS=ON ..     # Compile tool
user@user:~/rs_driver/build$ make -j4
```

### Using as a third-party library

Configure the `CMakeLists.txt` file and use the `find_package()` command to locate the `rs_driver` library and link it.

```cmake
find_package(rs_driver REQUIRED)
include_directories(${rs_driver_INCLUDE_DIRS})
target_link_libraries(your_project ${rs_driver_LIBRARIES})
```

### Using as a submodule

Add `rs_driver` as a submodule to your project, configure the `CMakeLists.txt` file, and use the `find_package()` command to locate the library and link it.

```cmake
add_subdirectory(${PROJECT_SOURCE_DIR}/rs_driver)
find_package(rs_driver REQUIRED)
include_directories(${rs_driver_INCLUDE_DIRS})
target_link_libraries(project ${rs_driver_LIBRARIES})
```

---

## Tool Usage

Before using tools related to `rs_driver`, users also need to ensure that the LiDAR is properly connected to the computer. For specific steps, refer to the [LiDAR Connection](./rslidar_sdk_user_guide.md#lidar-connection) section.

### Running the example demo

```shell-session
user@user:~$ cd rs_driver/build/demo
user@user:~/rs_driver/build/demo$ ./demo_online
user@user:~/rs_driver/build/demo$ ./demo_online_multi_lidars
user@user:~/rs_driver/build/demo$ ./demo_pcap
```

> **Note:** The LiDAR parameters in the demo file cannot be changed once compiled. If users need to change parameters such as **IP address** or **port number**, they must modify the source code file and recompile. The source code file path is: `rs_driver/demo/demo_*.cpp`.

### rs_driver_viewer

`rs_driver` provides a point cloud visualization tool — `rs_driver_viewer` — which is located in the `rs_driver/tool` directory. This tool can be used for simple online/offline viewing of point cloud images. The specific commands and related parameters are as follows:

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

Example of visualization tool command:

```shell-session
user@user:~/rs_driver/build/tool$ ./rs_driver_viewer -type Airy -msop 6699 -difop 7788
# Online Airy, MSOP 6699, DIFOP 7788
```

### rs_driver_pcdsaver

`rs_driver` also provides a point cloud PCD format conversion tool — `rs_driver_pcdsaver` — which is also located in the `rs_driver/tool` directory. This tool can be used for simple online/offline conversion of point cloud images to PCD format files. The specific commands and related parameters are as follows:

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

Example of saver tool command:

```shell-session
user@user:~/rs_driver/build/tool$ ./rs_driver_pcdsaver -type Airy -msop 6699 -difop 7788
# Online Airy, MSOP 6699, DIFOP 7788
```
