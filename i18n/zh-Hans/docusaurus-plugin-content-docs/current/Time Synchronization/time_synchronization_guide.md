---
title: 时间同步指南
sidebar_position: 4
---

# RS-LiDAR 时间同步指南

## 1. 时间同步确认与配置

### 1.1 确认当前 LiDAR 支持的时间同步方式类型

用户可以参考用户手册查看对应 LiDAR 的时间同步方式。**例如**，以下是 E1R 的产品规格书，其中包含它所支持的时间同步方式。

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/Fig0.PNG').default} alt="E1R 产品规格书，展示所支持的时间同步方式" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>图 1：配置示例</figcaption>
</figure>

### 1.2 如何为当前 LiDAR 配置时间同步方式

#### 机械式 LiDAR

在用户确认 LiDAR 已连接到主机后，在浏览器中输入 **LiDAR IP 地址（默认地址：192.168.1.200）** 以访问 LiDAR 网页。然后进入 **Setting → Time Sync** 查看并配置具体的时间同步模式（不带网页界面的机械式 LiDAR 仅支持 GPS 时间同步）。

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/Fig1.PNG').default} alt="LiDAR 网页界面的 Time Sync 配置页面" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>图 2：机械式 LiDAR 的通用网页界面</figcaption>
</figure>

#### 固态 LiDAR

修改固态 LiDAR 的时间同步方式需要使用相应的工具。请联系 RoboSense 技术支持获取工具，并参考工具的 SOP 进行使用。

## 2. 时间同步方式验证

### 2.1 GPS 时间同步

1. 用户必须首先根据产品手册 **[接口说明]** 部分中航空插头接口的引脚定义，完成 GPS 同步信号线束的连接。

2. 用户需要完成 LiDAR 的 GPS 时间同步设置（参考本 SOP 的第 1.2 节）。

3. 验证 LiDAR 的时间同步状态（参考本 SOP 的第 3 节）。

***注意****：如果用户需要将不支持直接 GPS 信号同步的 LiDAR 与 GPS 模块进行同步，则 GPS 模块必须首先向 gPTP Master 提供时间。具体的接口和时间同步方式需要与 gPTP Master 提供方确认。*

### 2.2 PTP/gPTP 时间同步

本 SOP 仅提供 **Linuxptp** 同步教程，可用于验证当前环境下 LiDAR 是否能够实现时间同步。**如果使用其他 PTP Master**，请咨询相应的供应商。

（**Linuxptp** 源代码地址：*https://github.com/richardcochran/linuxptp/tree/master*）

i. 按照下图所示的方法，完成 LiDAR 与上位机、同步盒及其他设备的连接。

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/Fig2.JPEG').default} alt="LiDAR、上位机与同步盒的连接示意图" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>图 3：LiDAR 时间同步连接示例</figcaption>
</figure>

ii. 用户可以使用 ethtool 命令查看上位机的网卡信息。

```bash
user@user:~$ sudo apt-get install ethtool
user@user:~$ ethtool -T eno1
```

打印信息如下：

```text
Capabilities:
          hardware-transmit      (SOF TIMESTAMPING TX HARDWARE)
          software-transmit      (SOF TIMESTAMPING TX SOFTWARE)
          hardware-receive       (SOF TIMESTAMPING RX HARDWARE)
          software-receive       (SOF TIMESTAMPING RX SOFTWARE)
          software-system-clock  (SOF TIMESTAMPING SOFTWARE)
          hardware-system-clock  (SOF TIMESTAMPING HARDWARE)
```

在 PTP 时间同步过程中，需要交换 PTP 网络报文。`transmit` 指发送，`receive` 指接收，`system-clock` 指系统时钟。
`hardware` 指硬件时钟，它支持硬件系统时钟时间戳，允许硬件使用系统时钟生成时间戳。这通过 `-H` 选项指定。`software` 指软件时钟，它支持软件系统时钟时间戳，允许软件使用系统时钟生成时间戳。这通过 `-S` 选项指定。网卡必须支持这两种时钟类型中的一种，才能进行 PTP 时间同步。

iii. 安装 **Linuxptp**，根据同步方式启动主时钟，并验证 LiDAR 时间同步功能。下面以 **eno1** 网卡为例。

```bash
user@user:~$ sudo ptp4l -S -P -4 -m -i eno1 #L4-P2P
user@user:~$ sudo ptp4l -S -E -2 -m -i eno1 #L2-E2E
user@user:~$ sudo ptp4l -S -E -4 -m -i eno1 #L4-E2E
user@user:~/linuxptp/configs$ sudo ptp4l -H -m -i eno1 -f automotive-master.cfg #gPTP
```

iv. 验证 LiDAR 的时间同步状态。（参考本 SOP 第 3 节的内容。）

## 3. 时间同步状态验证方法

### 3.1 RSView 验证

RSView 读取 LiDAR 数据后，LiDAR 时间戳将显示在底部信息栏中。如果 LiDAR 时间戳与时钟源时间一致，则表明时间同步成功。

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/Fig3.PNG').default} alt="RSView 底部信息栏显示 LiDAR 时间戳" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>图 4：RSView 中时间戳示意图</figcaption>
</figure>

### 3.2 SDK 验证

打开 `rslidar_sdk/config/config.yaml` 配置文件，将 `use_lidar_clock` 开关设置为 `true`，编译并运行驱动，然后使用命令查看话题时间戳，如下所示。

```bash
#ROS1
user@user:~$ rostopic echo /rslidar_points --noarr

#ROS2
user@user:~$ ros2 topic echo /rslidar_points
```

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/Fig4.png').default} alt="用于时间同步验证的 ROS 话题时间戳输出" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>图 5：点云话题时间戳示意图</figcaption>
</figure>

***注意****：消息中输出的时间为 **`s.ns`** 格式。用户可以搜索在线时间戳工具，将其转换为年-月-日 时:分:秒的格式进行查看。*

### 3.3 网页验证（仅限机械式 LiDAR）

对于机械式 LiDAR，用户可以在网页的 Diagnostic 界面上通过时间同步状态位查看 LiDAR 的时间同步状态：

"**Absent**" 表示无信号输入；"**Unlock**" 表示信号不稳定；"**Locked**" 表示信号已同步。

**GPS 同步状态：** GPS/GPRMC Status 和 PPS Status 状态位为 Locked；

**PTP/gPTP 同步状态：** PTP Status 状态位为 Locked。

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/Fig5.JPEG').default} alt="网页 Diagnostic 界面显示时间同步状态位" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>图 6：时间同步成功示意图</figcaption>
</figure>

### 3.4 UDP 数据包验证

根据产品手册 **[设备信息输出协议（DIFOP）]** 部分对 LiDAR UDP 数据包的解析，在 **Wireshark** 中定位相应的字节，即可查看当前 **LiDAR 同步模式、同步状态和时间戳信息**。下面以 M1P LiDAR 为**例**。

<div style={{display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-start'}}>
  <figure style={{textAlign: 'center', margin: '0'}}>
    <img src={require('./images/Fig6.png').default} alt="Wireshark 中查看 M1P LiDAR UDP 数据包的同步模式与状态" style={{maxWidth: '420px', width: '100%', height: 'auto'}} />
    <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>图 7：手册中 M1P DIFOP 示例</figcaption>
  </figure>
  <figure style={{textAlign: 'center', margin: '0'}}>
    <img src={require('./images/Fig7.JPEG').default} alt="Wireshark 中查看 M1P LiDAR UDP 数据包的时间戳信息" style={{maxWidth: '380px', width: '100%', height: 'auto'}} />
    <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>图 8：Wireshark 中 M1P DIFOP 示例</figcaption>
  </figure>
</div>

***注意****：0x03 对应 gPTP 时间同步模式；0x01 对应时间同步成功状态位。该标志位仅在提供时间（即时间同步进行中）时才会改变。*

## 4. 注意事项

i. 将 LiDAR 直接连接到主时钟源，以消除中间环节的干扰。

ii. 确认 LiDAR 的时间同步模式与主时钟源一致。

iii. 验证主时钟源正常发送时间同步数据包。

iv. 如果经过上述步骤后同步仍然失败，请联系 RoboSense 技术支持。

**注意：** 如果客户在主机直连 LiDAR 时同步正常，但通过交换机连接时同步失败，通常需要在交换机相应端口上配置数据包转发设置。详情请咨询相关供应商。
