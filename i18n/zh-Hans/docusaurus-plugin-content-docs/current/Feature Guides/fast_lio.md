---
title: FAST-LIO 建图集成
sidebar_position: 4
---

# FAST-LIO 建图集成

## 1. 工程包

适配后的工程包下载：[FAST_LIO_ROBOSENSE.zip](pathname:///downloads/FAST-LIO/FAST_LIO_ROBOSENSE.zip)

使用 Airy 激光雷达在办公室场景下录制的建图效果示例：[ariy_office_slam.mp4](pathname:///downloads/FAST-LIO/ariy_office_slam.mp4)

## 2. 环境依赖

- Ubuntu 16.04 及以上
- 仅支持 ROS1
- PCL 1.8 及以上
- Eigen 3.3.4 及以上

## 3. 编译运行

```bash
user@user:~/FAST_LIO$ catkin_make
user@user:~/FAST_LIO$ source devel/setup.bash
user@user:~/FAST_LIO$ roslaunch fast_lio mapping_rsairy.launch
```

## 4. 参数说明

参数分为两类：

- **常用参数**：建图前请配置好。
- **非常用参数**：建议使用默认值。

### 4.1 robosense_airy.yaml

```yaml
common:
    lid_topic:                        # 激光雷达点云话题
    imu_topic:                        # IMU 数据话题
    time_sync_en: false               # 无法使用外部标定时打开
    time_offset_lidar_to_imu: 0.0     # 激光雷达话题与 IMU 话题时间差
preprocess:
    lidar_type: 5               # 5 为 ROBOSENSE 激光雷达
    scan_line: 96               # 激光雷达激光线数量
    scan_rate: 10               # 点云帧率，Hz
    timestamp_unit: 0           # 点云时间戳单位：0 秒、1 毫秒、2 微秒、3 纳秒
    blind: 2                    # 盲区距离，米

mapping:
    acc_cov: 0.1                # 加速度计协方差
    gyr_cov: 0.1                # 陀螺仪协方差
    b_acc_cov: 0.0001           # 加速度计偏置协方差
    b_gyr_cov: 0.0001           # 陀螺仪偏置协方差
    fov_degree: 360             # 视场角
    det_range: 100.0            # 检测距离
    extrinsic_est_en: false      
    extrinsic_T: [0,0,0]        # 平移矩阵
    extrinsic_R: [1,0,0,        # 旋转矩阵
                  0,1,0,
                  0,0,1]  
publish:
    path_en:  false              # 是否发布路径
    scan_publish_en:  true       # 是否发布点云
    dense_publish_en: true       # 是否发布密集点
    scan_bodyframe_pub_en: true  # 是否发布 IMU 坐标系下的点云

pcd_save:
    pcd_save_en: true            # 是否保存建图点云到 pcd/scans.pcd
    interval: -1                 # 保存点云的间隔：-1 所有帧合一帧，n 为每 n 帧合一帧
```

`extrinsic_T` 与 `extrinsic_R` 描述的是激光雷达与 IMU 之间的外参。每一台速腾激光雷达出厂时都已完成标定，请填入自己设备的实际数值，而不要沿用单位矩阵。关于如何从 DIFOP 解析或从驱动打印外参，以及各型号的默认外参数值，请参见[IMU 数据获取与解析](./imu_guide.md)。

### 4.2 mapping_robosense.launch

```yaml
feature_extract_enable       # 是否启用特征提取，默认关闭
point_filter_num             # 降采样数量
max_iteration                # 最大迭代次数
filter_size_surf             # 控制输入激光点云的下采样程度，值越大，保留的点越少，计算速度越快
filter_size_map              # 控制地图中点云的密度和分辨率，值越大，地图越稀疏，内存占用越少
cube_side_length             # 体素网格的边长
runtime_pos_log_enable       # 是否打印 log
```
