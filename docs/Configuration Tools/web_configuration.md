---
title: Web Configuration Guide (Airy / Fairy)
sidebar_position: 1
---

Airy and Fairy LiDARs both provide a built-in web interface for parameter configuration and firmware upgrade. The workflow is identical for the two models; only the interface screenshots differ. Model-specific screenshots are given in separate subsections below.

## 1. Prerequisites

1. The LiDAR and the computer are physically connected (aviation plug cable, network cable and power cable are properly connected), and the device is powered on and starts up normally.
2. Configure the computer's local IP to be in the same network segment as the LiDAR (default LiDAR IP: 192.168.1.200, recommended computer IP: 192.168.1.102, subnet mask 255.255.255.0).
3. Disable the firewall and security software, and use a mainstream browser such as Chrome, Edge or Firefox.

## 2. Accessing the Web Interface

Make sure the network connection between the LiDAR and the computer is working, then enter the LiDAR Device IP in the browser address bar. **The factory default address is 192.168.1.200.** If the LiDAR IP has been changed, enter the new IP address to open the LiDAR web interface.

### 2.1 Airy

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/web/image_2.png').default} alt="Airy LiDAR web interface home page opened in a browser" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 1: Airy web interface home page</figcaption>
</figure>

### 2.2 Fairy

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/web-fairy/image_3.png').default} alt="Fairy LiDAR web interface home page opened in a browser" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 2: Fairy web interface home page</figcaption>
</figure>

## 3. Modifying Parameters on the Web Interface

Parameter modification on the web interface is divided into three modules: **General Setting**, **Performance Setting** and **Angle Pulse Setting**. After changing any parameter you must click **Save**; the setting takes effect once a success message is shown. If you do not click Save, the parameter is not changed.

### 3.1 General Setting

Airy:

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/web/image_3.png').default} alt="Airy General Setting page listing basic network and device parameters" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 3: Airy General Setting page</figcaption>
</figure>

Fairy:

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/web-fairy/image.png').default} alt="Fairy General Setting page listing basic network and device parameters" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 4: Fairy General Setting page</figcaption>
</figure>

Modify the corresponding parameters as required. For the configuration rules and value ranges of each parameter, please refer to the product manual of the corresponding model.

### 3.2 Performance Setting

Airy:

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/web/image_1.png').default} alt="Airy Performance Setting page with advanced parameters" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 5: Airy Performance Setting page</figcaption>
</figure>

Fairy:

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/web-fairy/image_2.png').default} alt="Fairy Performance Setting page with advanced parameters" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 6: Fairy Performance Setting page</figcaption>
</figure>

Modify the corresponding parameters as required. For the configuration rules and value ranges of each parameter, please refer to the product manual of the corresponding model.

### 3.3 Angle Pulse Setting

Airy:

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/web/image.png').default} alt="Airy Angle Pulse Setting page for angle pulse trigger configuration" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 7: Airy Angle Pulse Setting page</figcaption>
</figure>

Fairy:

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/web-fairy/image_1.png').default} alt="Fairy Angle Pulse Setting page for angle pulse trigger configuration" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 8: Fairy Angle Pulse Setting page</figcaption>
</figure>

Modify the corresponding parameters as required. For the configuration rules and value ranges of each parameter, please refer to the product manual of the corresponding model.

### 3.4 General Notes on Parameter Modification

1. Device IP and Destination IP must stay in the same network segment, otherwise the device will fail to connect properly.
2. The MSOP, DIFOP and IMU port numbers all range from 1025 to 65535, and they must not be set to the same value, to avoid port conflicts.
3. If the Device IP is changed, you must use the new IP address to access the web interface afterwards, and reconfigure the computer's local IP to the new network segment.
4. Only modify the parameters that need to be adjusted each time; keep the other parameters at their default values to avoid device abnormalities caused by mis-operation.
5. When networking multiple LiDARs, configure a unique IP address and port number for each device to avoid network segment and port conflicts.

## 4. Firmware Upgrade on the Web Interface

### 4.1 Preparation

1. Save the firmware package to the local computer. **The save path must not contain Chinese characters or special symbols.**
2. Make sure the network connection between the LiDAR and the computer is stable. During the upgrade, do not disconnect, power off, or restart the device or the computer.

### 4.2 Upgrade Steps

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/web/ae7a6bb201acddc8e9a1e359230b0756.jpg').default} alt="Web interface firmware upgrade page showing the file selection and update buttons" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 9: Firmware upgrade page</figcaption>
</figure>

1. Click **Choose File** and select the firmware upgrade package in the pop-up window.
2. After the upload is complete, the page shows the firmware file name and the `Update App/Bottom/Top/All` buttons, corresponding to the App, bottom board, top board and all firmware upgrades respectively.
3. Click the corresponding upgrade button as required:
    - To upgrade a single firmware: click **Update App**, **Update Bottom** or **Update Top**.
    - To upgrade all firmware: click **Update All**.
4. Wait for the upgrade to complete. Do not perform any other operation during the process; the page shows the progress and a completion message.
5. The upgrade is finished when the **upgrade success** message appears. To upgrade multiple firmware items, repeat steps 1 to 3.

### 4.3 Firmware Upgrade Notes

1. The upgrade package must be in **Zip format** only. The web interface does not support other formats; a non-Zip format will report an upgrade failure.
2. The firmware package name and path **must not contain Chinese characters, spaces or special symbols**, otherwise parsing will fail.
3. During the upgrade, keep the **power supply stable and the network smooth**. Never power off, disconnect the network, restart the device or the computer, or close the browser, to avoid damaging the device firmware.
4. Before the upgrade, it is recommended to record the current firmware version (check the **Device** section of the web interface) so that you can verify it after the upgrade.
5. If the device is briefly unresponsive after the upgrade, this is normal; wait 1 to 2 minutes for it to recover. If it stays unresponsive for a long time, you can power off and restart it (only after the upgrade is complete).

## 5. Troubleshooting Guide

1. **Cannot access the web interface**:

    - Check the LiDAR power supply and the motor operating status.
    - Verify that the computer's local IP and the LiDAR Device IP are in the same network segment and that the subnet masks match.
    - Disable the firewall and security software, and check the browser network settings.
    - Replace the network cable, network port or computer to rule out hardware connection faults.
    - Capture packets with Wireshark to confirm the network communication status between the device and the computer.

2. **Saving fails after modifying parameters**:

    - Check whether the parameter values comply with the specifications in this document.
    - Confirm that the MSOP, DIFOP and IMU port numbers are not duplicated.
    - Verify that the Device IP and Destination IP are in the same network segment.
    - Refresh the web page, clear the cache, then modify and save the parameters again.
    - If it still fails, restart the LiDAR and try again.

3. **Firmware upgrade fails**:

    - Check that the firmware package is in the officially supported Zip format.
    - Confirm that the firmware package path contains no Chinese characters, spaces or special symbols.
    - Make sure the network is stable, then upload the firmware package and upgrade again.
    - Verify that the device working mode is High Performance (not Standby).
    - If it still fails, contact RoboSense official technical support.

4. **Device works abnormally after parameter modification or firmware upgrade**:

    - Fault caused by parameter modification: enable **Restore Default** in **General Setting** on the web interface to restore factory settings, then restart the device and configure it again.
    - Fault caused by firmware upgrade: stop using the device immediately and contact RoboSense for investigation. Never disassemble or reflash the device yourself.

5. **Web page loads abnormally or some functions are unavailable**:

    - Switch to another mainstream browser and access it again.
    - Clear the browser cache, disable plug-ins, and retry.
    - Restart the LiDAR and refresh the network connection.
