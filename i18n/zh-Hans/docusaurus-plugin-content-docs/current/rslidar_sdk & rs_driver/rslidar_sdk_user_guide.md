---
title: rslidar_sdk 用户指南
sidebar_position: 3
---
# rslidar_sdk 用户指南

本指南介绍运行 `rslidar_sdk` 所需的环境依赖、编译、激光雷达连接以及参数配置。

---

## 环境依赖

### ROS

要在 ROS 环境中使用 SDK，需要安装 ROS 依赖库。

| Ubuntu 版本 | ROS 发行版 |
| --- | --- |
| Ubuntu 16.04 | ROS Kinetic desktop |
| Ubuntu 18.04 | ROS Melodic desktop |
| Ubuntu 20.04 | ROS Noetic desktop |

安装说明请参考：[ROS Installation](http://wiki.ros.org)。

### ROS2

要在 ROS2 环境中使用 SDK，需要安装 ROS2 依赖库。

| Ubuntu 版本 | ROS2 发行版 |
| --- | --- |
| Ubuntu 18.04 | ROS2 Eloquent desktop |
| Ubuntu 20.04 | ROS2 Galactic desktop |
| Ubuntu 22.04 | ROS2 Humble desktop |

安装说明请参考：[ROS2 Installation](https://docs.ros.org/en/humble/Installation.html)。

### yaml

所安装的依赖包必须满足**版本 ≥ v0.5.2**。如果已安装 **ROS desktop-full**，则可跳过此步骤。安装命令如下：

```shell-session
user@user:~$ sudo apt-get update
user@user:~$ sudo apt-get install -y libyaml-cpp-dev
```

### libpcap

所安装的依赖包必须满足**版本 ≥ v1.7.4**。安装命令如下：

```shell-session
user@user:~$ sudo apt-get update
user@user:~$ sudo apt-get install -y libpcap-dev
```

### 注意事项

1. 建议安装 **ROS desktop-full** 版本。该安装过程会自动安装兼容版本的依赖库（例如 PCL）。这样可以避免缺少必要依赖或在独立安装上耗费大量时间等问题。
2. **Ubuntu 22.04** 不再支持 ROS。因此，在该系统版本上，用户可以通过执行以下命令进行编译：

   ```shell-session
   user@user:~$ echo "deb [trusted=yes arch=amd64] http://deb.repo.autolabor.com.cn jammy main" | sudo tee /etc/apt/sources.list.d/autolabor.list
   user@user:~$ sudo apt update
   user@user:~$ sudo apt install ros-noetic-autolabor
   ```

   或者使用 ROS2（建议）。
3. **请勿在同一台计算机上同时安装 ROS 和 ROS2。**
4. **Ubuntu 24.04** 经测试可支持基于 ROS2 的 `rslidar_sdk`，但仍建议使用 Ubuntu 22.04 或更早的版本。
5. `rslidar_sdk` 所依赖的所有第三方库均提供 ARM 架构下支持的版本，可在 ARM 上编译、安装和使用。

---

## 编译与运行

### 获取项目文件

建议使用 `git` 命令直接从 GitHub 仓库拉取项目文件，以确保项目版本的时效性和完整性。

```shell-session
user@user:~/workspace$ git clone https://github.com/RoboSense-LiDAR/rslidar_sdk.git
user@user:~/workspace$ cd rslidar_sdk
user@user:~/workspace$ git submodule init
user@user:~/workspace$ git submodule update
```

除上述方法外，用户还可以直接访问[官方仓库](https://github.com/RoboSense-LiDAR/rslidar_sdk/releases)下载最新版本的软件包 `rslidar_sdk.tar.gz`。

> **注意：** 直接下载 Source Code 会导致子模块 `rs_driver` 缺失，从而引起编译和安装失败。

### 基于 ROS 的编译与运行

建议在本机的主目录下新建一个文件夹作为工作空间，然后在该工作空间内创建一个 `src` 文件夹。将拉取到的 `rslidar_sdk` 项目文件放入 `src` 文件夹中：`~/workspace/src/rslidar_sdk`。

返回工作空间目录（例如 `~/workspace`），执行以下命令进行编译和安装。执行期间请确保处于 ROS 环境中。

```shell-session
user@user:~/workspace$ catkin_make
user@user:~/workspace$ source devel/setup.bash
user@user:~/workspace$ roslaunch rslidar_sdk start.launch
```

> **注意：** 如果使用 zsh，请将第二条命令替换为 `source devel/setup.zsh`。

### 基于 ROS2 的编译与运行

对于基于 ROS2 的编译和安装，需要额外获取 `rslidar_msg` 项目文件，以定义 ROS2 环境中的激光雷达数据包消息。下载链接为：[rslidar_msg](https://github.com/RoboSense-LiDAR/rslidar_msg)。下载后，将其与 `rslidar_sdk` 项目文件一起放入 `src` 文件夹中。

返回工作空间目录（例如 `~/workspace`），执行以下命令进行编译和运行。执行期间请确保处于 ROS2 环境中。

```shell-session
user@user:~/workspace$ colcon build
user@user:~/workspace$ source install/setup.bash
user@user:~/workspace$ ros2 launch rslidar_sdk start.py
```

> **注意：** 如果使用 zsh，请将第二条命令替换为 `source install/setup.zsh`。

**运行 SDK 之前，请先确保激光雷达已正确连接，且常用参数已正确填写。**

---

## 激光雷达连接

> 本节仅介绍 Ubuntu 下的流程。Windows 主机 IP 配置、Wireshark 安装细节、保存 `.pcap` 文件，以及 `ping` 不通时的系统性排查，请参考[网络连接与 Wireshark 抓包](../Getting Started/network_and_wireshark.md)。

下载并安装 **Wireshark** 以查看网络端口数据包。

```shell-session
user@user:~$ sudo apt-get install wireshark
user@user:~$ sudo wireshark
```

选择相应的网卡以查看数据包状态。Ubuntu 下常见的网卡名称为 `eno1`（**图 3.1**）。

![Wireshark 首页选项区域](./images/figure_3_1.png)

*图 3.1 —— Wireshark 首页选项区域*

进入相应网口的抓包界面。如果看不到 UDP 数据，请检查激光雷达的 ARP 数据包。根据内容提示（*Who has...*），将主机网卡的静态 IP 修改为激光雷达数据的目标 IP。

![Wireshark 抓包界面 —— ARP 数据包](./images/figure_3_2.png)

*图 3.2 —— Wireshark 抓包界面（ARP 数据包）*

将主机静态地址修改为激光雷达目标地址，并检查修改后的参数是否生效。修改命令示例如下：

```shell-session
user@user:~$ sudo ifconfig eno1 192.168.1.102
user@user:~$ ifconfig
```

![修改并检查主机静态地址](./images/figure_3_3.png)

*图 3.3 —— 修改并检查主机静态地址*

在 Wireshark 抓包界面的输入框中，输入命令以查看激光雷达 UDP 数据的 MSOP/DIFOP/IMU 端口号。

默认情况下，激光雷达 MSOP 端口号为 **6699**，DIFOP 端口号为 **7788**，IMU 端口号为 **6688**（仅 Airy/Fairy）。用户也可以使用以下命令筛选并锁定 MSOP/DIFOP/IMU 数据条目。

```text
data.data[0:1] == 55     # Filter MSOP Data
data.data[0:1] == a5     # Filter DIFOP Data
data.data[0:1] == aa     # Filter IMU Data (Airy/Fairy Only)
```

![仅筛选激光雷达的 DIFOP 数据](./images/figure_3_4.png)

*图 3.4 —— 基于命令仅筛选激光雷达的 DIFOP 数据*

---

## 参数配置

启动驱动之前，用户需要在 `src/rslidar_sdk/config/config.yaml` 文件中配置正确的 `lidar_type`、`MSOP port` 和 `DIFOP port`。端口号可通过上述方法获取。

### 机械式激光雷达

机械式激光雷达包括 **RS 系列**、**Ruby 系列**、**Helios 系列**、**Bpearl 系列**、**Airy 系列**、**Fairy** 等产品。

默认端口值分别为 **6699**（MSOP）和 **7788**（DIFOP）。

> **注意：**
>
> 1. Airy 激光雷达额外支持获取 **IMU 标定数据**（四元数与偏移量）。详情请参考 [FAQ](./faq.md)。
> 2. 对于 **AiryLite**，`lidar_type` 应为 **RSAIRYLITE_ETH**。

### 非机械式激光雷达

非机械式激光雷达包括 **MEMS 系列**、**E 系列** 和 **EM 系列**。

在启动驱动前的参数配置方面，非机械式激光雷达与机械式激光雷达基本相同，但需要额外注意一点：

> 对于 **EM 系列** 产品，填写 DIFOP 端口号时，默认参数值为 **7766** 而非 7788。DIFOP 端口号错误会导致点云显示失败。
