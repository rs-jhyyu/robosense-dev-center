---
title: FastDDS Shared Memory (ROS2)
sidebar_label: ROS2 Frame Rate Drop (FastDDS Shared Memory)
---
# FastDDS Shared Memory Solution under ROS2

This test was conducted on a computer with Ubuntu 22.04, using ROS2 Humble and FastDDS as the middleware.

By increasing the shared memory buffer size through the XML configuration file of FastDDS, the subscription frame rate for LiDAR was stabilized after testing.

## 1. Configure the FastDDS shared memory XML file

Save it as `~/.config/fastdds_shm.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<profiles xmlns="http://www.eprosima.com/XMLSchemas/fastRTPS_Profiles">
    <participant profile_name="participant_profile_ros2"
is_default_profile="true">
        <rtps>
            <name>profile_for_ros2_context</name>

            <sendSocketBufferSize>104857600</sendSocketBufferSize>
            <listenSocketBufferSize>104857600</listenSocketBufferSize>
        </rtps>
    </participant>
    <data_writer profile_name="default publisher profile"
is_default_profile="true">

        <historyMemoryPolicy>DYNAMIC</historyMemoryPolicy>
    </data_writer>

    <data_reader profile_name="default subscription profile"
is_default_profile="true">

        <historyMemoryPolicy>DYNAMIC</historyMemoryPolicy>
    </data_reader>

    <data_writer profile_name="/rslidar_points">
        <qos>
            <publishMode>
                <kind>ASYNCHRONOUS</kind>
            </publishMode>
            <data_sharing>
                <kind>AUTOMATIC</kind>
            </data_sharing>
        </qos>

        <historyMemoryPolicy>DYNAMIC</historyMemoryPolicy>
    </data_writer>

    <data_reader profile_name="/rslidar_points">
        <qos>
            <data_sharing>
                <kind>AUTOMATIC</kind>
            </data_sharing>

        </qos>
        <historyMemoryPolicy>DYNAMIC</historyMemoryPolicy>
    </data_reader>
</profiles>
```

## 2. Publish point cloud via XML in ROS2

```shell-session
user@user:~$ export RMW_IMPLEMENTATION=rmw_fastrtps_cpp
user@user:~$ export FASTRTPS_DEFAULT_PROFILES_FILE=~/.config/fastdds_shm.xml
user@user:~$ export RMW_FASTRTPS_USE_QOS_FROM_XML=1
user@user:~$ source install/setup.bash
user@user:~$ ros2 launch rslidar_sdk start.py
```

It is necessary to ensure that FastDDS is installed. The command is as follows:

```bash
sudo apt install ros-humble-rmw-fastrtps-cpp
```

## 3. Start the subscriber node

```bash
ros2 topic hz /rslidar_points
```

## 4. Verify that the shared memory size takes effect

![Shared memory size verification — frame rate output](./images/fastdds_1.png)

Among them, 201M is the shared memory size we set, at which point the frame rate is basically stable at 10 Hz.

![Stable 10 Hz frame rate with shared memory enabled](./images/fastdds_2.png)
