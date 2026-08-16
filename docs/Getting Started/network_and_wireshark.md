---
title: Network Connection and Wireshark Capture
sidebar_position: 2
---

## 1. Overview

RoboSense LiDAR is essentially a network terminal communication device. It sends point cloud data in the form of network packets to the receiving end (such as a domain controller or a PC host) according to a specific protocol. RoboSense LiDAR supports a range of network parameter configurations:

- IP addresses and port numbers of the LiDAR side and the destination side;

- Network communication mode, including unicast, multicast and broadcast;

- VLAN layer configuration.

This document provides the following guidance and is intended to be used together with the Product Manual of the corresponding LiDAR model:

- How to correctly establish network communication between the LiDAR and the host;

- How to use Wireshark to confirm that communication has been established correctly, and how to record LiDAR point cloud data;

- Troubleshooting for common issues.

## 2. Establishing Ethernet Communication Between the LiDAR and the Host

### 2.1 Physical Connection

First, find the Product Manual that matches the RoboSense LiDAR you own and look for the Quick Connection chapter. That chapter explains exactly how to connect the LiDAR to the host computer through the wiring harness. By default, our shipment includes the matching harness, the power adapter, a double-ended RJ45 network cable, and an interface box (if applicable).

The figure below illustrates the connection method using a screenshot from the Helios32 LiDAR Product Manual. Other LiDAR models follow the same principle.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/network/image2.png').default} alt="Connection diagram showing LiDAR, interface box, power adapter and host computer" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 1: Connection diagram from the Helios32 Product Manual</figcaption>
</figure>

### 2.2 Configuring the Host Ethernet Adapter

#### 2.2.1 Windows (Win10 / Win11)

By default, the LiDAR leaves the factory with the Source IP Address set to 192.168.1.200 and the Destination IP Address set to 192.168.1.102 (unicast by default). The first time you connect it to a PC, you need to change the Ethernet configuration on the host. Follow these steps:

- Open Control Panel > Network and Internet > Network and Sharing Center > Change adapter settings, then right-click the Ethernet adapter connected to the LiDAR and select Properties, as shown below.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/network/image3.png').default} alt="Windows Network and Sharing Center with Change adapter settings highlighted" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 2: Opening Change adapter settings</figcaption>
</figure>

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/network/image4.png').default} alt="Right-click menu on the Ethernet adapter with Properties selected" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 3: Opening the properties of the Ethernet adapter connected to the LiDAR</figcaption>
</figure>

- Double-click Internet Protocol Version 4 (TCP/IPv4) and select Use the following IP address to change the static route of the Ethernet adapter. If the LiDAR is in its factory default state, set the host IP address to 192.168.1.102 and the subnet mask to 255.255.255.0. If it is not, use the method described in the Capturing LiDAR Data section of this document.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/network/image5.jpeg').default} alt="TCP/IPv4 properties dialog with a static IP address and subnet mask entered" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 4: Setting a static IP address and subnet mask for the host</figcaption>
</figure>

#### 2.2.2 Linux (Ubuntu)

Follow these steps:

- Open Settings > Network to enter the network configuration page, then configure the host IP address and subnet mask of the Ethernet adapter;

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/network/image6.png').default} alt="Ubuntu Settings Network page listing the wired connection" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 5: Ubuntu network configuration page</figcaption>
</figure>

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/network/image7.png').default} alt="Ubuntu IPv4 settings with Manual addressing, host IP and netmask entered" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 6: Configuring the host IP address and subnet mask on Ubuntu</figcaption>
</figure>

- Toggle the connection off and then on again so that the network configuration takes effect.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/network/image8.png').default} alt="Ubuntu wired connection toggle switch used to reapply the configuration" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 7: Toggling the connection off and on to apply the configuration</figcaption>
</figure>

For a device in its factory default state, the LiDAR should now be communicating normally with the host. You can confirm this by running the following command in cmd or a terminal:

```bash
ping 192.168.1.200
```

If the ping fails, see the Troubleshooting Ethernet Connection and Wireshark Issues section.

## 3. Using Wireshark

### 3.1 Installing and Using Wireshark

#### 3.1.1 Download and Installation

Download the latest release of Wireshark from the official site: [https://www.wireshark.org/download.html](https://www.wireshark.org/download.html)

- On Ubuntu, install it directly with the following command:

```bash
sudo apt-get install wireshark
```

- On Windows, download the installer and follow the steps below.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/network/image9.png').default} alt="Wireshark installer welcome page on Windows" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 8: Running the Wireshark installer on Windows</figcaption>
</figure>

- During installation, keep all plugins selected, especially Npcap 1.86 shown in the figure below.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/network/image10.png').default} alt="Wireshark installer component list with all plugins selected" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 9: Keeping all plugins selected during installation</figcaption>
</figure>

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/network/image11.png').default} alt="Wireshark installer page with the Npcap component checked" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 10: Making sure Npcap is installed</figcaption>
</figure>

#### 3.1.2 Capturing LiDAR Data

Right-click Wireshark and select Run as administrator to launch it. On the home page, under Capture, select the Ethernet port that the LiDAR is connected to.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/network/image12.png').default} alt="Wireshark start page listing available capture interfaces" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 11: Selecting the Ethernet interface connected to the LiDAR</figcaption>
</figure>

Double-click that interface to start capturing data. If you have configured the factory default IP correctly as described in Configuring the Host Ethernet Adapter, you should see UDP data captured in real time, as shown below.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/network/image13.png').default} alt="Wireshark packet list showing UDP packets from the LiDAR" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 12: UDP data from the LiDAR captured in real time</figcaption>
</figure>

If the network configuration of your LiDAR has already been modified and you are not sure which host IP to use, type `arp` in the filter box on the capture page. You will then see the address resolution packets exchanged between the LiDAR and the host. Change the host IP to the Destination IP that the LiDAR is looking for. Ethernet communication will then be established correctly, and the UDP data sent by the LiDAR will appear on the capture page as well.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/network/image14.png').default} alt="Wireshark filtered by arp showing the destination IP requested by the LiDAR" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 13: Using the arp filter to find the destination IP requested by the LiDAR</figcaption>
</figure>

#### 3.1.3 Recording LiDAR Data Packets (Packet Capture)

Once the data is being received normally by the PC, you can use Wireshark to capture and save the LiDAR data. Follow these steps:

- Click the blue Start capturing packets button in the upper left corner, as shown in the figures;

- When you want to stop the capture, click the red Stop capturing packets button in the upper left corner. The captured data is now recorded;

- Click the Save capture file button, rename the file, and set the save type to pcap format.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/network/image15.png').default} alt="Wireshark toolbar with the blue Start capturing packets button highlighted" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 14: Start capturing packets</figcaption>
</figure>

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/network/image16.png').default} alt="Wireshark toolbar with the red Stop capturing packets button highlighted" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 15: Stop capturing packets</figcaption>
</figure>

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/network/image17.png').default} alt="Wireshark toolbar with the Save capture file button highlighted" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 16: Saving the capture file</figcaption>
</figure>

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/network/image18.png').default} alt="Wireshark save dialog with the file type set to pcap" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 17: Setting the save type to pcap</figcaption>
</figure>

The saved .pcap file is the LiDAR data file. You can replay and inspect the point cloud in RSView, the host software provided by RoboSense. For detailed instructions on RSView, see the RSView documentation.

## 4. Troubleshooting Ethernet Connection and Wireshark Issues

### 4.1 How Do I Configure the Host Ethernet Settings on Win11?

Open Settings > Network and Internet, select the Ethernet adapter connected to the LiDAR, set IP assignment to Manual, and enter the expected LiDAR destination IP under IPv4, as shown in the figures.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/network/image19.jpeg').default} alt="Windows 11 Network and Internet settings page with the Ethernet adapter selected" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 18: Opening the Ethernet adapter settings on Windows 11</figcaption>
</figure>

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/network/image20.jpeg').default} alt="Windows 11 IP assignment set to Manual" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 19: Setting IP assignment to Manual</figcaption>
</figure>

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/network/image21.jpeg').default} alt="Windows 11 IPv4 configuration with the LiDAR destination IP entered" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 20: Entering the LiDAR destination IP under IPv4</figcaption>
</figure>

### 4.2 The LiDAR IP Cannot Be Pinged

If the LiDAR IP cannot be pinged from cmd or a terminal, troubleshoot as follows:

- Use Wireshark to check whether you are pinging the correct LiDAR IP. The IP you ping should match the Source IP of the UDP packets, or the requested IP in the arp packets;

- Check the wiring: verify that the network cable connected to the host is not loose and that the harness connected to the interface box is not loose. Try reseating the connectors, or power-cycle the LiDAR, or cross-check with a different interface box and network cable to rule out harness or interface box problems;

- Check that the current host Ethernet configuration is correct: following section 3.1.2 Capturing LiDAR Data, check whether Wireshark can capture the UDP data sent by the LiDAR. If not, filter by `arp` to see whether the host Ethernet address has been set to the destination IP;

- Check the advanced Ethernet settings: in the Ethernet Properties dialog, click Configure > Advanced and check whether VLAN ID is enabled. For a device shipped with default settings it should be disabled. Also check Speed & Duplex; Auto Negotiation is recommended. Finally, disable the Energy Efficient Ethernet and Green Ethernet options.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/network/image22.png').default} alt="Ethernet adapter Advanced properties tab showing the VLAN ID setting" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 21: Checking the VLAN ID setting in the advanced Ethernet properties</figcaption>
</figure>

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/network/image23.png').default} alt="Ethernet adapter Advanced properties tab showing Speed and Duplex and power saving options" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 22: Checking Speed &amp; Duplex and disabling the power saving options</figcaption>
</figure>

### 4.3 Capture Error on Ubuntu

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/network/image24.png').default} alt="Ubuntu terminal showing a Wireshark permission error when capturing" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 23: Error reported when capturing on Ubuntu without sufficient privileges</figcaption>
</figure>

Check whether Wireshark was launched with sudo privileges:

```bash
sudo wireshark
```

### 4.4 How Do I Capture Packets on Linux Without the Wireshark GUI?

You can use the tcpdump command to capture LiDAR data on a specific network interface or from a specific IP:

```bash
# Capture data on the specified network interface (eno1) and save it as test.pcap
# (you can change the file name)
sudo tcpdump -i eno1 -w test.pcap

# Capture data sent from the specified IP 192.168.1.200 and save it as name.pcap
# (you can change the file name)
sudo tcpdump src net 192.168.1.200 -w name.pcap
```

