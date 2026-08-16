---
title: FAQ
sidebar_position: 6
---
# FAQ

以下是使用 `rslidar_sdk` 和 `rs_driver` 时遇到的一些常见使用问题。如果你遇到这些问题，可以参照下面的指引自行排查。

---

## Q1：节点终端中持续出现 MSOP_TIMEOUT 或 DIFOP_TIMEOUT 错误

首次使用 SDK 或驱动时，常会遇到这样的情况：激光雷达已正确连接、数据传输正常，但 rviz 无法显示点云，且终端返回错误码 **MSOP_TIMEOUT / DIFOP_TIMEOUT**。这通常是由于防火墙未关闭导致的。用户可以参照下面列出的常见防火墙，使用相应命令将其关闭。

### UFW

```shell-session
user@user:~$ sudo ufw status
user@user:~$ sudo ufw disable
user@user:~$ sudo ufw enable
```

### Firewalld

```shell-session
user@user:~$ sudo firewall-cmd --state
user@user:~$ sudo systemctl stop firewalld.service
user@user:~$ sudo systemctl disable firewalld.service
user@user:~$ sudo systemctl restart firewalld.service
user@user:~$ sudo systemctl enable firewalld.service
```

### Iptables

```shell-session
user@user:~$ sudo service iptables status
user@user:~$ sudo iptables -F
user@user:~$ sudo iptables -X
user@user:~$ sudo service iptables stop
user@user:~$ sudo chkconfig iptables off
```

---

## Q2：如何打印 Airy/Fairy 的 IMU 数据信息

在使用 SDK 的过程中，除了 IMU 相关话题中包含的角速度和线速度数据外，Airy/Fairy IMU 中四元数和偏移量的具体值也可以通过 SDK 打印出来。

参见：[IMU 数据获取与解析](../Feature Guides/imu_guide.md)。

---

## Q3：如何解决基于 ROS2 的数据频率降低（帧率下降）问题

在使用 SDK 的过程中，由于 ROS2 通信机制的影响，发布的话题频率可能低于激光雷达的正常频率，甚至可能降至 5 Hz 乃至 1 Hz。该问题通常有两种解决方案：

1. 参考 SDK 自带文档中提供的频率降低问题解决方案。详见[配置指南](./configuration_guide.md)中的 **表 2.1**。
2. 对于部分无法通过表 2.1 所提方法解决的情况，可以考虑基于 FastDDS 的共享内存方案：[ROS2 下的 FastDDS 共享内存方案](./fastdds_shared_memory.md)。

---

## Q4：如何修改节点名称以防止主从机之间的冲突

在多机 ROS 系统中，如果未正确配置分布式通信机制，不同设备在启动节点时会默认使用相同的节点名称和话题名称。当主机启动激光雷达驱动时，新节点会尝试注册同名节点或发布同名话题，导致 ROS master 感知到冲突并强制终止从机上原有的驱动节点，从而使从机驱动意外退出。

遇到此类问题的用户通常可以通过修改节点名称和话题名称来避免冲突。

* **节点名称修改** —— 修改 `rslidar_sdk/src/launch/start.launch` 中的 `name='rslidar_sdk_node'`，以避免节点名称冲突。
* **话题名称修改** —— 修改 `config.yaml` 文件中的话题名称，以避免在单个节点内使用多台激光雷达时发生话题冲突。

---

## Q5：如何为机械式激光雷达过滤掉指定的不连续水平角度 FOV

此修改需要在对应机械式激光雷达的源码文件中进行。通常的访问路径为 `/rslidar_sdk/src/rs_driver/src/rs_driver/driver/decoder`。

以 Airy 为例，若要将需显示的水平 FOV 范围指定为 0°–90° 和 270°–360°，示例代码如下（**注释中加粗的条件即为修改后的代码**）：

```cpp
// Line 569 of decoder_RSAIRY.hpp
// Modified condition: add the angle_horiz_final range check below
if (this->distance_section_.in(distance) && this->scan_section_.in(angle_horiz_final) && ((angle_horiz_final >= 0 && angle_horiz_final <= 9000) || (angle_horiz_final >= 27000 && angle_horiz_final <= 36000)))
{
    float x = distance * COS(angle_vert) * COS(angle_horiz_final) + this->lidar_lens_center_Rxy_ * COS(angle_horiz);
    float y = -distance * COS(angle_vert) * SIN(angle_horiz_final) - this->lidar_lens_center_Rxy_ * SIN(angle_horiz);
    float z = distance * SIN(angle_vert) + this->mech_const_param_.RZ;
    this->transformPoint(x, y, z);
    typename T_PointCloud::PointT point;
    setX(point, x);
    setY(point, y);
    setZ(point, z);
    setIntensity(point, channel.intensity);
    setRing(point, this->chan_angles_.toUserChan(chan_id));
    setTimestamp(point, chan_ts);
    setFeature(point, feature);
    this->point_cloud_->points.emplace_back(point);
}
else if (!this->param_.dense_points)
{
    typename T_PointCloud::PointT point;
    setX(point, NAN);
    setY(point, NAN);
    setZ(point, NAN);
    setIntensity(point, 0);
    setRing(point, this->chan_angles_.toUserChan(chan_id));
    setTimestamp(point, chan_ts);
    setFeature(point, feature);
    this->point_cloud_->points.emplace_back(point);
}
```

---

## Q6：如何以 topic 形式发布 IMU 外参

Airy/Fairy 的 IMU 外参标定数据由四元数和偏移量两部分构成，除了打印到终端外，还可以作为单独的话题发布。相关背景参见 [IMU 数据获取与解析](../Feature Guides/imu_guide.md)。

实现方式：打开 `src/source/source_driver.hpp` 文件，在指定位置插入下列代码。该实现同时兼容 ROS 与 ROS2，通过 `std::call_once` 保证发布器只初始化一次，话题名为 `rslidar_imu_calib`。

```cpp
#pragma once

#include "source/source.hpp"

#include <rs_driver/api/lidar_driver.hpp>
#include <rs_driver/utility/sync_queue.hpp>
// 新增
#ifdef ROS_FOUND
#include <ros/ros.h>
#include <geometry_msgs/Pose.h>
#elif defined(ROS2_FOUND)
#include <rclcpp/rclcpp.hpp>
#include <geometry_msgs/msg/pose.hpp>
#endif
//

......

void SourceDriver::processPointCloud()
{
  while (!to_exit_process_)
  {
    std::shared_ptr<LidarPointCloudMsg> msg = point_cloud_queue_.popWait(1000);
    if (msg.get() == NULL)
    {
      continue;
    }
    sendPointCloud(msg);

    // 新增
    DeviceInfo deviceInfo;
    if (!driver_ptr_->getDeviceInfo(deviceInfo))
    {
      static bool device_info_warned = false;
      if (!device_info_warned)
      {
        RS_WARNING << "get device info failed" << RS_REND;
        device_info_warned = true;
      }
    }
    else
    {
    #if defined(ROS_FOUND) || defined(ROS2_FOUND)

    #ifdef ROS_FOUND
      using PoseMsg = geometry_msgs::Pose;
      static ros::Publisher calib_pub;
    #else
      using PoseMsg = geometry_msgs::msg::Pose;
      static std::shared_ptr<rclcpp::Node> calib_node;
      static rclcpp::Publisher<PoseMsg>::SharedPtr calib_pub;
    #endif

      static std::once_flag init_flag;
      std::call_once(init_flag, [] {
    #ifdef ROS_FOUND
        ros::NodeHandle nh;
        calib_pub = nh.advertise<PoseMsg>("rslidar_imu_calib", 1, true);
    #else
        calib_node = rclcpp::Node::make_shared("rslidar_imu_calib_node");
        rclcpp::QoS qos(rclcpp::KeepLast(1));
        qos.transient_local();
        calib_pub = calib_node->create_publisher<PoseMsg>("rslidar_imu_calib", qos);
    #endif
      });

      PoseMsg pose;
      pose.orientation.x = deviceInfo.qx;
      pose.orientation.y = deviceInfo.qy;
      pose.orientation.z = deviceInfo.qz;
      pose.orientation.w = deviceInfo.qw;
      pose.position.x    = deviceInfo.x;
      pose.position.y    = deviceInfo.y;
      pose.position.z    = deviceInfo.z;

    #ifdef ROS_FOUND
      calib_pub.publish(pose);
    #else
      calib_pub->publish(pose);
    #endif

    #endif
    }
    //

    free_point_cloud_queue_.push(msg);
  }
}
```

:::note
该方法同时支持 Airy 和 Fairy。
:::

---

## Q7：如何屏蔽指定通道

机械式激光雷达可以通过修改与其型号对应的 decoder 代码文件，对指定的通道进行屏蔽。常规访问路径为 `/rslidar_sdk/src/rs_driver/src/rs_driver/driver/decoder`。以 Airy 为例：

### 屏蔽不连续通道

不连续通道的屏蔽用一个 `std::set<uint16_t> exclude` 集合列出需要丢弃的 ring 编号。

**ROS**

```cpp
// decoder_RSAIRY.cpp
#pragma once
#include <rs_driver/driver/decoder/decoder_mech.hpp>
#include <iomanip>
// 头部引入 set
#include <set>
......
for (uint16_t chan = 0; chan < this->const_param_.CHANNELS_PER_BLOCK; chan++)
{
  const RSAIRYChannel& channel = block.channels[chan];
  uint16_t chan_id = chan;
  if (lidarModel_ == RSAIRYLidarModel::RSAIRY_CHANNEL_96 && (blk % 2) == 1)
  {
    chan_id = chan + 48;
  }

  // 指定不连续通道进行屏蔽
  static const std::set<uint16_t> exclude = {0, 7, 15, 42, 88};  // 填入需要屏蔽的 ring
  if (exclude.count(this->chan_angles_.toUserChan(chan_id))) continue;
  //

  double chan_ts = block_ts + this->mech_const_param_.CHAN_TSS[chan_id];
  ......
```

**ROS2**

```cpp
// decoder_RSAIRY.cpp
for (uint16_t chan = 0; chan < this->const_param_.CHANNELS_PER_BLOCK; chan++)
{
  const RSAIRYChannel& channel = block.channels[chan];
  uint16_t chan_id = chan;
  if (lidarModel_ == RSAIRYLidarModel::RSAIRY_CHANNEL_96 && (blk % 2) == 1)
  {
    chan_id = chan + 48;
  }

  // 指定不连续通道进行屏蔽
  uint16_t ring = this->chan_angles_.toUserChan(chan_id);
  bool drop = (ring == 0 || ring == 7 || ring == 15 || ring == 42 || ring == 88);
  //

  double chan_ts = block_ts + this->mech_const_param_.CHAN_TSS[chan_id];
  ......
  float distance = u16Distance * this->const_param_.DISTANCE_RES;
  // 添加对于 drop 点的条件判断（下行开头的 !drop && 为新增部分）
  if (!drop && this->distance_section_.in(distance) && this->scan_section_.in(angle_horiz_final))
```

### 屏蔽连续通道

连续通道区域的屏蔽只需要一条 `ring > 90` 之类的范围判断。

**ROS**

```cpp
// decoder_RSAIRY.cpp
#pragma once
#include <rs_driver/driver/decoder/decoder_mech.hpp>
#include <iomanip>
......
for (uint16_t chan = 0; chan < this->const_param_.CHANNELS_PER_BLOCK; chan++)
{
  const RSAIRYChannel& channel = block.channels[chan];
  uint16_t chan_id = chan;
  if (lidarModel_ == RSAIRYLidarModel::RSAIRY_CHANNEL_96 && (blk % 2) == 1)
  {
    chan_id = chan + 48;
  }

  // 指定连续通道进行屏蔽
  {
    uint16_t ring = this->chan_angles_.toUserChan(chan_id);
    if (ring > 90) continue;   // 填入需要屏蔽的连续通道区域
  }

  double chan_ts = block_ts + this->mech_const_param_.CHAN_TSS[chan_id];
  ......
```

**ROS2**

```cpp
// decoder_RSAIRY.cpp
#pragma once
#include <rs_driver/driver/decoder/decoder_mech.hpp>
#include <iomanip>
......
for (uint16_t chan = 0; chan < this->const_param_.CHANNELS_PER_BLOCK; chan++)
{
  const RSAIRYChannel& channel = block.channels[chan];
  uint16_t chan_id = chan;
  if (lidarModel_ == RSAIRYLidarModel::RSAIRY_CHANNEL_96 && (blk % 2) == 1)
  {
    chan_id = chan + 48;
  }

  // 指定连续通道进行屏蔽
  uint16_t ring = this->chan_angles_.toUserChan(chan_id);
  bool drop = (ring > 90);

  double chan_ts = block_ts + this->mech_const_param_.CHAN_TSS[chan_id];
  ......
  float distance = u16Distance * this->const_param_.DISTANCE_RES;
  // 添加对于 drop 点的条件判断（下行开头的 !drop && 为新增部分）
  if (!drop && this->distance_section_.in(distance) && this->scan_section_.in(angle_horiz_final))
```

---

## Q8：Rviz 播放点云时部分帧的反射率渲染突变

点云播放过程中，偶尔会出现某几帧反射率突然变化的现象。

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/extra/4132839647b10110f88c9150953f94de.jpg').default} alt="Rviz 中需要关闭的反射率渲染选项" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 1: Rviz 中需要关闭的渲染选项</figcaption>
</figure>

这通常是 Rviz 渲染的问题，而非雷达数据异常。在 Rviz 中关闭上图指示的渲染选项，即可避免反射率异常渲染导致的反射率跳变。
