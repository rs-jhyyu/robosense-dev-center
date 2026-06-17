# rslidar\_sdk\&\&rs\_driver UserGuide

# **Project Module Introduction**

rslidar\_sdk is a LiDAR driver software package developed by RoboSense for the Ubuntu environment\. It includes:：

- The driver kernel: **rs\_driver**

- ROS extension features \(supports Ubuntu 16\.04, Ubuntu 18\.04, Ubuntu 20\.04\)

- ROS extension features \(supports Ubuntu 16\.04, Ubuntu 18\.04, Ubuntu 20\.04\)

The SDK and driver versions in the current GitHub repository only support the LiDAR products listed in **Table 1\.1**\. For SDK usage requirements with other LiDAR products in **Table 1\.2**, please contact RoboSense technical support to obtain the corresponding version of the software package\.

**Table 1\.1 ****LiDAR models supported by the SDK in GitHub**

|RS\-LiDAR\-16|RS\-Ruby\-80|
|---|---|
|RS\-LiDAR\-32|RS\-Ruby\-Plus\-128|
|RS\-Bpearl|RS\-Ruby\-Plus\-80|
|RS\-Helios|RS\-Ruby\-Plus\-48|
|RS\-Helios\-16P|RS\-LiDAR\-M1|
|RS\-Ruby\-128|RS\-LiDAR\-M2|
|RS\-LiDAR\-E1|RS\-LiDAR\-M3|
|RS\-LiDAR\-Airy|RS\-LiDAR\-MX|
|RS\-LiDAR\-Fairy|RS\-LiDAR\-EMX|

**Table 1\.2 ****Additional supported LiDAR models**

|RS\-LiDAR\-EM4|RS\-LiDAR\-AiryLite|
|---|---|



---

# **Official Documentation Guide**

## **Basic Parameters**

Taking the `config.yaml` file of SDK version 1\.5\.19 as an example \(**Figure 2\.1**\), the default parameter configuration when connecting to an Airy LiDAR online is as follows:

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=Yzk1NTAxODdiNDUwMjZkNTUwODdjNGE0ZjJmNmRhYjlfNTVhMjQzNzU5YzFhZWI4ZDU5ODhjZjZjNGNjNTJiN2FfSUQ6NzYyOTkxNTA0MzAyMjM0MzM5M18xNzgxNjU4NTE4OjE3ODE3NDQ5MThfVjM)

**Figure 2\.1 ****Common parameters and introduction**

In addition to the above parameters, the SDK software package also includes editable advanced parameters\. Users can obtain detailed explanations of both basic and advanced parameters in the `rslidar_sdk/doc/intro` path within the software package\.

## **Advanced Usage**

In various practical application scenarios of the SDK, advanced operations such as loading offline PCAP files or connecting multiple LiDARs may be required\. For ease of use, the SDK software package provides relevant documentation for reference\. See **Table 2\.1** for details\.

**Table 2\.1 ****Common advanced usages of the SDK and links to documentation**

|**Advanced Usage**|**Github Link**|
|---|---|
|How to change point type|[https://github\.com/RoboSense\-LiDAR/rslidar\_sdk/blob/main/doc/howto/05\_how\_to\_change\_point\_type\.md](https://github.com/RoboSense-LiDAR/rslidar_sdk/blob/main/doc/howto/05_how_to_change_point_type.md)|
|How to decode online LiDAR|[https://github\.com/RoboSense\-LiDAR/rslidar\_sdk/blob/main/doc/howto/06\_how\_to\_decode\_online\_lidar\.md](https://github.com/RoboSense-LiDAR/rslidar_sdk/blob/main/doc/howto/06_how_to_decode_online_lidar.md)|
|Online LiDAR \- Advanced Topics<br>\(e\.g\. Multiple LiDARS\)|[https://github\.com/RoboSense\-LiDAR/rslidar\_sdk/blob/main/doc/howto/07\_online\_lidar\_advanced\_topics\.md](https://github.com/RoboSense-LiDAR/rslidar_sdk/blob/main/doc/howto/07_online_lidar_advanced_topics.md)|
|How to decode PCAP file|[https://github\.com/RoboSense\-LiDAR/rslidar\_sdk/blob/main/doc/howto/08\_how\_to\_decode\_pcap\_file\.md](https://github.com/RoboSense-LiDAR/rslidar_sdk/blob/main/doc/howto/08_how_to_decode_pcap_file.md)|
|PCAP File \- Advanced Topics|[https://github\.com/RoboSense\-LiDAR/rslidar\_sdk/blob/main/doc/howto/09\_pcap\_file\_advanced\_topics\.md](https://github.com/RoboSense-LiDAR/rslidar_sdk/blob/main/doc/howto/09_pcap_file_advanced_topics.md)|
|How to use coordinate transformation|[https://github\.com/RoboSense\-LiDAR/rslidar\_sdk/blob/main/doc/howto/10\_how\_to\_use\_coordinate\_transformation\.md](https://github.com/RoboSense-LiDAR/rslidar_sdk/blob/main/doc/howto/10_how_to_use_coordinate_transformation.md)|
|How to record and replay Packet rosbag|[https://github\.com/RoboSense\-LiDAR/rslidar\_sdk/blob/main/doc/howto/11\_how\_to\_record\_replay\_packet\_rosbag\.md](https://github.com/RoboSense-LiDAR/rslidar_sdk/blob/main/doc/howto/11_how_to_record_replay_packet_rosbag.md)|
|How to solve ROS2\_humble frame rate drop|[https://github\.com/RoboSense\-LiDAR/rslidar\_sdk/blob/main/doc/howto/13\_how\_to\_solve\_ROS2\_humble\_frame\_rate\_drop\.md](https://github.com/RoboSense-LiDAR/rslidar_sdk/blob/main/doc/howto/13_how_to_solve_ROS2_humble_frame_rate_drop.md)|

In addition to the SDK\-related documentation, the core Driver also provides relevant advanced usages and instructions\. See **Table 2\.2**\.

**Table 2\.2 ****Common advanced usages of the Driver and links to documentation**

|**Advanced Usage**|**Github Link**|
|---|---|
|Introduction to rs\_driver CMake macros|[https://github\.com/RoboSense\-LiDAR/rs\_driver/blob/main/doc/intro/05\_cmake\_macros\_intro\.md](https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/intro/05_cmake_macros_intro.md)|
|SDK/Driver Common error codes|[https://github\.com/RoboSense\-LiDAR/rs\_driver/blob/main/doc/intro/06\_error\_code\_intro\.md](https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/intro/06_error_code_intro.md)|
|How to visualize point cloud|[https://github\.com/RoboSense\-LiDAR/rs\_driver/blob/main/doc/howto/14\_how\_to\_use\_rs\_driver\_viewer\.md](https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/howto/14_how_to_use_rs_driver_viewer.md)|
|How to transform point cloud|[https://github\.com/RoboSense\-LiDAR/rs\_driver/blob/main/doc/howto/15\_how\_to\_transform\_pointcloud\.md](https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/howto/15_how_to_transform_pointcloud.md)|
|How to compile rs\_driver on WIndows|[https://github\.com/RoboSense\-LiDAR/rs\_driver/blob/main/doc/howto/16\_how\_to\_compile\_on\_windows\.md](https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/howto/16_how_to_compile_on_windows.md)|
|How to avoid Packet Loss|[https://github\.com/RoboSense\-LiDAR/rs\_driver/blob/main/doc/howto/17\_how\_to\_avoid\_packet\_loss\.md](https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/howto/17_how_to_avoid_packet_loss.md)|
|Point Type and Point Layout  |[https://github\.com/RoboSense\-LiDAR/rs\_driver/blob/main/doc/howto/18\_about\_point\_layout\.md](https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/howto/18_about_point_layout.md)|
|Splitting Rule|[https://github\.com/RoboSense\-LiDAR/rs\_driver/blob/main/doc/howto/19\_about\_splitting\_frame\.md](https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/howto/19_about_splitting_frame.md)|
|CPU Usage and Memory Usage|[https://github\.com/RoboSense\-LiDAR/rs\_driver/blob/main/doc/howto/20\_about\_usage\_of\_cpu\_and\_memory\.md](https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/howto/20_about_usage_of_cpu_and_memory.md)|
|How to Parse DIFOP Packet|[https://github\.com/RoboSense\-LiDAR/rs\_driver/blob/main/doc/howto/21\_how\_to\_parse\_difop\.md](https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/howto/21_how_to_parse_difop.md)|



---

# **rslidar\_sdk User Guide**

## **Environment Dependencies**

- **ROS**

To use the SDK in a ROS environment, the ROS dependency libraries need to be installed\.

Ubuntu 16\.04 —— ROS Kinetic desktop

Ubuntu 18\.04 —— ROS Melodic desktop

Ubuntu 20\.04 —— ROS Noetic desktop

For installation instructions, refer to: [ROS Installation](http://wiki.ros.org)

- **ROS2**

To use the SDK in a ROS2 environment, the ROS2 dependency libraries need to be installed\.

Ubuntu 18\.04 \- ROS2 Eloquent desktop

Ubuntu 20\.04 \- ROS2 Galactic desktop

Ubuntu 22\.04 \- ROS2 Humble desktop

For installation instructions, refer to: [ROS2 Installation](https://index.ros.org/doc/ros2/Installation/Eloquent/Linux-Install-Debians/)

- **yaml**

The installed dependency package must meet **version ≥ v0\.5\.2**\. If **ROS desktop\-full** is already installed, this step can be skipped\. The installation command is as follows::

```Bash
user@user:~$ sudo apt-get update
user@user:~$ sudo apt-get install -y libyaml-cpp-de
```

- **libpcap**

The installed dependency package must meet **version ≥ v1\.7\.4\. **The installation command is as follows:

```Bash
user@user:~$ sudo apt-get update
user@user:~$ sudo apt-get install -y  libpcap-dev
```

- **Notes:**

    1. It is recommended to install the ROS desktop\-full version\. This installation process will automatically install compatible versions of dependency libraries \(e\.g\., PCL\)\. This avoids issues such as missing necessary dependencies or spending significant time on independent installations

    2. **Ubuntu 22\.04 **no longer supports ROS\. Therefore, on this system version, users can compile by executing the follwoing command

```Bash
user@user:~$ echo "deb [trusted=yes arch=amd64] http://deb.repo.autolabor.com.cn jammy main" | sudo tee /etc/apt/sources.list.d/autolabor.list
user@user:~$ sudo apt update
user@user:~$ sudo apt install ros-noetic-autolabor
```

or use ROS2 \(suggested\)

1. **Please do not install both ROS and ROS2 on the same computer**

2. **Ubuntu 24\.04 **has been tested to support `rslidar_sdk` based on ROS2, but Ubuntu 22\.04 or earlier versions are still recommended

3. All third\-party libraries that  `rslidar_sdk`  depends on provide versions supported under the ARM architecture, allowing compilation, installation, and usage on ARM；



## **Compilation and Run**

- **Obtaining the project files**

It is recommended to use the `git` command to pull the project files directly from the GitHub repository to ensure the timeliness and completeness of the project version

```Bash
user@user:~/workspace$ git clone https://github.com/RoboSense-LiDAR/rslidar_sdk.git
user@user:~/workspace$ cd rslidar_sdk                             
user@user:~/workspace$ git submodule init                         
user@user:~/workspace$ git submodule update                       
```

In addition to the above method, users can directly visit [Official Repository](https://github.com/RoboSense-LiDAR/rslidar_sdk/releases) to download the latest version of the software package `rslidar_sdk.tar.gz`\. 

**Note**: Downloading the Source Code directly will result in a missing submodule `rs_driver`, leading to compilation and installation failure\.



- **Compilation and run based on ROS**

It is recommended to create a new folder in the home directory of the local machine as a workspace, and then create a `src` folder within that workspace\. Place the pulled `rslidar_sdk` project files into the `src` folder: `~/workspace/src/rslidar_sdk`

Return to the workspace directory \(e\.g\., `~/workspace`\) and execute the following commands to compile and install\. Please ensure being in a ROS environment during execution\.

```Bash
user@user:~/workspace$ catkin_make                                   
user@user:~/workspace$ source devel/setup.bash                       
user@user:~/workspace$ roslaunch rslidar_sdk start.launch             
```

**Note: **If using zsh, replace the second command with `source devel/setup.zsh`



- **Compilation and run based on ROS2**

For compilation and installation based on ROS2, the `rslidar_msg` project files need to be additionally obtained to define the LiDAR packet messages in the ROS2 environment\. The download link is as below: [https://github\.com/RoboSense\-LiDAR/rslidar\_msg](https://github.com/RoboSense-LiDAR/rslidar_msg)\. After downloading, place it in the `src` folder, alongside the `rslidar_sdk` project files\.

Return to the workspace directory \(e\.g\., `~/workspace`\) and execute the following commands to compile and run\. Ensure that you are in a ROS2 environment during execution\.

```Bash
user@user:~/workspace$ colcon build                                   
user@user:~/workspace$ source install/setup.bash                      
user@user:~/workspace$ ros2 launch rslidar_sdk start.py               
```

**Note: **If using zsh, replace the second command with `source install/setup.zsh`



**Before running the SDK, first ensure that the LiDAR is connected correctly and the common parameters are entered correctly\.**



## **LiDAR Connection** 

- Download and install **Wireshark** to view network port packets\.

```Bash
user@user:~$ sudo apt-get install wireshark
user@user:~$ sudo wireshark                      
```

- Select the corresponding network interface card to view packet status\. The common network interface card name under Ubuntu is `eno1` \(**Figure 3\.1**\)

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MDhlZWIwNWJlMDIyYTU4NzdkNThjZTdlYzY0NzEzZWZfMGQ4YzhjMGI3NWJhOGYyY2ZmYmJkYTczMDViZmYzZDhfSUQ6NzYyOTkxMjY3OTE2MzE1MzYyNl8xNzgxNjU4NTE4OjE3ODE3NDQ5MThfVjM)

**Figure 3\.1 Home Page Options Area of Wireshark**

- Enter the capture interface of the corresponding network port\. If no UDP data is visible, check the LiDAR ARP packets\. Based on the content prompt \(***Who has\.\.\.***\), modify the static IP of the host's network interface card to the destination IP of the LiDAR data\.

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MTg5ZDNmYzQ2YjAxMTIzZWZkYzdkYzc0NGJmMWE5NGFfYzViODJhMjkwMjNiNDVlMmJiODY0ODhmNjU2NTI1Y2JfSUQ6NzYyOTkyOTY0ODk0ODA1NTIxOF8xNzgxNjU4NTE4OjE3ODE3NDQ5MThfVjM)

**Figure 3\.2 Wireshark packet capture interface — ARP packets**

- Modify the host static address to the LiDAR destination address, and check whether the modified parameters take effect\. An example of the modification command is as follows:

```Bash
user@user:~$ sudo ifconfig eno1 192.168.1.102          
user@user:~$ ifconfig                                  
```

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=NTc3MGIzMDU0NjQ4OTFjMTRhOTViYWZkZGZlOGIzMDdfMTBmMDI0MDNmYmE5NWNiOWZjNjNhZDNmNTc5ZjhhYjFfSUQ6NzYyOTkzMzc1NTczODQ1OTMyN18xNzgxNjU4NTE4OjE3ODE3NDQ5MThfVjM)

**Figure 3\.3 Modify and Check Host Static Address**

- In the input box of the Wireshark capture interface, enter a command to view the MSOP/DIFOP/IMU port numbers of the LiDAR UDP data\. 

    By default, the LiDAR MSOP port number is 6699, the DIFOP port number is 7788, and the IMU port number is 6688 \(Airy/Fairy Only\)\. Users can also filter and lock the MSOP/DIFOP/IMU data entries using the following command\.

```Bash
data.data[0:1] == 55                             #Filter MSOP Data
data.data[0:1] == a5                             #Filter DIFOP Data
data.data[0:1] == aa                             #Filter IMU Data(Airy/Fairy Only) 
```

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MDkzOTMwYWRjNDg3MzRkMmJmZjZiYTMyZDdlZTM5MWRfYjcyZDk4MzA5ODUxNjhiNWIyNGE2NTRiZTYwYTk3OGJfSUQ6NzYyOTkxMjY3OTExNDU3NTA0OF8xNzgxNjU4NTE4OjE3ODE3NDQ5MThfVjM)

**Figure 3\.4 Filtering only DIFOP data for the LiDAR based on the command**



## **Parameter Configuration**

- **Mechanical LiDAR**

Mechanical LiDARs include the **RS series**, **Ruby series**, **Helios series**, **Bpearl series**, **Airy series**, **Fairy**, and other products\.

Before starting the driver, users need to configure the correct `lidar_type`, `MSOP port`, and `DIFOP port` in the `src/rslidar_sdk/config/config.yaml` file\. The port numbers can be obtained using the methods described above\. The default values are 6699 and 7788, respectively\.

**Note: **

1. The Airy LiDAR additionally supports the acquisition of **IMU calibration data** \(quaternions \& offsets\)\. For details, **refer to section 5\.2**

2. For **AiryLite**, the `lidar_type` should be **RSAIRYLITE\_ETH**



- **Non\-mechanical LiDAR**

Non\-mechanical LiDARs include the** MEMS series**, **E series**, and **EM series**\.

Regarding parameter configuration before starting the driver, non\-mechanical LiDARs are essentially the same as mechanical LiDARs, but an additional note is needed:

For **EM series** products, when filling in the DIFOP port number, the default parameter value is 7766 instead of 7788\. Wrong DIFOP port number can lead to point cloud display failure 



---

# **rs\_driver User Guide**

## **Environment Dependencies**

The operating systems and compilers supported by rs\_driver are as follows:

- **Ubuntu** \(16\.04，18\.04，20\.04\)

    - gcc（4\.8\+）

- **Windows**

    - MSVC（Win10 / VS2019 tested）



Third\-party dependencies:

- **libpcap**（can be ignored if PCAP file parsing is not required\)

- **eigen3** \(can be ignored if built\-in coordinate transformation is not required\)

- **PCL** \(can be ignored if visualization tools are not required\)

- **Boost** \(can be ignored if visualization tools are not required\)

The one‑click installation command is as follows:

```Bash
user@user:~$ sudo apt-get install libpcap-dev libeigen3-dev libboost-dev libpcl-dev
```

## 

## **Compilation and Installation**

Execute the following command to compile and install rs\_driver into the Ubuntu system environment\.

```Bash
user@user:~$ git clone https://github.com/RoboSense-LiDAR/rs_driver.git
user@user:~$ cd rs_driver
user@user:~/rs_driver$ mkdir build && cd build
user@user:~/rs_driver/build$ cmake -DCOMPILE_DEMOS=ON ..             #Compile demo
user@user:~/rs_driver/build$ cmake -DCOMPILE_TOOLS=ON ..             #Compile tool
user@user:~/rs_driver/build$ make -j4
```

- **Using as a third\-party library**

Configure the `CMakeLists.txt` file and use the `find_package()` command to locate the `rs_driver` library and link it\.

```Bash
user@user:~$ find_package(rs_driver REQUIRED)
user@user:~$ include_directories(${rs_driver_INCLUDE_DIRS})
user@user:~$ target_link_libraries(your_project ${rs_driver_LIBRARIES})
```

- **Using as a submodule**

Add `rs_driver` as a submodule to your project, configure the `CMakeLists.txt` file, and use the `find_package()` command to locate the library and link it\.

```Bash
user@user:~$ add_subdirectory(${PROJECT_SOURCE_DIR}/rs_driver)
user@user:~$ find_package(rs_driver REQUIRED)
user@user:~$ include_directories(${rs_driver_INCLUDE_DIRS})
user@user:~$ target_link_libraries(project ${rs_driver_LIBRARIES})
```



## **Tool Usage**

Before using tools related to `rd_driver`, user also need to ensure that the LiDAR is properly connected to the computer\. For specific steps, refer to section 3\.3\.

- **Command to run the example demo**

```Bash
user@user:~$ cd rs_driver/build/demo
user@user:~/rs_driver/build/demo$ ./demo_online                      
user@user:~/rs_driver/build/demo$ ./demo_online_multi_lidars            
user@user:~/rs_driver/build/demo$ ./demo_pcap                        
```

**Note:** The LiDAR parameters in the demo file cannot be changed once compiled\. If users need to change parameters such as **IP address** or **port number**, users must modify the source code file and recompile\. The source code file path is: `rs_driver/demo/demo *.cpp`\.



- **rs\_driver\_viewer**** Tool startup command**

`rs_driver` provides a point cloud visualization tool——`rs_driver_viewer`, which is located in the `rs_driver/tool` directory\. This tool can be used for simple online/offline viewing of point cloud images\. The specific commands and related parameters are as follows:

```Bash
user@user:~$ cd rs_driver/build/tool
user@user:~/rs_driver/build/tool$ ./rs_driver_viewer -h                 
---------------------------------------------------------------
                  RS_Driver Viewer Version: v1.5.*
---------------------------------------------------------------
Arguments: 
 -type  = LiDAR type
 -pcap  = The path of the pcap file, off-line mode if it is true.
 -msop  = LiDAR msop port number,the default value is 6699
 -difop = LiDAR difop port number,the default value is 7788
 -group = LiDAR destination group address if multi-cast mode.
 -host  = Host address.
 -x     = Transformation parameter, unit: m 
 -y     = Transformation parameter, unit: m 
 -z     = Transformation parameter, unit: m 
 -roll = Transformation parameter, unit: radian 
 -pitch = Transformation parameter, unit: radian 
 -yaw   = Transformation parameter, unit: radian 
```

Example of visualization tool command:

```Bash
user@user:~/rs_driver/build/tool$ ./rs_driver_viewer -type Airy -msop 6699 -difop 7788
#Online Airy，MSOP 6699,DIFOP 7788
```



- **rs\_driver\_pcdsaver**** startup command**

`rs_driver` also provides a point cloud PCD format conversion tool——`rs_driver_pcdsaver`, which is also located in the `rs_driver/tool` directory\. This tool can be used for simple online/offline conversion of point cloud images to PCD format files\. The specific commands and related parameters are as follows：

```Bash
user@user:~$ cd rs_driver/build/tool
user@user:~/rs_driver/build/tool$ ./rs_driver_pcdsaver -h                #查看配置项
---------------------------------------------------------------
                  RS_Driver PCD Saver Version: v1.5.*
---------------------------------------------------------------
Arguments: 
 -type  = LiDAR type
 -pcap  = The path of the pcap file, off-line mode if it is true.
 -msop  = LiDAR msop port number,the default value is 6699
 -difop = LiDAR difop port number,the default value is 7788
 -group = LiDAR destination group address if multi-cast mode.
 -host  = Host address.
 -x     = Transformation parameter, unit: m 
 -y     = Transformation parameter, unit: m 
 -z     = Transformation parameter, unit: m 
 -roll = Transformation parameter, unit: radian 
 -pitch = Transformation parameter, unit: radian 
 -yaw   = Transformation parameter, unit: radian 
```

Example of saver tool command:

```Bash
user@user:~/rs_driver/build/tool$ ./rs_driver_pcdsaver -type Airy -msop 6699 -difop 7788
#Online Airy，MSOP 6699,DIFOP 7788
```



---

# **Troubleshooting Guide**

1. **How to resolve the persistent MSOP\_TIMEOUT or DIFOP\_TIMEOUT errors reported by the node terminal**

When using the SDK or Driver for the first time, it is common to encounter a situation where the LiDAR is properly connected and data transmission is normal, but rviz cannot display the point cloud, and the terminal returns the error codes MSOP\_TIMEOUT / DIFOP\_TIMEOUT\. This is usually caused by the firewall not being disabled\. Users can refer to the common firewalls listed below and use the commands to disable them\.

1. **UFW**

```Bash
user@user:~$ sudo ufw status                                
user@user:~$ sudo ufw disable                               
user@user:~$ sudo ufw enable                                
```

2. **Firewall**

```Bash
user@user:~$ sudo firewall-cmd state
user@user:~$ sudo systemtcl stop firewall.service
user@user:~$ sudo systemctl disable firewalld.service        
user@user:~$ sudo systemctl restart firewalld.service        
user@user:~$ sudo systemctl enable firewalld.service        
```

3. **Iptables**

```Bash
user@user:~$ sudo service iptables status                   
user@user:~$ sudo iptables -F                               
user@user:~$ sudo iptables -X                               
user@user:~$ sudo service  iptables stop                    
user@user:~$ sudo chkconfig iptables off                    
```



2. **How to print IMU data information for Airy/Fairy**

During the use of the SDK, in addition to the angular velocity and linear velocity data contained in IMU\-related topics, the specific values of the quaternion and offset in the Airy/Fairy IMU can also be printed via the SDK\.

[IMU Extrinsic Parameters Instructions](https://robosense.feishu.cn/wiki/IEAlwYFTtiYzCIkYEDGcHbmrnfh?from=from_copylink)





3. **How to solve the data frequency reduction \(frame rate drop\) issue based on ROS2**

During the use of the SDK, due to the influence of the ROS2 communication mechanism, the published topic frequency may be lower than the normal frequency of the LiDAR, possibly dropping to 5 Hz or even 1 Hz\. There are generally two solutions to this problem：

1. Users can refer to the solutions for the frequency reduction issue provided in the own documentation of SDK\. See **Table 2\.1** for details

2. For some cases that cannot be resolved by the methods proposed in **Table 2\.1**, a shared memory solution based on FastDDS can be considered: [FastDDS shared memory solution under ROS2](https://robosense.feishu.cn/wiki/TLgDwpdc4iNQ2skXkquc5xBAnug?from=from_copylink)



4. **How to modify node names to prevent conflicts between master and slave machines**

In a multi\-machine ROS system, if the distributed communication mechanism is not correctly configured, different devices will use the same node names and topic names by default when starting nodes\. When the master starts the LiDAR driver, the new node will attempt to register a node with the same name or publish a topic with the same name, causing the ROS master to perceive a conflict and forcibly terminate the original driver node on the slave machine, resulting in the slave driver exiting unexpectedly\.

Users encountering such issues can usually avoid conflicts by modifying the node names and topic names\.

1. **Node name modification**

Modify `name='rslidar_sdk_node'` in `rslidar_sdk/src/launch/start.launch` to avoid node name conflicts

2. **Topic name modification**

Modify the topic names in the `config.yaml` file to avoid topic conflicts when using multiple LiDARs within one single node



5. **How to filter out the FOV at specified discontinuous horizontal angles for mechanical LiDAR**

This modification needs to be made in the corresponding mechanical LiDAR source code file\. The usual access path is**`/rslidar_sdk/src/rs_driver/src/rs_driver/driver/decoder`**

Taking Airy as an example, specify the horizontal FOV range to be displayed as 0° to 90° and 270° to 360°\. The example code is as follows \(**The bolded parts are the modified code**\)

```C++
**// Line 569 of decoder_RSAIRY.hpp**
**if (this->distance_section_.in(distance) && this->scan_section_.in(angle_horiz_final) && ((angle_horiz_final >= 0 && angle_horiz_final <= 9000) || (angle_horiz_final >= 27000 && angle_horiz_final <= 36000)))**
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



# Existing SDK and Driver Versions

1. **rslidar\_sdk v1\.5\.19**

    \[rslidar\_sdk\-v1\.5\.19\.tar\.gz\]

2. Based on rslidar\_sdk v1\.5\.18，**additionally support Fairy 48，AiryLite**

    \[rslidar\_sdk\.zip\]

3. Based on rslidar\_sdk v1\.5\.18，**additionally support Fairy 48，EMX，EM4**

    \[rslidar\_sdk\.zip\]

4. Based on rs\_driver v1\.5\.18，**additionally support EMX，EM4**

    \[rs\_driver\.zip\]

