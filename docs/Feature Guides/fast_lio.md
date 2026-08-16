---
title: FAST-LIO Mapping Integration
sidebar_position: 4
---

# FAST-LIO Mapping Integration

## 1. Project Package

Download the adapted project package here: [FAST_LIO_ROBOSENSE.zip](pathname:///downloads/FAST-LIO/FAST_LIO_ROBOSENSE.zip)

A sample mapping result recorded in an office with an Airy LiDAR: [ariy_office_slam.mp4](pathname:///downloads/FAST-LIO/ariy_office_slam.mp4)

## 2. Environment Requirements

- Ubuntu 16.04 or later
- ROS1 only
- PCL 1.8 or later
- Eigen 3.3.4 or later

## 3. Build and Run

```bash
user@user:~/FAST_LIO$ catkin_make
user@user:~/FAST_LIO$ source devel/setup.bash
user@user:~/FAST_LIO$ roslaunch fast_lio mapping_rsairy.launch
```

## 4. Parameter Description

Parameters fall into two groups:

- **Common parameters**: configure these before mapping.
- **Uncommon parameters**: keeping the default values is recommended.

### 4.1 robosense_airy.yaml

```yaml
common:
    lid_topic:                        # LiDAR point cloud topic
    imu_topic:                        # IMU data topic
    time_sync_en: false               # enable when external calibration is unavailable
    time_offset_lidar_to_imu: 0.0     # time offset between the LiDAR topic and the IMU topic
preprocess:
    lidar_type: 5               # 5 stands for RoboSense LiDAR
    scan_line: 96               # number of LiDAR laser lines
    scan_rate: 10               # point cloud frame rate, Hz
    timestamp_unit: 0           # point cloud timestamp unit: 0 second, 1 millisecond, 2 microsecond, 3 nanosecond
    blind: 2                    # blind zone distance, meter

mapping:
    acc_cov: 0.1                # accelerometer covariance
    gyr_cov: 0.1                # gyroscope covariance
    b_acc_cov: 0.0001           # accelerometer bias covariance
    b_gyr_cov: 0.0001           # gyroscope bias covariance
    fov_degree: 360             # field of view
    det_range: 100.0            # detection range
    extrinsic_est_en: false      
    extrinsic_T: [0,0,0]        # translation matrix
    extrinsic_R: [1,0,0,        # rotation matrix
                  0,1,0,
                  0,0,1]  
publish:
    path_en:  false              # whether to publish the path
    scan_publish_en:  true       # whether to publish the point cloud
    dense_publish_en: true       # whether to publish dense points
    scan_bodyframe_pub_en: true  # whether to publish the point cloud in the IMU coordinate system

pcd_save:
    pcd_save_en: true            # whether to save the mapped point cloud to pcd/scans.pcd
    interval: -1                 # point cloud saving interval: -1 merges all frames into one, n merges every n frames
```

`extrinsic_T` and `extrinsic_R` describe the extrinsics between the LiDAR and the IMU. Each RoboSense LiDAR is calibrated at the factory, so fill in the values of your own device instead of the identity matrix. For how to read the extrinsics from DIFOP or print them from the driver, and for the default values of each model, see [IMU Data Acquisition and Parsing](./imu_guide.md).

### 4.2 mapping_robosense.launch

```yaml
feature_extract_enable       # whether to enable feature extraction, disabled by default
point_filter_num             # downsampling count
max_iteration                # maximum number of iterations
filter_size_surf             # controls the downsampling level of the input point cloud; the larger the value, the fewer points are kept and the faster the computation
filter_size_map              # controls the density and resolution of the point cloud in the map; the larger the value, the sparser the map and the lower the memory usage
cube_side_length             # side length of the voxel grid
runtime_pos_log_enable       # whether to print the log
```
