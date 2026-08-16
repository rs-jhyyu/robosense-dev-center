---
title: IMU Data Acquisition and Parsing
sidebar_position: 3
---

# RS-LiDAR IMU Data Acquisition and Parsing

## 1. Overview

### 1.1 IMU data

The output of the Inertial Measurement Unit (IMU) in a RoboSense LiDAR is the attitude information of the IMU inside the product, which can be used to adjust the extrinsic parameters of the customer's product. Currently only five models — Airy, AiryLite, Safety Airy, Fairy and E1/E1R — ship with IMU data, and the extrinsic calibration between the IMU and the LiDAR has already been completed at the factory.

### 1.2 LiDAR and IMU coordinate systems

The origin of the LiDAR coordinate system is defined at the center of the LiDAR base. The IMU coordinate origin does not coincide with the LiDAR coordinate origin. Taking Airy as an example, the mounting direction is opposite to the LiDAR coordinate system: the X axis of the LiDAR coordinate system corresponds to the -Y axis of the IMU coordinate system, the Y axis of the LiDAR coordinate system corresponds to the -X axis of the IMU coordinate system, and the Z axis of the LiDAR coordinate system corresponds to the -Z axis of the IMU coordinate system. In the figure below, red is the LiDAR coordinate system and yellow is the IMU coordinate system.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/imu/image.png').default} alt="Airy LiDAR cutaway view with the red LiDAR coordinate axes and the yellow IMU coordinate axes overlaid" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 1: Airy LiDAR coordinate system and IMU coordinate system</figcaption>
</figure>

## 2. IMU Data Acquisition

### 2.1 IMU data stream protocol output

The LiDAR communicates with the computer over Ethernet using the UDP protocol, and outputs data through the IMU data stream protocol. The factory default port number for RoboSense LiDAR IMU data is 6688 for all models.

IMU data can be obtained by capturing UDP packets. In Wireshark, the captured UDP data can be filtered with `udp.port==6688` or `data.data[0:1]==AA`.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/imu/img_v3_02vh_3531e04b-c6cf-40f4-960e-b5b6dcd868bg.jpg').default} alt="Wireshark capture list filtered on the IMU UDP port" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 2: Filtering IMU data stream packets in Wireshark</figcaption>
</figure>

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/imu/img_v3_02vh_7a83b419-7fbe-45ec-a669-fbc9e35cdb3g.jpg').default} alt="Byte-level view of an IMU data stream packet in Wireshark" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 3: Content of a captured IMU data stream packet</figcaption>
</figure>

### 2.2 Acquisition through the ROS driver

The official RoboSense SDK ([rslidar_sdk v1.5.18](https://github.com/RoboSense-LiDAR/rslidar_sdk/releases/tag/v1.5.18)) provides IMU data parsing. First set `ENABLE_IMU_DATA_PARSE` to `ON` in `CMakeLists.txt`. Then, with the LiDAR connected, run the launch/py file to publish the LiDAR IMU data topic.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/imu/img_v3_02vh_b79296e5-883a-496c-8cdc-94244fc8342g.jpg').default} alt="CMakeLists.txt with the ENABLE_IMU_DATA_PARSE option switched to ON" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 4: Enabling ENABLE_IMU_DATA_PARSE in CMakeLists.txt</figcaption>
</figure>

The detailed steps are as follows.

**ROS1**

1. Run the launch file:

```bash
roslaunch rslidar start.launch
```

2. Run the following command to list the IMU data topic:

```bash
rostopic list
```

3. Run the following command to view real-time IMU data. The returned result is shown in the figure below:

```bash
rostopic echo /rslidar_imu_data
```

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/imu/img_v3_02vh_562062c4-af24-41cb-9574-84ebd6ef31dg.jpg').default} alt="Terminal output of the rslidar_imu_data topic showing linear acceleration and angular velocity" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 5: Acquiring IMU data under ROS1</figcaption>
</figure>

**ROS2**

1. Run the py file:

```bash
ros2 launch rslidar start.py
```

2. Run the following command to list the IMU data topic. The result is the same as in ROS1:

```bash
ros2 topic list
```

3. Run the following command to view real-time IMU data. The result is the same as in ROS1:

```bash
ros2 topic echo /rslidar_imu_data
```

### 2.3 IMU parameter configuration

IMU parameter configuration mainly covers the IMU port number, IMU data output rate, accelerometer range and gyroscope range. After the LiDAR is correctly connected, enter the LiDAR IP (default `192.168.1.200`) in a browser and configure the IMU related parameters under **General Setting**.

1. **ImuCtrl**: determines whether the control interface of the IMU function is enabled. Two states are available: `OFF` and `ON` (default).
2. **ImuPort**: changes the IMU communication port. The value range is 1025 to 65535.
3. **ImuOutput Rate**: changes the message output rate of the IMU data. It can be set to 25 Hz / 100 Hz / 200 Hz, with 200 Hz as the default.
4. **Accel Range**: the maximum acceleration range of the accelerometer. Four options are available: [-2g, 2g] / [-4g, 4g] (default) / [-8g, 8g] / [-16g, 16g].
5. **Gyro Range**: the range of the IMU gyroscope. Four options are available: [-250, 250] dps / [-500, 500] dps (default) / [-1000, 1000] dps / [-2000, 2000] dps.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/imu/img_v3_02vh_7251448e-08d6-4e36-89bf-de72bf25bf4g.jpg').default} alt="Airy web General Setting page showing Imu Ctrl, Imu Port Number, Imu Output Rate, Accel Range and Gyro Range fields" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 6: Airy IMU parameter configuration page</figcaption>
</figure>

## 3. IMU Data Parsing

A complete IMU packet consists of a frame header, a data area and a frame tail. It generally contains the measured acceleration and angular velocity of the X, Y and Z axes, as well as information such as the data output rate and the accelerometer and gyroscope range settings.

1. **Acceleration (AccelX, AccelY, AccelZ)**: the measurement part is obtained in real time through the IMU data stream protocol or the ROS driver. Note that the acceleration values obtained through the IMU data stream protocol are signed raw values. Converting a raw value to an actual value depends on the selected range. For example, with a range of +/-16g, the actual acceleration is:

```text
actual_accel (g) = raw_value * 16 / 32768
```

where g is 9.80665 m/s2.

2. **Angular velocity (GyroX, GyroY, GyroZ)**: the measurement part is obtained in real time through the IMU data stream protocol or the ROS driver. Note that the angular velocity values obtained through the IMU data stream protocol are signed raw values. Converting a raw value to an actual value depends on the selected range. For example, with a range of +/-2000 dps, the actual angular velocity is:

```text
actual_gyro (rad/s) = raw_value * 2000 / 32768 * PI / 180
```

## 4. LiDAR and IMU Extrinsic Calibration

### 4.1 What extrinsic calibration means

The extrinsic calibration between the LiDAR and the IMU aims to solve the rigid spatial transformation between the two sensor coordinate systems. This transformation is usually expressed as a transformation matrix consisting of a rotation matrix and a translation vector. The RoboSense LiDAR-IMU extrinsic calibration aligns the LiDAR coordinate system to the IMU coordinate system. The extrinsic calibration of every LiDAR unit is completed and burned in before it leaves the factory, providing an accurate spatial synchronization reference for subsequent multi-sensor fusion algorithms.

### 4.2 Obtaining the calibrated extrinsics

The extrinsic calibration between a RoboSense LiDAR and its IMU aligns the LiDAR coordinate system to the IMU coordinate system. The result is a matrix representing rotation and translation, which allows algorithms to derive the LiDAR pose from the IMU pose, as follows:

```text
P_imu = T_lidar_to_imu · P_lidar
```

Here `T_lidar_to_imu` is the transformation matrix, derived from the quaternion (`qx`, `qy`, `qz`, `qw`) that represents the rotation from LiDAR to IMU, and the translation (`x`, `y`, `z`) that represents the position offset from LiDAR to IMU. There are three ways to obtain the quaternion and the translation.

**1. Device Information Output Protocol (DIFOP)**

The IMU calibration data unique to each LiDAR unit can be parsed and read from the DIFOP data. For the detailed parsing method, refer to the IMU calibration data section in the appendix of each LiDAR user manual.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/imu/img_v3_02vn_f4cbdc9c-121a-40c4-946d-3034e319bbfg.jpg').default} alt="IMU calibration data fields in the DIFOP protocol table of the user manual" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 7: IMU calibration data</figcaption>
</figure>

**2. Printing from the ROS driver (rslidar_sdk)**

Add the following IMU extrinsic reading code to `rs_sdk/src/source/source_driver.hpp` at the position shown in the figure below, then build and run normally to obtain the IMU calibration extrinsics of each LiDAR unit.

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

In rslidar_sdk [release v1.5.19](https://github.com/RoboSense-LiDAR/rslidar_sdk/releases/tag/v1.5.17) and later this code block has been removed, since it is developer-only code. After adding it, the driver must be rebuilt for it to take effect.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/imu/img_v3_02vk_d8b26a68-4228-4b14-8f7e-86531a6691dg.jpg').default} alt="Location of the IMU extrinsic printing code block in source_driver.hpp" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 8: Where to insert the extrinsic printing code in the driver source</figcaption>
</figure>

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/imu/image20.png').default} alt="Terminal output printing the qx, qy, qz, qw quaternion and the x, y, z translation of the IMU extrinsics" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 9: Calibration extrinsics printed by the ROS driver</figcaption>
</figure>

If all values return 0, the LiDAR device has not been registered with IMU parameters (early samples). Please contact RoboSense in this case.

The quaternion corresponds to `extrinsic_Q`, and the xyz translation corresponds to `extrinsic_T`. For the quaternion to take effect, `extrinsic_R` must be all zeros. In the `.yaml` file of a SLAM algorithm, they look like this:

```yaml
extrinsic_Q: [qx,qy,qz,qw]      # quaternion - qx,qy,qz,qw (effective without rotation matrix)
extrinsic_T: [x,y,z]            # translation matrix
extrinsic_R: [0,0,0,            # rotation matrix
              0,0,0,
              0,0,0]
```

If you prefer to use the traditional `extrinsic_T` and `extrinsic_R` instead of a quaternion, please use a proper conversion tool.

**3. Default calibration extrinsics**

The following are the default calibration extrinsics of several RoboSense LiDAR models:

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

### 4.3 Applying the calibrated extrinsics

For a common algorithm such as FAST-LIO, simply convert the quaternion into a rotation matrix and fill it into `extrinsic_R`. When using a SLAM (Simultaneous Localization and Mapping) algorithm such as FAST-LIO, `extrinsic_R` usually refers to the extrinsic rotation matrix. This matrix describes the rotation of the sensor (LiDAR, camera, etc.) relative to a reference coordinate system, while `extrinsic_T` is the translation vector.

## 5. FAQ

**1. Why is the angular velocity not 0 when the LiDAR is stationary?**

Because of temperature, noise, installation errors and even the rotation of the Earth, the IMU still produces a certain angular velocity when stationary. The zero-bias error is therefore compensated automatically by the algorithm to ensure the accuracy of the IMU data.

**2. Why is the angular velocity still not 0 after compensation?**

The printed value is already the compensated angular velocity. It is currently non-zero but very close to 0, because some unknown tiny noise cannot be fully compensated. The value can therefore only approach 0 rather than be exactly 0.

**3. When stationary, why is the Z-axis acceleration negative, around -9.18 m/s2?**

The Z axis of the IMU coordinate system points toward the ground. When stationary, the IMU acceleration is equivalent to gravitational acceleration and points in the same direction, so it seems that it should be +9.18 m/s2. In reality, an accelerometer measures the acceleration of the object itself, and the output at rest is essentially the equivalent acceleration needed to counteract gravity (in the direction of the supporting force). This is a conceptual difference between the direction of the force and the direction in which the force is applied, so it is not exactly equal to gravitational acceleration.
