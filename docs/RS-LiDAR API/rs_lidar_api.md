---
title: RS-LiDAR API Guide
sidebar_position: 1
---

## API Overview

The RoboSense LiDAR API is a LiDAR control interface library provided by RoboSense. It covers operations such as configuration changes, firmware upgrades, and working mode switching.

---

## Build and Run

### Build Steps

**Step 1**: Copy the code package to your desired working directory (Ubuntu 20.04 or later is recommended).

**Step 2**: Enter the `example` directory and run the build script:

```shell-session
user@user:~$ cd linux-lib-namespace/linux-build/example
user@user:~/linux-lib-namespace/linux-build/example$ sh build.sh
```

The build script generates the following executables (if you have additional development or build requirements, add the files to be compiled in `build.sh`):

| Build Artifact | Purpose |
| --- | --- |
| `airy` | Control program for Airy LiDAR |
| `helios` | Control program for the Helios series |

### Common Build Issues

If you get a link error similar to the one below during the build:

<figure className="doc-figure">
  <img src={require('./images/img1.png').default} alt="Static library link error caused by an Ubuntu version mismatch" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 1: Link error caused by an Ubuntu version mismatch</figcaption>
</figure>

This usually stems from Ubuntu version differences. You need to rebuild the static library on your local machine:

```shell-session
# Step 1: Copy the code package to the target Ubuntu machine
# Step 2: Build the static library
user@user:~$ cd linux-lib-namespace/linux-build
user@user:~/linux-lib-namespace/linux-build$ sh linux-build-lib.sh

# Step 3: Rebuild the demo
user@user:~/linux-lib-namespace/linux-build$ cd example
user@user:~/linux-lib-namespace/linux-build/example$ sh build.sh
```

---

## Core API Features in Detail (Using Airy as an Example)

### Connection and Initialization

The prerequisite for every operation: call `init()` to establish a control connection with the LiDAR.

```cpp
#include "lidar_ctrl_driver.hpp"
#include "ctrl_driver_param.hpp"
using namespace robosense::lidar;

std::shared_ptr<LidarCtrlDriver> pCtrl = std::make_shared<LidarCtrlDriver>();

RSCtrlDriverParam param;
param.device_address = "192.168.1.200";   // LiDAR IP
param.device_port    = 6699;              // Control port (usually the same as MSOP)
param.lidar_type     = CRS_AIRY;          // LiDAR type enum

if (pCtrl->init(param))
{
    std::cout << "connect lidar success." << std::endl;
    // ... subsequent operations ...
    pCtrl->uninit();                      // Must be released when finished
}
else
{
    std::cerr << "failed to connect lidar." << std::endl;
}
```

### Querying Firmware Information

The most common diagnostic operation: reading the firmware version of each LiDAR component along with the SDK library version.

```cpp
// Read the LiDAR firmware versions
VersionRst ver;
if (pCtrl->getVersions(ver))
{
    printf("top  version: 0x%x\n", ver.topVersion);
    printf("bot  version: 0x%x\n", ver.botVersion);
    printf("app  version: 0x%x\n", ver.appVersion);
    printf("web  version: 0x%x\n", ver.webVersion);
    printf("mot  version: 0x%x\n", ver.motorVersion);
}

// Read the API library version
char libver[32];
pCtrl->getLibVer(libver);
printf("lib version: %s\n", libver);
```

| Version Field | Meaning |
| --- | --- |
| `topVersion` | Top board firmware version |
| `botVersion` | Bottom board firmware version |
| `appVersion` | Application firmware version |
| `webVersion` | Web CGI management page version |
| `motorVersion` | Motor driver version |

### Reading and Writing Network Parameters

Network parameters are the most frequently modified configuration items during LiDAR deployment. They include the LiDAR IP, destination IP, and the MSOP/DIFOP port numbers.

#### Reading the Current Network Parameters

```cpp
ConfigPara params;
pCtrl->getConfigParams(params);

printf("getConfigParams() IP is %d.%d.%d.%d\n", params.r4info.netInfo.ip[0], params.r4info.netInfo.ip[1],
    params.r4info.netInfo.ip[2], params.r4info.netInfo.ip[3]);
printf("getConfigParams() MSOP Port is %d\n", params.r4info.netInfo.msopPort);
printf("getConfigParams() DIFOP Port is %d\n", params.r4info.netInfo.difopPort);
printf("getConfigParams() remoteIp is %d.%d.%d.%d\n", params.r4info.netInfo.remoteIp[0], params.r4info.netInfo.remoteIp[1],
    params.r4info.netInfo.remoteIp[2], params.r4info.netInfo.remoteIp[3]);
```

<figure className="doc-figure">
  <img src={require('./images/img5.png').default} alt="Terminal output showing the network parameters read from the LiDAR" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 2: Result of reading the network parameters</figcaption>
</figure>

#### Modifying the Network Parameters

The modification flow: read the current parameters → modify the target fields → call `setLidarNetInfo()` to write them.

:::note
This function internally reads the current MAC address and writes it into the new parameters. Users are not allowed to modify the MAC.
:::

```cpp
NetParam_st net_params = params.r4info.netInfo;

// Modify the IP
uint8_t device_ip[4] = {192, 168, 1, 200};   // new Lidar IP
uint8_t gateway[4]   = {192, 168, 1, 1};     // new Gateway
uint8_t dest_ip[4]   = {192, 168, 1, 102};   // new Destination IP
memcpy(net_params.ip, device_ip, 4);
memcpy(net_params.gateway, gateway, 4);
memcpy(net_params.remoteIp, dest_ip, 4);

// Modify the ports (must not conflict with the IMU port 6688)
net_params.msopPort  = 6699;
net_params.difopPort = 7788;

bool rst = pCtrl->setLidarNetInfo(net_params);
printf("setLidarNetInfo() result: %d\n", (int)rst);
```

#### setIpPort() (Simplified Interface)

For scenarios where only the IP and MSOP port need to be changed, a more concise interface is available:

```cpp
char ip[32]   = {"192.168.1.168"};
char mask[32] = {"255.255.255.0"};
u16  port     = 6600;

bool rst = pCtrl->setIpPort(ip, mask, port);
```

`NetParam_st` field descriptions:

| Field | Meaning |
| --- | --- |
| `ip[4]` | The LiDAR's own IP |
| `mask[4]` | Subnet mask |
| `gateway[4]` | Gateway address |
| `remoteIp[4]` | Destination IP (the target the point cloud data is sent to) |
| `msopPort` | MSOP data port (default 6699) |
| `difopPort` | DIFOP data port (default 7788) |
| `devMac[6]` | Device MAC address (read-only) |

### Working Mode Management

Airy supports two working modes, switched via `setMode()` / `getMode()`.

| Mode Value | Meaning |
| --- | --- |
| `0` | Low power mode (sleep) |
| `1` | Normal working mode |

```cpp
int mode = -1;
pCtrl->getMode(&mode);
printf("current mode: %d\n", mode);

// Enter sleep
pCtrl->setMode(0);
sleep(10);

// Resume operation
pCtrl->setMode(1);
```

### Reading and Writing the IMU Configuration

Airy has a built-in IMU module whose configuration can be read and modified through the API. Before modifying, you must first read the current parameters, then modify them on that basis and write them back.

```cpp
// Initialize and get imu parameters
ImuParam imu;
pCtrl->getImuParams(imu);
printf("getImuParams() imu.enabled =  %d\n", imu.enabled);    // 0: disabled, 1: enabled
printf("getImuParams() imu.dataRate = %d\n", imu.dataRate);   // sampling rate
printf("getImuParams() imu.accelFsr = %d\n", imu.accelFsr);   // accelerometer full-scale range
printf("getImuParams() imu.gyroFsr = %d\n",  imu.gyroFsr);    // gyroscope full-scale range
printf("getImuParams() imu.lpf = %d\n",  imu.lpf);            // low pass filter

// Modify the imu parameter and write
imu.enabled  = 1;      // enable
imu.dataRate = 2;      // 100Hz
imu.accelFsr = 2;      // ±8g
imu.gyroFsr  = 3;      // ±2000 dps
imu.lpf      = 100;    // low pass filter value [0, 255]
pCtrl->setImuParams(imu);
sleep(1);
memset(&imu, 0, sizeof(imu));
pCtrl->getImuParams(imu);
printf("getImuParams() imu.enabled =  %d\n", imu.enabled);
printf("getImuParams() imu.dataRate = %d\n", imu.dataRate);
printf("getImuParams() imu.accelFsr = %d\n", imu.accelFsr);
printf("getImuParams() imu.gyroFsr = %d\n",  imu.gyroFsr);
printf("getImuParams() imu.lpf = %d\n",  imu.lpf);
```

:::note
You must first get the IMU parameters, modify the relevant values based on the read result, and only then write them back.
:::

The terminal output looks like this:

<figure className="doc-figure">
  <img src={require('./images/img2.png').default} alt="Terminal output of reading and writing the IMU parameters" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 3: Terminal output of reading and writing the IMU parameters</figcaption>
</figure>

The corresponding effect on the web configuration page:

|  | Before | After |
| --- | --- | --- |
| IMU parameters | <img src={require('./images/img3.png').default} alt="IMU parameters before modification" style={{maxWidth: '260px', width: '100%', height: 'auto'}} /> | <img src={require('./images/img4.png').default} alt="IMU parameters after modification" style={{maxWidth: '260px', width: '100%', height: 'auto'}} /> |

`ImuParam` struct definition:

```cpp
typedef struct ImuParam
{
    u8  enabled;     //  0 -- disabled, 1 -- enabled
    u8  dataRate;    //  0 -- 25Hz, 1 -- 50Hz, 2 -- 100Hz, 3 -- 200Hz, 4 -- 1000Hz
    u8  accelFsr;    //  0 -- [-2g, 2g], 1 -- [-4g, 4g], 2 -- [-8g, 8g], 3 -- [-16g, 16g]
    u8  gyroFsr;     //  0 -- [-250, 250] dps, 1 -- [-500, 500] dps, 2 -- [-1000, 1000] dps, 3 -- [-2000, 2000] dps
    u16 udpPort;     //  [1024, 65535]
    u16 vlanID;      //  [0, 7]
    u16 vlanPrio;    //  [0, 4094]
    u8  calibStatus; //  0 not calib; 1 is calibed
    u8  lpf;         //  [0, 255] Low pass filter
    u8  resv[8];
} ImuParam_st;
```

`ImuParam` field values:

| Field | Description |
| --- | --- |
| `enabled` | `0` disabled, `1` enabled |
| `dataRate` | `0` 25Hz, `1` 50Hz, `2` 100Hz, `3` 200Hz, `4` 1000Hz |
| `accelFsr` | `0` ±2g, `1` ±4g, `2` ±8g, `3` ±16g |
| `gyroFsr` | `0` ±250dps, `1` ±500dps, `2` ±1000dps, `3` ±2000dps |
| `udpPort` | UDP port for IMU data [1024, 65535] |
| `vlanID` | VLAN ID [0, 7] |
| `vlanPrio` | VLAN priority [0, 4094] |
| `calibStatus` | Calibration status (`0` not calibrated, `1` calibrated) |
| `lpf` | Low pass filter parameter [0, 255] |

### Firmware Upgrade (OTA)

The Airy LiDAR firmware is split into three components, which must be upgraded in sequence. **The firmware files must be placed in the same directory as the demo executable.**

<figure className="doc-figure">
  <img src={require('./images/img6.png').default} alt="Firmware files placed in the same directory as the demo executable" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 4: Directory layout of the firmware files and the demo program</figcaption>
</figure>

| Upgrade Command Enum | File Name Format | Description |
| --- | --- | --- |
| `NET_CMD_TOP_BIN_UPDATE` | `airy_xx_top_xxxxxxxx_sign.bin` | Top board firmware |
| `NET_CMD_BOT_BIN_UPDATE` | `airy_b1_bot_fpga_xxxxxxxx_sign.bit` | Bottom board firmware |
| `NET_CMD_LINUX_APP_UPDATE` | `airy_app_final.release_ps_xxx_mot_xxx.appimage.hs_fs` | Application firmware |

Upgrade example code:

```cpp
// Step 1: Upgrade the application
char fileNameApp[255] = {"airy_app_final.release_ps_25030312_mot_25021414.hs_fs"};
bool rst = pCtrl->update(NET_CMD_LINUX_APP_UPDATE, fileNameApp);
if (!rst) { printf("update %s failed.\n", fileNameApp); return -1; }

// Step 2: Upgrade the bottom board
char fileNameBot[255] = {"airy_b0_bot_fpga_10030501_sign.bit"};
rst = pCtrl->update(NET_CMD_BOT_BIN_UPDATE, fileNameBot);
if (!rst) { printf("update %s failed.\n", fileNameBot); return -1; }

// Step 3: Upgrade the top board
char fileNameTop[255] = {"airy_96_top_sign.bin"};
rst = pCtrl->update(NET_CMD_TOP_BIN_UPDATE, fileNameTop);
if (!rst) { printf("update %s failed.\n", fileNameTop); return -1; }

printf("OTA update finished.\n");
```

You can query the progress during the upgrade via `getUpdateStatus()`. The terminal output after the upgrade completes is shown below:

<figure className="doc-figure">
  <img src={require('./images/img7.png').default} alt="Terminal output after all three firmware components have been upgraded in sequence" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 5: OTA upgrade result</figcaption>
</figure>

### Reading and Writing Advanced Parameters

Airy provides the `getSupplementParams()` / `setSomeSupplementParams()` interfaces for reading and writing the commonly tuned parameters. This is the easiest entry point for parameter configuration and covers more than 80% of typical customer tuning needs.

#### Supported Parameters

| Parameter | Meaning | Value Range |
| --- | --- | --- |
| `u16FrameStartAngle` | Frame start angle | [0, 360] |
| `trailFilterLevel` | Trailing filter level | [1, 7] |
| `reflectivityEnhance` | Reflectivity enhancement | `0` off, `1` on1, `2` on2, `3` on3 |
| `rainDist` | Rain/blockage detection distance | `0` 30cm, `1` 20cm, `2` 10cm |
| `rainSensitivity` | Rain detection sensitivity | `0` high, `1` middle, `2` low |
| `blockSensitivity` | Blockage detection sensitivity | `0` high, `1` middle, `2` low |
| `deadZone10cmEn` | 10cm dead zone filtering | `0` on (filtered out), `1` off (kept) |
| `topCh81858393En` | Channel 81/85/89/93 enable | `0` off, `1` on |
| `poorPerfChnMask` | Poor-performance channel masking | `0` on (kept), `1` off (masked) |
| `gapFilling` | Gap filling | `0` off, `1` on |
| `u8RangingMode` | Ranging mode | `0` accuracy first, `1` rain/fog, `2` balanced |
| `noLeepSecond` | Leap second configuration | Time related |
| `u8RainFogSwitch` | Rain/fog switch | `0` off, `1` on |

#### Reading the Parameters

```cpp
NetInfo2_st  get_suparam = {0};
NetInfoSet_st set_suparam = {0};
bool rst = pCtrl->getSupplementParams(get_suparam, set_suparam);

if (rst)
{
    printf("trailFilterLevel:        %d\n", get_suparam.trailFilterLevel);      // [1, 7]
    printf("reflectivityEnhance:     %d\n", get_suparam.reflectivityEnhance);   // 0:off  1:on1  2:on2  3:on3
    printf("Rain Detection Distance: %d\n", get_suparam.rainDist);              // [0,3]  0:30cm  1:20cm  2:10cm
    printf("Rain Sensitivity:        %d\n", get_suparam.rainSensitivity);       // [0,2]  0:high  1:middle  2:low
    printf("Blockage Sensitivity:    %d\n", get_suparam.blockSensitivity);      // [0,2]  0:high  1:middle  2:low
    printf("Frame Start Angle:       %d\n", get_suparam.u16FrameStartAngle);    // [0,360]
    printf("DeadZone10cmEn:          %d\n", get_suparam.deadZone10cmEn);        // [0,1]  0:on  1:off
    printf("topCh81858393En:         %d\n", get_suparam.topCh81858393En);       // [0,1]  0:off  1:on
    printf("Gap Filling:             %d\n", get_suparam.gapFilling);            // [0,1]  0:off  1:on
    printf("poorPerfChnMask:         %d\n", get_suparam.poorPerfChnMask);
}
else
{
    printf("getSupplementParams() failed.\n");
}
```

:::warning
When `getSupplementParams()` succeeds, it automatically copies the values it read into `set_suparam`. If the call fails, do not go on to call `setSomeSupplementParams()`.
:::

#### Modifying the Parameters

`setSomeSupplementParams()` writes the whole parameter block at once. Therefore, before modifying the target fields, you must inherit all remaining fields one by one from the `get_suparam` read result into `set_suparam`; otherwise the unassigned fields will be written as 0. The full inheritance code is as follows:

```cpp
set_suparam.ptpNum = get_suparam.ptpNum;
set_suparam.msopVlanId = get_suparam.msopVlanId;
set_suparam.msopVlanPrio = get_suparam.msopVlanPrio;
set_suparam.difopVlanId = get_suparam.difopVlanId;
set_suparam.difopVlanPrio = get_suparam.difopVlanPrio;
set_suparam.ptpVlanId = get_suparam.ptpVlanId;
set_suparam.ptpVlanPrio = get_suparam.ptpVlanPrio;
set_suparam.respToPdelay = get_suparam.respToPdelay;
set_suparam.noLeepSecond = get_suparam.noLeepSecond;
set_suparam.syncTimeoutVal = get_suparam.syncTimeoutVal;
set_suparam.unlockToLockTime = get_suparam.unlockToLockTime;
set_suparam.lockToUnlockTime = get_suparam.lockToUnlockTime;
set_suparam.triggerMode = get_suparam.trailFilterLevel;
set_suparam.enableAngleWave = get_suparam.enableAngleWave;
set_suparam.startAngle = get_suparam.startAngle;
set_suparam.angleStep = get_suparam.angleStep;
set_suparam.angleWaveWidth = get_suparam.angleWaveWidth;
set_suparam.webCfgVer = get_suparam.webCfgVer;
set_suparam.u16FrameStartAngle = get_suparam.u16FrameStartAngle;
set_suparam.machineSlideEn = get_suparam.machineSlideEn;
set_suparam.deadZone10cmEn = get_suparam.deadZone10cmEn;
set_suparam.topCh81858393En = get_suparam.topCh81858393En;
set_suparam.poorPerfChnMask = get_suparam.poorPerfChnMask;
set_suparam.gapFilling = get_suparam.gapFilling;
set_suparam.msopPort1 = get_suparam.msopPort1;
```

Once the inheritance is done, modify the target fields and write them. Note that you **must never modify** `u8PlasticFreqSaved` and `u16PlasticFreq` (factory calibration values; changing them incorrectly will cause LiDAR malfunctions).

```cpp
set_suparam.u16FrameStartAngle = 180;    // frame start angle 180°
set_suparam.poorPerfChnMask    = 1;      // masking poor-performance channels is recommended for the survey version
set_suparam.gapFilling         = 1;      // [0,1] 0:OFF  1:ON enable gap filling
set_suparam.deadZone10cmEn     = 1;      // disable 10cm dead zone filtering
set_suparam.noLeapSecond       = 1;
memset(set_suparam.resv, 0, sizeof(set_suparam.resv));

rst = pCtrl->setSomeSupplementParams(set_suparam);
if (rst) { printf("setSomeSupplementParams() success.\n"); }
else     { printf("setSomeSupplementParams() failed.\n"); }
```

The terminal output after modifying the advanced parameters is shown below:

<figure className="doc-figure">
  <img src={require('./images/img8.png').default} alt="Terminal output of reading and writing the advanced parameters" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 6: Result of reading and writing the advanced parameters</figcaption>
</figure>

#### Single-Item Setters (Convenience Functions)

In addition to the batch `setSomeSupplementParams()` call, some advanced parameters have dedicated convenience interfaces:

```cpp
// Reflectivity enhancement: 0 off, 1 on1, 2 on2, 3 on3
pCtrl->setReflectEnhance(1);

// Trailing filter level: [1, 7]
pCtrl->setTrailFilter(5);

// GPS baud rate (see the table below)
pCtrl->setGpsBaud(0x0A);   // 115200

// Rain/blockage detection distance: [0,3]  0:30cm 1:20cm 2:10cm
pCtrl->setRainBlockDetectDistance(1);

// Rain detection sensitivity: [0,2]  0:high 1:middle 2:low
pCtrl->setRainDetectSensitivity(1);

// Blockage detection sensitivity: [0,2]  0:high 1:middle 2:low
pCtrl->setBlockDetectSensitivity(1);
```

Mapping between the `setGpsBaud()` value and the GPS baud rate:

| API level value | GPS baud rate |
| --- | --- |
| `0x03` | 9600 |
| `0x04` | 14400 |
| `0x05` | 19200 |
| `0x06` | 38400 |
| `0x07` | 43200 |
| `0x08` | 57600 |
| `0x09` | 76800 |
| `0x0A` | 115200 |
| `0x0B` | 128000 |
| `0x0C` | 230400 |
| `0x0D` | 256000 |
| `0x0E` | 460800 |
| `0x0F` | 921600 |
| `0x10` | 1382400 |

### Other Helper Functions

```cpp
// Echo mode (Airy B1): 0 strongest, 1 first, 2 last
pCtrl->setWaveMode(0);

// Time sync mode: 0 GPS, 1 E2E L4, 2 P2P L4, 3 GPTP, 4 E2E L2
pCtrl->setTimeSyncMode(0);

// Motor speed: 0 stop, 1 300rpm, 2 600rpm, 3 1200rpm
pCtrl->setMotorSpeed(2);

// Lock phase angle [0, 360]
pCtrl->setLockPhase(90);

// FOV setting [0, 360]
pCtrl->setLidarFov(0, 360);
```

:::tip
The demo code uses the `#if 0` / `#if 1` preprocessor directives to control whether each feature is enabled. Change the `#if 0` of the target block to `#if 1` to enable it, based on your actual needs; there is no need to uncomment line by line.
:::

---

## FAQ and Notes

### Building and Running on ARM Architectures

The project files provided here **support building and running on x86_64 by default**. If you need to **rebuild on an ARM architecture**, you must first remove the existing static library files and the already-built demo files. During the build, refer to the `cross_build.txt` file in the `linux-build` folder.

### getSupplementParams() and setSomeSupplementParams()

When `getSupplementParams()` succeeds, it copies the result into `set_suparam`, which then holds the complete set of current parameters. If `getSupplementParams()` fails, the contents of `set_suparam` cannot be trusted, and calling `setSomeSupplementParams()` at that point may write incorrect values.

Also note that the function signature may differ between library versions: earlier versions take a single argument, `getSupplementParams(get_suparam)`, while the current version takes two, `getSupplementParams(get_suparam, set_suparam)`. In practice, always follow the header files shipped with your package.

### Never Modify u8PlasticFreqSaved or u16PlasticFreq

The `u8PlasticFreqSaved` and `u16PlasticFreq` fields are frequency calibration parameters written at the factory. Modifying them will cause abnormal LiDAR performance. They must keep their original values in any `setSomeSupplementParams()` call.

### Reboot Recommended After Changing Network Parameters

After `setLidarNetInfo()` writes the new network parameters, the LiDAR needs to be rebooted for them to take effect (the function below takes effect by default):

```cpp
pCtrl->setLidarNetInfo(net_params);
sleep(1);
pCtrl->rebootLidar();
```

---

## API Project Files

Latest API version:

[linux-lib-namespace.zip](pathname:///downloads/API/linux-lib-namespace.zip)

API for earlier mechanical LiDARs (Helios / Ruby / Bpearl):

[linux-lib-namespace-20240819.tar.gz](pathname:///downloads/API/linux-lib-namespace-20240819.tar.gz)

