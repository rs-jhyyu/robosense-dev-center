---
title: M1P Tool Guide
sidebar_position: 4
---

Download the tool package:

- [M1P_Tool_Win.7z](pathname:///downloads/LidarAssistant/M1P_Tool_Win.7z)
- [M1P_Tool_Ubuntu.zip](pathname:///downloads/LidarAssistant/M1P_Tool_Ubuntu.zip)

Note: the tool also runs on Ubuntu; you can directly run the `DiagCmdTool` executable.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/m1p/image_4.png').default} alt="Main window of the M1P tool showing all functional areas" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 1: M1P tool main window</figcaption>
</figure>

## 1. Connect the LiDAR

1. The LiDAR and the computer are physically connected (aviation plug cable, network cable and power cable are properly connected), and the device is powered on and starts up normally.
2. By default, configure the computer's local IP as the LiDAR destination IP. **The factory default destination IP is 192.168.1.102, the default LiDAR IP is 192.168.1.200, and the subnet mask is 255.255.255.0.**
3. Disable the computer firewall and other security software that may block network communication, open the tool, enter the current LiDAR IP in the LiDAR IP field shown in **Area 1** below, and click the connect button to establish the connection.

## 2. Introduction to the Tool Interface Areas

### Area 1: LiDAR Connection Area

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/m1p/image_9.png').default} alt="LiDAR connection area with Project Name and LiDAR IP fields" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 2: LiDAR connection area</figcaption>
</figure>

- **Project Name**: P0220, corresponding to M1P.
- **LiDAR IP**: enter the LiDAR IP address here, used to connect to the LiDAR.

### Area 2: Firmware Flashing Area

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/m1p/image_1.png').default} alt="Firmware flashing area of the M1P tool" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 3: Firmware flashing area</figcaption>
</figure>

### Area 3: LiDAR Parameter Configuration Area

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/m1p/image_2.png').default} alt="LiDAR parameter configuration area showing IP, port, MAC and SN fields" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 4: LiDAR parameter configuration area</figcaption>
</figure>

- **SrcIP**: read/write area for the LiDAR IP.
- **DstIP**: read/write area for the destination IP (the computer IP and the destination IP must be consistent).
- **MSOP Port**: MSOP port number.
- **DIFOP Port**: DIFOP port number.
- **MAC**: LiDAR MAC address (not modifiable by default).
- **SN**: LiDAR SN number (not modifiable by default).

### Area 4: UDS Request Area

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/m1p/image_7.png').default} alt="UDS request area used to send UDS request messages" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 5: UDS request area</figcaption>
</figure>

- **UDS Request**: send a UDS request message, used to modify the time synchronization mode, the PHY chip mode and other functions.

## 3. Modify IP Parameters

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/m1p/image_5.png').default} alt="Modifying the LiDAR IP parameters in the tool" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 6: Modify IP parameters</figcaption>
</figure>

## 4. Firmware Upgrade

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/m1p/image_6.png').default} alt="Firmware upgrade operation in the M1P tool" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 7: Firmware upgrade</figcaption>
</figure>

## 5. DID Service

The UDS request area supports read and write operations for DIDs. The common DID commands are listed below:

| Function | Command | Value | Remarks |
|---|---|---|---|
| **Modify the time synchronization mode** | 22FE0B: read the time synchronization mode<br />2EFE0B: modify the time synchronization mode | 00: Internal Time<br />02: PTP-E2E_L2<br />03: gPTP | If the time synchronization mode does not take effect after modification, contact RoboSense technical support to confirm the firmware version |
| **Modify the PHY chip mode** | 22FE96: read the PHY chip mode<br />2EFE96: modify the PHY chip mode | 00: Master (By default)<br />01: Slave | |
| **Modify the echo mode** | 22F1AB: read the echo mode<br />2EF1AB: modify the echo mode | 00: dual echo<br />04: strongest echo | |

**Operation note:** before writing any DID command, you must click the **客户解锁1** (Customer Unlock 1) and **客户解锁2** (Customer Unlock 2) buttons in sequence. After unlocking, there is a 5-second window to execute the command; sending a command more than 5 seconds later will report a failure.

### Example: Modifying the Time Synchronization Mode with a DID

1. Enter the LiDAR IP. After the connection succeeds, click **客户解锁1** and **客户解锁2**. Note that you must unlock once before every DID command, and send the DID command within 5 seconds of unlocking; if it times out, unlock again.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/m1p/image_3.png').default} alt="Clicking the two customer unlock buttons before sending a DID command" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 8: Customer unlock operation</figcaption>
</figure>

2. Enter `2EFE0B02` in the dialog box and click send to change the synchronization mode to PTP-E2E_L2 mode. The default is gPTP mode.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/m1p/image_8.png').default} alt="Sending the DID command that writes the time synchronization mode" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 9: Sending the DID write command</figcaption>
</figure>

3. After the command is sent successfully, restart the LiDAR (note: you must power it off and restart it, otherwise the change does not take effect). Enter `22FE0B` in the dialog box again; if `62FE0B02` is returned, the modification succeeded.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/m1p/image.png').default} alt="Reading back the time synchronization mode to verify the modification" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 10: Reading back to verify the result</figcaption>
</figure>

## 6. Notes

1. After the tool connects to the LiDAR, always **read before writing** for all parameters, to avoid the tool's default values overwriting the existing parameters.
2. The MSOP and DIFOP port numbers both range from 1025 to 65535, and they must not be set to the same value, to avoid port conflicts.
3. **The LiDAR IP and the destination IP must stay in the same network segment**, otherwise the device will fail to connect properly.
4. After modifying the LiDAR parameters with the tool, the LiDAR must be powered off and restarted for the parameters to take effect.
