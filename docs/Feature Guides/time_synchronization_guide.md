---
title: Time Synchronization Guide
sidebar_position: 1
---

# RS-LiDAR Time Synchronization Guide

## 1. Time Synchronization Confirmation and Configuration

### 1.1 Confirm the supported types of current LiDAR time synchronization methods

Users can refer to the user manual to check the corresponding LiDAR time synchronization method. For **example**, the following are the product specifications of E1R, containing the time synchronization method it supports.

<figure className="doc-figure">
  <img src={require('./images/Fig0.PNG').default} alt="E1R product specification showing supported time synchronization methods" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 1: Example of Configuration</figcaption>
</figure>

### 1.2 How to configure the time synchronization method for the current LiDAR

#### Mechanical LiDAR

After the user confirms that the LiDAR is connected to the host, enter the **LiDAR IP address (default address: 192.168.1.200)** in the web interface to access the LiDAR web page. Then go to **Setting → Time Sync** to view and configure the specific time synchronization mode (Mechanical LiDARs without a web interface only support GPS time synchronization).

<figure className="doc-figure">
  <img src={require('./images/Fig1.PNG').default} alt="LiDAR web interface Time Sync configuration page" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 2: Genaral Web Interface of Mechanical LiDAR</figcaption>
</figure>

#### Solid-State LiDAR

Modifying the time synchronization method for solid-state LiDAR requires using a corresponding tool. Please contact RoboSense technical support to obtain the tool and refer to the tool's SOP for usage.

## 2. Time Synchronization Method Verification

### 2.1 GPS time synchronization

1. The user must first complete the connection of the GPS synchronization signal harness according to the pin definitions of the aviation plug interface in the **[Interface Description]** section of the product manual.

2. The user needs to complete the GPS time synchronization settings for the LiDAR (refer to Section 1.2 of this SOP).

3. Verify the time synchronization status of the LiDAR (refer to Section 3 of this SOP).

***Note****: If users need to synchronize a LiDAR that does not support direct GPS signal synchronization with a GPS module, the GPS module must first provide time to the gPTP Master. The specific interface and time synchronization method needs to be clarified with the gPTP Master provider.*

### 2.2 PTP/gPTP Time Synchronization

This SOP only provides a **Linuxptp** synchronization tutorial, which can be used to verify whether time synchronization can be achieved for the LiDAR in the current environment. **If using another PTP Master**, please consult the corresponding supplier.

(**Linuxptp** source code address: *https://github.com/richardcochran/linuxptp/tree/master*)

i. According to the method shown in the figure below, complete the connection of the LiDAR with the host computer, synchronization box, and other devices.

<figure className="doc-figure">
  <img src={require('./images/Fig2.JPEG').default} alt="Connection diagram of LiDAR, host computer and synchronization box" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 3: Examples of connecting LiDAR for Time Synchronization</figcaption>
</figure>

ii. Users can use the ethtool command to view the network interface information of the host computer.

```bash
user@user:~$ sudo apt-get install ethtool
user@user:~$ ethtool -T eno1
```

The printed information is as follows:

```text
Capabilities:
          hardware-transmit      (SOF TIMESTAMPING TX HARDWARE)
          software-transmit      (SOF TIMESTAMPING TX SOFTWARE)
          hardware-receive       (SOF TIMESTAMPING RX HARDWARE)
          software-receive       (SOF TIMESTAMPING RX SOFTWARE)
          software-system-clock  (SOF TIMESTAMPING SOFTWARE)
          hardware-system-clock  (SOF TIMESTAMPING HARDWARE)
```

During PTP time synchronization, PTP network packets need to be exchanged. `transmit` refers to sending, `receive` refers to receiving, and `system-clock` refers to the system clock.
`hardware` refers to the hardware clock, which supports hardware system clock timestamping, allowing the hardware to use the system clock to generate timestamps. This is specified using the `-H` option. `software` refers to the software clock, which supports software system clock timestamping, allowing the software to use the system clock to generate timestamps. This is specified using the `-S` option. The network interface card must support one of these clock types in order to perform PTP time synchronization.

iii. Install **Linuxptp**, start the master clock according to the synchronization method, and verify the LiDAR time synchronization function. The following uses the **eno1** network interface card as an example.

```bash
user@user:~$ sudo ptp4l -S -P -4 -m -i eno1 #L4-P2P
user@user:~$ sudo ptp4l -S -E -2 -m -i eno1 #L2-E2E
user@user:~$ sudo ptp4l -S -E -4 -m -i eno1 #L4-E2E
user@user:~/linuxptp/configs$ sudo ptp4l -H -m -i eno1 -f automotive-master.cfg #gPTP
```

iv. Verify the time synchronization status of LiDAR. (Refer to the content in Section 3 of this SOP.)

## 3. Methods for verifying time synchronization status

### 3.1 RSView Verification

After RSView reads the LiDAR data, the LiDAR timestamp will be displayed in the bottom information bar. If the LiDAR timestamp matches the clock source time, it indicates that time synchronization is successful.

<figure className="doc-figure">
  <img src={require('./images/Fig3.PNG').default} alt="RSView bottom information bar showing the LiDAR timestamp" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 4: Schematic diagram of timestamp in RSView</figcaption>
</figure>

### 3.2 SDK Verification

Open the `rslidar_sdk/config/config.yaml` configuration file, set the `use_lidar_clock` switch to `true`, compile and run the driver, and then use a command to view the topic timestamps as shown below.

```bash
#ROS1
user@user:~$ rostopic echo /rslidar_points --noarr

#ROS2
user@user:~$ ros2 topic echo /rslidar_points
```

<figure className="doc-figure">
  <img src={require('./images/Fig4.png').default} alt="ROS topic timestamp output for time synchronization verification" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 5: Schematic diagram of point cloud topic timestamp</figcaption>
</figure>

***Note****: The time output in the message is in **`s.ns`** format. Users can search for an online timestamp tool to convert it into year-month-day hour:minute:second format for viewing.*

### 3.3 Web Verification(Mechanical LiDAR Only)

For mechanical LiDAR, users can check the LiDAR time synchronization status on the Diagnostic interface of the web page using the time synchronization status bits:

"**Absent**" indicates no signal input; "**Unlock**" indicates an unstable signal; "**Locked**" indicates that the signal is synchronized.

**GPS synchronization status:** GPS/GPRMC Status and PPS Status status bits are Locked;

**PTP/gPTP synchronization status:** PTP Status status bit is Locked.

<figure className="doc-figure">
  <img src={require('./images/Fig5.JPEG').default} alt="Web Diagnostic interface showing time synchronization status bits" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 6: Schematic diagram of successful time synchronization</figcaption>
</figure>

### 3.4 UDP Packet Verification

According to the analysis of the LiDAR UDP packets in the **[Device Information Output Protocol (DIFOP)]** section of the product manual, locate the corresponding bytes in **Wireshark** to view the current **LiDAR synchronization mode, synchronization status, and timestamp information**. The following uses the M1P LiDAR as an **example**.

<div className="doc-figure-row">
  <figure className="doc-figure doc-figure--inline">
    <img src={require('./images/Fig6.png').default} alt="Wireshark view of M1P LiDAR UDP packet synchronization mode and status" style={{maxWidth: '420px', width: '100%', height: 'auto'}} />
    <figcaption className="doc-figure-caption">Figure 7: Example of M1P DIFOP in manual</figcaption>
  </figure>
  <figure className="doc-figure doc-figure--inline">
    <img src={require('./images/Fig7.JPEG').default} alt="Wireshark view of M1P LiDAR UDP packet timestamp information" style={{maxWidth: '380px', width: '100%', height: 'auto'}} />
    <figcaption className="doc-figure-caption">Figure 8: Example of M1P DIFOP in Wireshark</figcaption>
  </figure>
</div>

***Note****: 0x03 corresponds to gPTP time synchronization mode; 0x01 corresponds to the time synchronization success status bit. The flag bit will only change when time is being provided (i.e., during time synchronization).*

## 4. Precautions

i. Connect the LiDAR directly to the master clock source to eliminate interference from intermediate links.

ii. Confirm that the time synchronization mode of the LiDAR is consistent with the master clock source.

iii. Verify that the master clock source is properly sending time synchronization packets.

iv. If synchronization still fails after the above steps, please contact RoboSense technical support.

**Note:** If the customer experiences normal synchronization when the host is directly connected to the LiDAR but fails when connecting through a switch, it is usually necessary to configure the packet forwarding settings on the corresponding ports of the switch. Please consult the relevant supplier for details.
