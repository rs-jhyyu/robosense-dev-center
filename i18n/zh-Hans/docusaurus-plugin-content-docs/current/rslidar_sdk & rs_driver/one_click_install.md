---
title: 一键安装脚本
sidebar_position: 7
---
# 一键安装脚本 install_one_click.sh

本文档提供了适配常规 ROS/ROS2 环境的安装脚本。将脚本文件 `install_one_click.sh` 放在期望路径下，执行下列命令；执行后可以跳过 SDK 使用指南中的安装编译步骤：

```shell-session
user@user:~$ bash install_one_click.sh
```

脚本下载：[install_one_click.sh](pathname:///downloads/SDK&Driver/install_one_click.sh)

## 命令行选项

| 选项 | 说明 |
| --- | --- |
| `-w DIR` | 指定工作空间路径（默认：当前目录下的 `rslidar_ws`） |
| `-r` | 自动安装 ROS/ROS2 |
| `-d` | 仅安装系统依赖，跳过编译 |
| `-h` | 显示帮助信息 |

## 执行流程

脚本按以下 7 个步骤依次执行：

| 步骤 | 内容 |
| --- | --- |
| Step 0 | 清除 Git 代理配置（退出时自动恢复） |
| Step 1 | 检测系统环境（发行版、版本号、架构） |
| Step 2 | 检测 ROS/ROS2 环境；若同时存在则提示用户选择 |
| Step 3 | 安装系统依赖（`libyaml-cpp-dev`、`libpcap-dev`、`cmake`、`git` 等） |
| Step 4 | 加载对应的 ROS 环境变量 |
| Step 5 | 拉取源码（`rslidar_sdk`、`rs_driver` 子模块，ROS2 下额外拉取 `rslidar_msg`），每个源最多重试 3 次 |
| Step 6 | 编译工程（ROS1 用 `catkin_make`，ROS2 用 `colcon build`，无 ROS 时仅 cmake 编译 `rs_driver`） |
| Step 7 | 输出安装后的检查清单 |

## 注意事项

:::warning
该脚本仅在常规 ROS/ROS2 环境下进行过运行测试。如果你的环境较为复杂，建议按照 SDK 使用指南中的命令手动安装编译。
:::

- 部分情况下，**编译完成之后需要重新 source ROS 环境**。
- 脚本本身不会初始化编译后的 SDK 工作环境，因此仍需**手动执行下列命令启动 SDK**：

```shell-session
# 以 ROS1 环境为例
user@user:~/workspace$ source devel/setup.bash                       # 加载环境
user@user:~/workspace$ roslaunch rslidar_sdk start.launch            # 启动驱动
```

- 请使用 `bash` 运行本脚本，不要使用 `sh`（dash 不支持 `source`）。

## 安装后检查清单

脚本执行完成后，仍需确认以下几项：

1. 修改 `config.yaml`：`lidar_type` / `msop_port` / `difop_port`。
2. 配置网卡 IP 为激光雷达的目的 IP，例如 `sudo ifconfig eno1 192.168.1.102`。
3. 关闭防火墙：`sudo ufw disable`。
4. 用 Wireshark 验证可以收到 MSOP/DIFOP 报文。
