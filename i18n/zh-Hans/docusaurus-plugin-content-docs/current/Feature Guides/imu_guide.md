---
title: IMU 数据获取与解析
sidebar_position: 3
---

# RS-LiDAR IMU 数据获取与解析

## 1. 概述

### 1.1 IMU 数据

速腾激光雷达惯性测量单元（IMU）输出的为产品内部的 IMU 姿态信息，可用于客户产品外参的调整。当前仅 Airy、AiryLite、Safety Airy、Fairy、E1/E1R 五款激光雷达出厂自带 IMU 数据，并已完成了 IMU 与激光雷达的外参标定。

### 1.2 激光雷达及 IMU 坐标系

激光雷达的坐标原点定义在激光雷达底座中心处，IMU 坐标原点与激光雷达坐标原点并不重合。以 Airy 为例，安装方向与激光雷达坐标系相反，其中激光雷达坐标系 X 轴对应 IMU 坐标系 -Y 轴，激光雷达坐标系 Y 轴对应 IMU 坐标系 -X 轴，激光雷达坐标系 Z 轴对应 IMU 坐标系 -Z 轴。如下图所示，红色为激光雷达坐标系，黄色为 IMU 坐标系。

<figure className="doc-figure">
  <img src={require('./images/imu/image.png').default} alt="Airy 激光雷达剖视图，红色为激光雷达坐标轴，黄色为 IMU 坐标轴" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 1：Airy 激光雷达坐标系及 IMU 坐标系示意图</figcaption>
</figure>

## 2. IMU 数据获取

### 2.1 IMU 数据流协议输出

激光雷达与电脑之间的通信采用以太网介质，使用 UDP 协议，以 IMU 数据流协议进行输出，速腾激光雷达 IMU 数据出厂默认端口号均为 6688。

IMU 数据可通过抓取 UDP 数据包获取，对于抓取到的 UDP 数据可使用 `udp.port==6688` 或 `data.data[0:1]==AA` 在 Wireshark 软件中进行筛选过滤。

<figure className="doc-figure">
  <img src={require('./images/imu/img_v3_02vh_3531e04b-c6cf-40f4-960e-b5b6dcd868bg.jpg').default} alt="Wireshark 报文列表按 IMU UDP 端口筛选的结果" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 2：在 Wireshark 中筛选 IMU 数据流报文</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/imu/img_v3_02vh_7a83b419-7fbe-45ec-a669-fbc9e35cdb3g.jpg').default} alt="Wireshark 中 IMU 数据流报文的字节级内容" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 3：抓取到的 IMU 数据流报文内容</figcaption>
</figure>

### 2.2 ROS 驱动获取

速腾官方提供的 SDK（[rslidar_sdk v1.5.18](https://github.com/RoboSense-LiDAR/rslidar_sdk/releases/tag/v1.5.18)）程序中提供了 IMU 数据解析功能。首先在 `CMakeLists.txt` 中设置 `ENABLE_IMU_DATA_PARSE` 为 `ON`，当连接激光雷达运行 launch/py 文件，即可发布激光雷达 IMU 数据 topic。

<figure className="doc-figure">
  <img src={require('./images/imu/img_v3_02vh_b79296e5-883a-496c-8cdc-94244fc8342g.jpg').default} alt="CMakeLists.txt 中将 ENABLE_IMU_DATA_PARSE 选项设置为 ON" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 4：在 CMakeLists.txt 中开启 ENABLE_IMU_DATA_PARSE</figcaption>
</figure>

具体步骤如下。

**ROS1**

1. 运行 launch 文件：

```bash
roslaunch rslidar start.launch
```

2. 运行以下命令查看 IMU 数据 topic：

```bash
rostopic list
```

3. 运行以下命令查看 IMU 实时数据，返回结果如下图所示：

```bash
rostopic echo /rslidar_imu_data
```

<figure className="doc-figure">
  <img src={require('./images/imu/img_v3_02vh_562062c4-af24-41cb-9574-84ebd6ef31dg.jpg').default} alt="终端输出的 rslidar_imu_data topic 内容，包含线加速度与角速度" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 5：ROS1 获取 IMU 数据示意</figcaption>
</figure>

**ROS2**

1. 运行 py 文件：

```bash
ros2 launch rslidar start.py
```

2. 运行以下命令查看 IMU 数据 topic，返回结果与 ROS1 一致：

```bash
ros2 topic list
```

3. 运行以下命令查看 IMU 实时数据，返回结果与 ROS1 一致：

```bash
ros2 topic echo /rslidar_imu_data
```

### 2.3 IMU 参数配置

IMU 相关参数配置主要涉及 IMU 端口号、IMU 数据输出频率、加速度计量程、陀螺仪量程参数设置。具体方法为正确连接激光雷达后，直接在浏览器网页端输入激光雷达 IP（默认为 `192.168.1.200`），在 **General Setting** 进行 IMU 相关参数设置。

1. **ImuCtrl**：确定是否开启对 IMU 功能的控制接口，有 `OFF` 和 `ON`（默认）两种状态；
2. **ImuPort**：可更改 IMU 的通信端口，值范围为 1025~65535；
3. **ImuOutput Rate**：更改 IMU 输出数据的消息输出频率，可设置为 25Hz / 100Hz / 200Hz（默认 200Hz）；
4. **Accel Range**：加速度计的最大加速度范围，有 [-2g, 2g] / [-4g, 4g]（默认）/ [-8g, 8g] / [-16g, 16g] 四种范围选择；
5. **Gyro Range**：IMU 陀螺仪量程范围，有 [-250, 250] dps / [-500, 500] dps（默认）/ [-1000, 1000] dps / [-2000, 2000] dps 四种范围可选择。

<figure className="doc-figure">
  <img src={require('./images/imu/img_v3_02vh_7251448e-08d6-4e36-89bf-de72bf25bf4g.jpg').default} alt="Airy 网页端 General Setting 页面中的 Imu Ctrl、Imu Port Number、Imu Output Rate、Accel Range 与 Gyro Range 配置项" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 6：Airy IMU 参数配置界面</figcaption>
</figure>

## 3. IMU 数据解析

一个完整的 IMU Packet 数据格式结构为帧头、数据区、帧尾。一般包含 X、Y、Z 轴的加速度、角速度测量值以及数据输出频率、加速度计和陀螺仪量程设置参数等信息。

1. **加速度（AccelX、AccelY、AccelZ）**：测量值部分根据 IMU 数据流协议或 ROS 驱动实时获取。需要注意根据 IMU 数据流协议获取到的加速度值是有符号的原始值，原始值转换为实际值与所选择的量程有关。如量程为 +/-16g，则实际加速度值为：

```text
实际加速度 (g) = 原始值 * 16 / 32768
```

其中 g 值为 9.80665 m/s2。

2. **角速度（GyroX、GyroY、GyroZ）**：测量值部分根据 IMU 数据流协议或 ROS 驱动实时获取。需要注意根据 IMU 数据流协议获取到的角速度值是有符号的原始值，原始值转换为实际值与所选择的量程有关。如量程为 +/-2000 dps，则实际角速度值为：

```text
实际角速度 (rad/s) = 原始值 * 2000 / 32768 * PI / 180
```

## 4. 激光雷达与 IMU 外参标定

### 4.1 外参标定含义

激光雷达与 IMU 之间的外参标定，旨在求解两传感器坐标系之间的刚性空间变换关系。该变换通常以一个旋转矩阵和平移向量构成的变换矩阵表示。速腾激光雷达 IMU 外参标定是将 LiDAR 坐标系对齐到 IMU 坐标系下，每一台激光雷达的外参标定工作已在出厂前完成并固化写入，可为后续多传感器融合算法提供准确的空间同步基准。

### 4.2 标定外参获取

速腾激光雷达与 IMU 之间的外参标定是把 LiDAR 坐标系对齐到 IMU 坐标系下，标出来是一个表征旋转和位移的矩阵，保证算法能够根据 IMU 的位姿推算激光雷达位姿，如下所示：

```text
P_imu = T_lidar_to_imu · P_lidar
```

其中，`T_lidar_to_imu` 是变换矩阵，由表示 LiDAR 到 IMU 旋转变换的四元数（`qx`、`qy`、`qz`、`qw`）和表示 LiDAR 到 IMU 位置偏移的平移量（`x`、`y`、`z`）推算而来。四元数与平移量的获取方法有 3 种。

**1. 产品信息输出协议（DIFOP）**

在 DIFOP 数据中能够解析读取到每一台激光雷达独有的 IMU 标定数据。具体解析方法可以参考每一款激光雷达用户手册附录的 IMU 标定数据部分。

<figure className="doc-figure">
  <img src={require('./images/imu/img_v3_02vn_f4cbdc9c-121a-40c4-946d-3034e319bbfg.jpg').default} alt="用户手册 DIFOP 协议表格中的 IMU 标定数据字段" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 7：IMU 标定数据</figcaption>
</figure>

**2. ROS 驱动（rslidar_sdk）打印**

将以下 IMU 外参读取代码加入到 `rs_sdk/src/source/source_driver.hpp` 对应如下图所示位置，正常编译运行即可获取到每一台激光雷达的 IMU 标定外参。

```cpp
DeviceInfo deviceInfo;
if(driver_ptr_->getDeviceInfo(deviceInfo))
{
  RS_DEBUG << "qx: " << std::fixed << std::setprecision(7) 
           << deviceInfo.qx << ",qy:" << deviceInfo.qy 
           << ",qz:" << deviceInfo.qz << ",qw:" << deviceInfo.qw 
           << ",x:" << deviceInfo.x << ",y:" << deviceInfo.y 
           << ",z:" << deviceInfo.z << std::endl;
}else{
  RS_WARNING << "get device info failed" << RS_END;
}
```

在 rslidar_sdk [release v1.5.19](https://github.com/RoboSense-LiDAR/rslidar_sdk/releases/tag/v1.5.17) 及之后的版本中，该代码块已被移除，因为它仅为开发者调试代码。加入代码后需要重新编译驱动才会生效。

<figure className="doc-figure">
  <img src={require('./images/imu/img_v3_02vk_d8b26a68-4228-4b14-8f7e-86531a6691dg.jpg').default} alt="source_driver.hpp 中 IMU 外参打印代码块的插入位置" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 8：外参打印代码在驱动源码中的插入位置</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/imu/image20.png').default} alt="终端打印出的 IMU 外参四元数 qx、qy、qz、qw 与平移量 x、y、z" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 9：标定外参 ROS 驱动打印示意图</figcaption>
</figure>

如果所有数值都返回 0，说明该激光雷达设备未写入 IMU 标定参数（早期样机），遇到这种情况请联系速腾技术支持。

四元数对应 `extrinsic_Q`，xyz 平移量对应 `extrinsic_T`。要使四元数生效，`extrinsic_R` 需全部为 0。在 SLAM 算法的 `.yaml` 文件中，写法如下：

```yaml
extrinsic_Q: [qx,qy,qz,qw]      # 四元数 qx,qy,qz,qw（在无旋转矩阵时生效）
extrinsic_T: [x,y,z]            # 平移矩阵
extrinsic_R: [0,0,0,            # 旋转矩阵
              0,0,0,
              0,0,0]
```

如果希望使用传统的 `extrinsic_T` 与 `extrinsic_R` 而非四元数，请使用合适的转换工具进行换算。

**3. 默认标定外参**

以下为几款速腾激光雷达的默认标定外参：

```yaml
## E1R
extrinsic_T: [ 0.0042744, -0.0157518, -0.011212 ]
extrinsic_R: [  0.0,  -1.0, -0.0,
                0.0,  0.0,  1.0,
                -1.0, 0.0,  0.0 ]
## Fairy            
extrinsic_T: [ 0.01365, 0.00782, 0.00492 ]
extrinsic_R: [  1.0,  0.0,  0.0,
                0.0,  1.0,  0.0,
                0.0,  0.0,  1.0 ]
## Airy_Lite            
extrinsic_T: [ -0.0174, 0.00957, -0.0076 ]
extrinsic_R: [  1.0,  0.0,  0.0,
                0.0,  1.0,  0.0,
                0.0,  0.0,  1.0 ]
## Airy
extrinsic_T: [ 0.00425, 0.00418, -0.00446 ]
extrinsic_R: [ 0.0, -1.0, 0.0,
               -1.0,  0.0, 0.0,
               0.0,  0.0, -1.0 ]
```

### 4.3 标定外参应用

对于常见的 FAST-LIO 算法，直接将四元数转成旋转矩阵后，填到 `extrinsic_R` 即可。在使用 SLAM（Simultaneous Localization and Mapping）算法（如 FAST-LIO）时，`extrinsic_R` 通常指的是外部旋转矩阵（extrinsic rotation matrix），这个矩阵用于描述传感器（如激光雷达、相机等）相对于某个参考坐标系的旋转关系，`extrinsic_T` 则是平移向量。

## 5. 常见问题

**1. 激光雷达静止时，为何角速度值不为 0？**

因为温度、噪声、安装误差甚至地球自转等原因，会使 IMU 在静止时也会产生一定的角速度，所以我们会进行补零偏误差，这个过程由算法自动补正，保证 IMU 数据的准确性。

**2. 补正后角速度值依然不为 0？**

打印出来的已经是补正后的角速度值，这个值目前非 0，但已经很接近 0 了，是因为还是会有一些未知微小的噪声没办法完全补正，因而这个值只能是接近于 0，但不是完全等于 0。

**3. 静止时，Z 轴加速度为什么为负值，约为 -9.18 m/s2？**

IMU 坐标轴 Z 轴指向地面，静止时，IMU 的加速度等同于重力加速度，方向一致，看似应为 +9.18 m/s2。实际上，加速度计测量的是物体本身的加速度，静止的时候输出的本质是抵消重力所需的等效加速度（支持力方向）。涉及到力的方向和受力方向概念上的区别，不是完全等同于重力加速度。
