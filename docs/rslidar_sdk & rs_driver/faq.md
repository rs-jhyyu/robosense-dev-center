---
title: FAQ
sidebar_label: SDK & Driver FAQ
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

See: [IMU Data Acquisition and Parsing](../Feature Guides/imu_guide.md).

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

---

## Q6: How to publish the IMU extrinsic parameters as a topic

The IMU extrinsic calibration data of Airy/Fairy consists of a quaternion and an offset. Besides printing it to the terminal, it can also be published as a dedicated topic. For background, see [IMU Data Acquisition and Parsing](../Feature Guides/imu_guide.md).

Implementation: open the `src/source/source_driver.hpp` file and insert the code below at the indicated positions. The implementation works with both ROS and ROS2, uses `std::call_once` to make sure the publisher is initialized only once, and publishes to the topic `rslidar_imu_calib`.

```cpp
#pragma once

#include "source/source.hpp"

#include <rs_driver/api/lidar_driver.hpp>
#include <rs_driver/utility/sync_queue.hpp>
// added
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

    // added
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
This method supports both Airy and Fairy.
:::

---

## Q7: How to mask specified channels

For mechanical LiDARs, specified channels can be masked by modifying the decoder source file that corresponds to the model. The usual access path is `/rslidar_sdk/src/rs_driver/src/rs_driver/driver/decoder`. Taking Airy as an example:

### Masking discontinuous channels

To mask discontinuous channels, list the ring numbers to be dropped in a `std::set<uint16_t> exclude` set.

**ROS**

```cpp
// decoder_RSAIRY.cpp
#pragma once
#include <rs_driver/driver/decoder/decoder_mech.hpp>
#include <iomanip>
// include set in the header section
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

  // mask the specified discontinuous channels
  static const std::set<uint16_t> exclude = {0, 7, 15, 42, 88};  // fill in the rings to be masked
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

  // mask the specified discontinuous channels
  uint16_t ring = this->chan_angles_.toUserChan(chan_id);
  bool drop = (ring == 0 || ring == 7 || ring == 15 || ring == 42 || ring == 88);
  //

  double chan_ts = block_ts + this->mech_const_param_.CHAN_TSS[chan_id];
  ......
  float distance = u16Distance * this->const_param_.DISTANCE_RES;
  // add the condition check for dropped points (the leading !drop && below is the addition)
  if (!drop && this->distance_section_.in(distance) && this->scan_section_.in(angle_horiz_final))
```

### Masking continuous channels

Masking a continuous range of channels only requires a range check such as `ring > 90`.

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

  // mask the specified continuous channels
  {
    uint16_t ring = this->chan_angles_.toUserChan(chan_id);
    if (ring > 90) continue;   // fill in the continuous channel range to be masked
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

  // mask the specified continuous channels
  uint16_t ring = this->chan_angles_.toUserChan(chan_id);
  bool drop = (ring > 90);

  double chan_ts = block_ts + this->mech_const_param_.CHAN_TSS[chan_id];
  ......
  float distance = u16Distance * this->const_param_.DISTANCE_RES;
  // add the condition check for dropped points (the leading !drop && below is the addition)
  if (!drop && this->distance_section_.in(distance) && this->scan_section_.in(angle_horiz_final))
```

---

## Q8: Sudden reflectivity rendering changes in some frames during Rviz playback

During point cloud playback, the reflectivity of a few frames occasionally changes abruptly.

<figure className="doc-figure">
  <img src={require('./images/extra/4132839647b10110f88c9150953f94de.jpg').default} alt="The reflectivity rendering option in Rviz that needs to be disabled" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 1: The rendering option in Rviz that needs to be disabled</figcaption>
</figure>

This is usually an Rviz rendering issue rather than a problem with the LiDAR data. Disabling the rendering option indicated in the figure above in Rviz avoids the reflectivity jumps caused by abnormal reflectivity rendering.
