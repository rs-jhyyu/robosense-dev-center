---
title: Recording Point Clouds as PCD
sidebar_position: 5
---

# Recording Point Clouds as PCD

This guide explains how to record a ROS point cloud topic and save it in `.pcd` format for further processing.

Looking for other ways to export data? See [Advanced Operations](./advanced_operations.md) for exporting PCD/CSV from RSView, [Network Connection and Wireshark Capture](../Getting Started/network_and_wireshark.md) for capturing raw `.pcap` packets, and [rs_driver User Guide](../rslidar_sdk & rs_driver/rs_driver_user_guide.md) for the built-in `rs_driver_pcdsaver` tool.

## Step 1: Get the point cloud topic name

In Rviz, click the topic in the left panel to read the point cloud topic name. Alternatively, run `rostopic list` to list all current topics and locate the one you want to record.

<figure className="doc-figure">
  <img src={require('./images/recording/image_1.png').default} alt="Rviz left panel showing the point cloud topic name" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 1: Reading the point cloud topic name in Rviz</figcaption>
</figure>

## Step 2: Create or enter the target directory

Use `cd` to enter the directory where the point cloud files should be saved, or right-click inside the folder and open a terminal there.

Both `rosbag` and `rosrun pcl_ros pointcloud_to_pcd input:=<topic>` save their output to the current working directory of the terminal that runs the command.

## Step 3: Record the point cloud

### Method 1: Record directly to PCD

Use the following command to record the point cloud as PCD files:

```bash
rosrun pcl_ros pointcloud_to_pcd input:=<topic>
```

Using the topic obtained in Step 1 as an example:

```bash
rosrun pcl_ros pointcloud_to_pcd input:=/bp_points3
```

<figure className="doc-figure">
  <img src={require('./images/recording/image.png').default} alt="Terminal running pointcloud_to_pcd and writing PCD files" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 2: Recording point clouds to PCD files</figcaption>
</figure>

Recording starts as soon as you press Enter. Press `Ctrl+C` to stop recording and save the files.

### Method 2: Record a bag first, then convert

Record the point cloud topic into a `.bag` file with `rosbag`, then convert it to `.pcd`:

```bash
rosbag record <topic>
rosrun pcl_ros bag_to_pcd <inputfile.bag> <topic> <output_directory>
```
