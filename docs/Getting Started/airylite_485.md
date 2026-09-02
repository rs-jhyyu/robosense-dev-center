---
title: AiryLite 485 / Serial Version Guide
sidebar_position: 3
---

## 1. Establishing the Connection Between the LiDAR and the Host

### 1.1 Connecting the LiDAR

The LiDAR connection is shown in Figure 1.

(a) The LiDAR connects to the adapter board through the 485 interface;

(b) The host and the adapter board are connected with a USB cable;

(c) Once powered on, the LiDAR starts working normally.

> **Note:** AiryLite only supports a supply voltage of 12 to 16 V. Use a stable 12 V power supply. Never use a power supply of 16 V or above.

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_9.png').default} alt="Wiring diagram of AiryLite LiDAR connected to the adapter board and the host via USB" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 1: LiDAR connection diagram</figcaption>
</figure>

### 1.2 Acquiring LiDAR Data

#### 1.2.1 Windows

a. Download the serial port driver ([download page](https://www.wch.cn/downloads/CH343SER_EXE.html)), then run the installer and complete the installation.

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_2.png').default} alt="CH343 serial port driver download page" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 2: Downloading the serial port driver</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_6.png').default} alt="Running the CH343 driver installer executable" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 3: Running the installer</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/airylite485/img_v3_02vl_c1a3d2ac-53ed-4d11-9c27-7870110b256g.png').default} alt="CH343 driver installation window showing installation in progress" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 4: Installing the serial port driver</figcaption>
</figure>

b. After completing section 1.1 Connecting the LiDAR correctly and installing the driver, open Device Manager to confirm that the driver has taken effect. If the computer detects a total of 5 ports, the data link wiring is correct. Among them, SERIAL-A and SERIAL-D are the two high-speed serial ports.

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_11.png').default} alt="Windows Device Manager listing five COM ports including SERIAL-A and SERIAL-D" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 5: Checking the ports in Device Manager</figcaption>
</figure>

#### 1.2.2 Ubuntu

a. Download the serial port driver package ([download page](https://github.com/WCHSoftGroup/ch343ser_linux)).

b. Run the following commands to install it:

```shell-session
user:~/ch343ser_linux-main$ cd driver && sudo make install && cdd
# A ch343.ko driver file is generated in the driver directory after a successful build
user:~$ cd /usr/include/asm-generic
user:~/usr/include/asm-generic$ sudo cp termbits.h termbits.h.bak
user:~/usr/include/asm-generic$ sudo sed -i '12,19 s/^/\/\//' \
/usr/include/asm-generic/termbits.h
user:~/usr/include/asm-generic$ sudo reboot
```

> **Note:** On Ubuntu, the driver takes effect only after the host is restarted.

c. Monitor the serial ports (start the monitoring command before plugging in the USB cable). The ports with the lowest and highest numbers are the two high-speed serial ports.

```shell-session
user:~$ udevadm monitor --udev| grep -E 'UDEV.*\(tty\)'
```

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_3.png').default} alt="Terminal output of udevadm monitor showing the ttyCH343USB serial port nodes" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 6: The high-speed serial ports are ttyCH343USB0 and ttyCH343USB3</figcaption>
</figure>

d. Grant read and write permissions to the serial ports:

```shell-session
user:~$ sudo chmod 666 /dev/ttyCH343*
```

## 2. Using RSView

Once the LiDAR and the host are connected, you can use RSView to view the point cloud online.

### 2.1 Using RSView on Windows

a. Open Sensor Network Config and fill in the serial port names you detected (see section 1.2.1 step b) as shown in the figure. Set the baud rate to 4M (4000000), then click OK.

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_1.png').default} alt="RSView Sensor Network Config dialog with serial port names and baud rate filled in" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 7: Filling in the configuration parameters</figcaption>
</figure>

b. Click the LiDAR icon on the toolbar to open the online LiDAR. You can also use the menu item File -> Open Sensor to open the online LiDAR.

In the Sensor Type field, select the matching LiDAR type 0352_4M and click OK.

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_10.png').default} alt="RSView Sensor Type selection dialog with 0352_4M selected on Windows" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 8: Selecting the LiDAR type</figcaption>
</figure>

### 2.2 Using RSView on Ubuntu

a. Click the LiDAR icon on the toolbar to open the online LiDAR. You can also use the menu item File -> Open Sensor to open the online LiDAR.

In the Sensor Type field, select the matching LiDAR type 0352_4M and click OK.

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_8.png').default} alt="RSView Sensor Type selection dialog with 0352_4M selected on Ubuntu" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 9: Selecting the LiDAR type</figcaption>
</figure>

b. The Sensor Network Config window opens automatically. Fill in the serial port names you detected (see section 1.2.2 step c) as shown in the figure. Set the baud rate to 4M (4000000), then click OK.

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_12.png').default} alt="RSView Sensor Network Config dialog on Ubuntu with serial port names and baud rate filled in" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 10: Filling in the configuration parameters</figcaption>
</figure>

## 3. Using the Driver

### 3.1 Building the Driver

a. Contact RoboSense staff to obtain the latest driver for the serial port LiDAR.

b. Follow the README.md / README_CN.md file in the project package to complete the build.

### 3.2 Configuring the Driver Parameters

Open the src -> config -> config.yaml file and check the key configuration parameters:

A. Data source (msg_source);

B. Driver serial port numbers (see section 1.2.2 above);

C. Baud rate (dual 4M by default).

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_7.png').default} alt="config.yaml content showing msg_source, serial port and baud rate settings" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 11: Common driver parameter configuration</figcaption>
</figure>

## 4. Troubleshooting

### 4.1 Windows

#### 4.1.1 RSView Fails to Start

For issues where the program does not open (turn off the firewall) or startup fails with `No module named rsview` (the program path must not contain invalid characters), see [RSView FAQ](../RSView/faq.md).

<figure className="doc-figure">
  <img src={require('./images/airylite485/image.png').default} alt="Windows Defender Firewall settings page with all firewalls turned off" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 12: Turning off the firewall</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/airylite485/img_v3_02102_067e8142-39ab-4615-8ba4-f832656ec1dg.png').default} alt="Error message caused by invalid characters in the RSView program path on Windows" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 13: Error caused by invalid characters in the path</figcaption>
</figure>

#### 4.1.2 No Point Cloud in RSView

Troubleshooting steps:

1. Before troubleshooting, make sure the configuration has been completed correctly as described in section 2.1 Using RSView on Windows. If RSView still shows no point cloud output, follow the steps below.

2. Complete the harness connection according to section 1.1 Connecting the LiDAR. The adapter board indicator lights up and the LiDAR emits laser, which means the power supply is working and the LiDAR has started up.

<figure className="doc-figure">
  <img src={require('./images/airylite485/img_v3_02uh_d43fd878-3e57-4a58-8035-8655cfabd7bg.webp').default} alt="LiDAR emitting laser observed with a camera" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 14: The LiDAR is emitting laser</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_4.png').default} alt="Adapter board with its indicator light on" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 15: The adapter board indicator is lit</figcaption>
</figure>

3. Open Device Manager. If the computer detects the ports (5 in total) named "COM + number", the data link wiring is correct.

<figure className="doc-figure">
  <img src={require('./images/airylite485/img_v3_02uh_806fd32d-7dbf-487a-8644-9b4d3606de1g.jpg').default} alt="Device Manager port list confirming the data link wiring is correct" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 16: Confirming that the data link wiring is correct</figcaption>
</figure>

4. Open the serial port monitor XCOM. In the port selection window, select the 9114 serial ports corresponding to A and D in Device Manager, check the hexadecimal display option, then click Serial Port Operation - Open Serial Port and observe whether the data stream is scrolling.

> **Note:** Do not keep the serial port monitor open for a long time, as it can slow the computer down.

<figure className="doc-figure">
  <img src={require('./images/airylite485/img_v3_02uh_7088f327-d2fe-407b-b5d4-ca30a8d31c4g.png').default} alt="XCOM serial port monitor showing scrolling hexadecimal data from the LiDAR" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 17: Checking whether the host receives serial port data</figcaption>
</figure>

5. Run RSView as administrator and complete the configuration as described in section 2.1 Using RSView on Windows.

6. If all the steps above are correct and RSView still cannot display the point cloud, contact RoboSense technical support.

### 4.2 Ubuntu

#### 4.2.1 RSView Fails to Start

Startup fails with `No module named rsview`: check whether the program path contains invalid characters. See [RSView FAQ](../RSView/faq.md).

<figure className="doc-figure">
  <img src={require('./images/airylite485/img_v3_02102_067e8142-39ab-4615-8ba4-f832656ec1dg_1.png').default} alt="Error message caused by invalid characters in the RSView program path on Ubuntu" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 18: Error caused by invalid characters in the path</figcaption>
</figure>

#### 4.2.2 No Point Cloud in RSView

Troubleshooting steps:

1. Before troubleshooting, make sure the configuration has been completed correctly as described in section 2.2 Using RSView on Ubuntu. If RSView still shows no point cloud output, follow the steps below.

2. Complete the harness connection according to section 1.1 Connecting the LiDAR. The adapter board indicator lights up and the LiDAR emits laser, which means the power supply is working and the LiDAR has started up.

<figure className="doc-figure">
  <img src={require('./images/airylite485/img_v3_02uh_d43fd878-3e57-4a58-8035-8655cfabd7bg_1.webp').default} alt="LiDAR emitting laser observed with a camera" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 19: The LiDAR is emitting laser</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_5.png').default} alt="Adapter board with its indicator light on" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 20: The adapter board indicator is lit</figcaption>
</figure>

3. Confirm the serial port permissions:

```shell-session
user:~$ ls -al /dev/ttyCH343*
```

Confirm that the serial ports are found and that they have read and write permissions. If no serial port node is found, see the next section: 4.2.3 No Serial Port Node Found.

4. Open the serial port monitor cutecom, select a high-speed serial port under Device (see section 1.2.2 to confirm the high-speed serial port names), then click Open and observe whether the data stream is scrolling.

5. If all the steps above are correct and RSView still cannot display the point cloud, contact RoboSense technical support.

#### 4.2.3 No Serial Port Node Found

1. Check whether the serial port driver was built successfully. A successful build generates a ch343.ko driver file in the driver directory.

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_noext.png').default} alt="Terminal listing showing the generated ch343.ko driver file in the driver directory" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 21: The generated ch343.ko driver file</figcaption>
</figure>

2. Use the lsusb command to check whether the device is plugged in and working normally.

3. Check whether the driver has been loaded. When successful, the output looks like this:

```shell-session
user:~$ sudo chmod 666 /dev/ttyCH343*
```

4. If the serial port node is still not found, refer to https://blog.csdn.net/wch_techgroup/article/details/132173723 for further diagnosis.

5. If all the steps above are correct and RSView still cannot display the point cloud, contact RoboSense technical support.

#### 4.2.4 Driver Build Error: insmod error could not insert module ch343.ko: key was rejected by service

Cause: the host is in Secure Boot mode. This feature causes a driver signature error and prevents the driver from being loaded.

```shell-session
user:~$ mokutil --sb-state      # Check whether Secure Boot is enabled
```

If the output is Secure Boot enabled, you need to disable it.

Secure Boot must be disabled through the BIOS/UEFI settings. Follow these steps:

a. Reboot into BIOS/UEFI:

1. Power off and then power on, pressing the BIOS key during startup (common keys: F2, F10, Del or Esc, depending on the motherboard).

2. If Ubuntu has already started, run `sudo reboot now` and immediately hold the BIOS key.

b. Navigate to the Secure Boot option:

1. In the BIOS/UEFI interface, use the keyboard to navigate to the "Security" or "Boot" tab.

2. Find the "Secure Boot" option (it may be named "Secure Boot Control" or something similar).

c. Disable Secure Boot:

1. Change the "Secure Boot" state from "Enabled" to "Disabled".

2. Save the changes: usually press F10 and select "Save Changes and Exit".

3. The system will restart.

d. Verify that it is disabled:

1. After the restart, boot into Ubuntu.

2. Run `mokutil --sb-state` again and confirm that the output is SecureBoot disabled.

