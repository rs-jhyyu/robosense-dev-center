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

参见：[IMU 外参说明](./imu_extrinsic_parameters.md)。

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
