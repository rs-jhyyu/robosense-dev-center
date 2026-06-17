---
title: FAQ
sidebar_position: 6
---
# FAQ

Here are some common usage issues encountered while using `rslidar_sdk` and `rs_driver`. If you run into them, you can troubleshoot on your own using the guidance below.

---

## Q1: Persistent MSOP_TIMEOUT or DIFOP_TIMEOUT errors in the node terminal

When using the SDK or Driver for the first time, it is common to encounter a situation where the LiDAR is properly connected and data transmission is normal, but rviz cannot display the point cloud, and the terminal returns the error codes **MSOP_TIMEOUT / DIFOP_TIMEOUT**. This is usually caused by the firewall not being disabled. Users can refer to the common firewalls listed below and use the commands to disable them.

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

## Q2: How to print IMU data information for Airy/Fairy

During the use of the SDK, in addition to the angular velocity and linear velocity data contained in IMU-related topics, the specific values of the quaternion and offset in the Airy/Fairy IMU can also be printed via the SDK.

See: [IMU Extrinsic Parameters Instructions](./imu_extrinsic_parameters.md).

---

## Q3: How to solve the data frequency reduction (frame rate drop) issue based on ROS2

During the use of the SDK, due to the influence of the ROS2 communication mechanism, the published topic frequency may be lower than the normal frequency of the LiDAR, possibly dropping to 5 Hz or even 1 Hz. There are generally two solutions to this problem:

1. Refer to the solutions for the frequency reduction issue provided in the SDK's own documentation. See **Table 2.1** in the [Configuration Guide](./configuration_guide.md) for details.
2. For some cases that cannot be resolved by the methods proposed in Table 2.1, a shared memory solution based on FastDDS can be considered: [FastDDS shared memory solution under ROS2](./fastdds_shared_memory.md).

---

## Q4: How to modify node names to prevent conflicts between master and slave machines

In a multi-machine ROS system, if the distributed communication mechanism is not correctly configured, different devices will use the same node names and topic names by default when starting nodes. When the master starts the LiDAR driver, the new node will attempt to register a node with the same name or publish a topic with the same name, causing the ROS master to perceive a conflict and forcibly terminate the original driver node on the slave machine, resulting in the slave driver exiting unexpectedly.

Users encountering such issues can usually avoid conflicts by modifying the node names and topic names.

* **Node name modification** — Modify `name='rslidar_sdk_node'` in `rslidar_sdk/src/launch/start.launch` to avoid node name conflicts.
* **Topic name modification** — Modify the topic names in the `config.yaml` file to avoid topic conflicts when using multiple LiDARs within one single node.

---

## Q5: How to filter out the FOV at specified discontinuous horizontal angles for mechanical LiDAR

This modification needs to be made in the corresponding mechanical LiDAR source code file. The usual access path is `/rslidar_sdk/src/rs_driver/src/rs_driver/driver/decoder`.

Taking Airy as an example, to specify the horizontal FOV range to be displayed as 0°–90° and 270°–360°, the example code is as follows (**the bolded conditions in the comment are the modified code**):

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
