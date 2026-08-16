---
title: RS-LiDAR API 使用指南
sidebar_position: 1
---

## API 介绍

RoboSense LiDAR API 是速腾聚创提供的激光雷达控制接口库，包括配置修改、固件升级、工作模式切换等操作。

---

## 编译与运行

### 编译步骤

**Step 1**：将代码包拷贝至期望工作目录（建议 Ubuntu 20.04 及以上系统）。

**Step 2**：进入 `example` 目录，执行编译脚本：

```shell-session
user@user:~$ cd linux-lib-namespace/linux-build/example
user@user:~/linux-lib-namespace/linux-build/example$ sh build.sh
```

编译脚本会生成以下可执行程序（如有其他开发和编译需求，需在 `build.sh` 中添加待编译文件）：

| 编译产物 | 用途 |
| --- | --- |
| `airy` | Airy 雷达控制程序 |
| `helios` | Helios 系列雷达控制程序 |

### 常见编译问题

如果编译时出现类似下图的链接错误：

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/img1.png').default} alt="Ubuntu 版本不匹配导致的静态库链接错误" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 1: Ubuntu 版本不匹配导致的链接错误</figcaption>
</figure>

这通常源于 Ubuntu 版本差异，需要在本机重新编译静态库：

```shell-session
# Step 1：将代码包拷至目标 Ubuntu 机器
# Step 2：编译静态库
user@user:~$ cd linux-lib-namespace/linux-build
user@user:~/linux-lib-namespace/linux-build$ sh linux-build-lib.sh

# Step 3：重新编译 demo
user@user:~/linux-lib-namespace/linux-build$ cd example
user@user:~/linux-lib-namespace/linux-build/example$ sh build.sh
```

---

## API 核心功能详解（以 Airy 为例）

### 连接与初始化

一切操作的前提：调用 `init()` 建立与雷达的控制连接。

```cpp
#include "lidar_ctrl_driver.hpp"
#include "ctrl_driver_param.hpp"
using namespace robosense::lidar;

std::shared_ptr<LidarCtrlDriver> pCtrl = std::make_shared<LidarCtrlDriver>();

RSCtrlDriverParam param;
param.device_address = "192.168.1.200";   // 雷达 IP
param.device_port    = 6699;              // 控制端口（通常与 MSOP 一致）
param.lidar_type     = CRS_AIRY;          // 雷达类型枚举

if (pCtrl->init(param))
{
    std::cout << "connect lidar success." << std::endl;
    // ... 后续操作 ...
    pCtrl->uninit();                      // 使用完毕必须释放
}
else
{
    std::cerr << "failed to connect lidar." << std::endl;
}
```

### 固件信息查询

最常用的诊断操作，读取雷达各组件固件版本和 SDK 库版本。

```cpp
// 读取雷达固件版本
VersionRst ver;
if (pCtrl->getVersions(ver))
{
    printf("top  version: 0x%x\n", ver.topVersion);
    printf("bot  version: 0x%x\n", ver.botVersion);
    printf("app  version: 0x%x\n", ver.appVersion);
    printf("web  version: 0x%x\n", ver.webVersion);
    printf("mot  version: 0x%x\n", ver.motorVersion);
}

// 读取 API 库版本
char libver[32];
pCtrl->getLibVer(libver);
printf("lib version: %s\n", libver);
```

| 版本字段 | 含义 |
| --- | --- |
| `topVersion` | 顶板固件版本 |
| `botVersion` | 底板固件版本 |
| `appVersion` | 应用程序固件版本 |
| `webVersion` | Web CGI 管理页面版本 |
| `motorVersion` | 电机驱动版本 |

### 网络参数读写

网络参数是雷达部署中最常修改的配置项，包括雷达 IP、目的 IP、MSOP/DIFOP 端口号等。

#### 读取当前网络参数

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

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/img5.png').default} alt="终端打印的雷达网络参数读取结果" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 2: 网络参数读取结果</figcaption>
</figure>

#### 修改网络参数

修改流程：读取当前参数 → 修改目标字段 → 调用 `setLidarNetInfo()` 写入。

:::note
该函数内部会自动读取当前 MAC 地址并写入新参数，不允许用户修改 MAC。
:::

```cpp
NetParam_st net_params = params.r4info.netInfo;

// 修改 IP
uint8_t device_ip[4] = {192, 168, 1, 200};   // new Lidar IP
uint8_t gateway[4]   = {192, 168, 1, 1};     // new Gateway
uint8_t dest_ip[4]   = {192, 168, 1, 102};   // new Destination IP
memcpy(net_params.ip, device_ip, 4);
memcpy(net_params.gateway, gateway, 4);
memcpy(net_params.remoteIp, dest_ip, 4);

// 修改端口（不能与 IMU 端口 6688 冲突）
net_params.msopPort  = 6699;
net_params.difopPort = 7788;

bool rst = pCtrl->setLidarNetInfo(net_params);
printf("setLidarNetInfo() result: %d\n", (int)rst);
```

#### setIpPort()（简化接口）

对于只需要改 IP 和 MSOP 端口的场景，可以使用更简洁的接口：

```cpp
char ip[32]   = {"192.168.1.168"};
char mask[32] = {"255.255.255.0"};
u16  port     = 6600;

bool rst = pCtrl->setIpPort(ip, mask, port);
```

`NetParam_st` 字段说明：

| 字段 | 含义 |
| --- | --- |
| `ip[4]` | 雷达自身 IP |
| `mask[4]` | 子网掩码 |
| `gateway[4]` | 网关地址 |
| `remoteIp[4]` | 目的 IP（点云数据发送目标） |
| `msopPort` | MSOP 数据端口（默认 6699） |
| `difopPort` | DIFOP 数据端口（默认 7788） |
| `devMac[6]` | 设备 MAC 地址（只读） |

### 工作模式管理

Airy 支持两种工作模式，通过 `setMode()` / `getMode()` 切换。

| 模式值 | 含义 |
| --- | --- |
| `0` | 低功耗模式（休眠） |
| `1` | 正常工作模式 |

```cpp
int mode = -1;
pCtrl->getMode(&mode);
printf("current mode: %d\n", mode);

// 进入休眠
pCtrl->setMode(0);
sleep(10);

// 恢复工作
pCtrl->setMode(1);
```

### IMU 配置读写

Airy 内置 IMU 模块，可通过 API 读取和修改其配置。修改前必须先读取当前参数，在此基础上修改后再写入。

```cpp
// Initialize and get imu parameters
ImuParam imu;
pCtrl->getImuParams(imu);
printf("getImuParams() imu.enabled =  %d\n", imu.enabled);    // 0: 禁用, 1: 启用
printf("getImuParams() imu.dataRate = %d\n", imu.dataRate);   // 采样率
printf("getImuParams() imu.accelFsr = %d\n", imu.accelFsr);   // 加速度计量程
printf("getImuParams() imu.gyroFsr = %d\n",  imu.gyroFsr);    // 陀螺仪量程
printf("getImuParams() imu.lpf = %d\n",  imu.lpf);            // 低通滤波

// Modify the imu parameter and write
imu.enabled  = 1;      // 启用
imu.dataRate = 2;      // 100Hz
imu.accelFsr = 2;      // ±8g
imu.gyroFsr  = 3;      // ±2000 dps
imu.lpf      = 100;    // 低通滤波值 [0, 255]
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
必须先获取 IMU 参数，在读取结果的基础上修改相应的值，然后再写回。
:::

终端运行结果如下：

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/img2.png').default} alt="IMU 参数读写的终端输出" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 3: IMU 参数读写的终端输出</figcaption>
</figure>

Web 端配置页面上的对照效果：

|  | 修改前 | 修改后 |
| --- | --- | --- |
| IMU 参数 | <img src={require('./images/img3.png').default} alt="IMU 参数修改前" style={{maxWidth: '260px', width: '100%', height: 'auto'}} /> | <img src={require('./images/img4.png').default} alt="IMU 参数修改后" style={{maxWidth: '260px', width: '100%', height: 'auto'}} /> |

`ImuParam` 结构体定义：

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

`ImuParam` 各字段取值：

| 字段 | 说明 |
| --- | --- |
| `enabled` | `0` 禁用, `1` 启用 |
| `dataRate` | `0` 25Hz, `1` 50Hz, `2` 100Hz, `3` 200Hz, `4` 1000Hz |
| `accelFsr` | `0` ±2g, `1` ±4g, `2` ±8g, `3` ±16g |
| `gyroFsr` | `0` ±250dps, `1` ±500dps, `2` ±1000dps, `3` ±2000dps |
| `udpPort` | IMU 数据 UDP 端口 [1024, 65535] |
| `vlanID` | VLAN ID [0, 7] |
| `vlanPrio` | VLAN 优先级 [0, 4094] |
| `calibStatus` | 标定状态（`0` 未标定, `1` 已标定） |
| `lpf` | 低通滤波参数 [0, 255] |

### 固件升级（OTA）

Airy 雷达固件分为三个组件，升级时需依次执行。**固件文件需与 demo 可执行程序放在同一目录下**。

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/img6.png').default} alt="固件文件与 demo 可执行程序放在同一目录下" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 4: 固件文件与 demo 程序的目录结构</figcaption>
</figure>

| 升级指令枚举 | 文件名格式 | 说明 |
| --- | --- | --- |
| `NET_CMD_TOP_BIN_UPDATE` | `airy_xx_top_xxxxxxxx_sign.bin` | 顶板固件 |
| `NET_CMD_BOT_BIN_UPDATE` | `airy_b1_bot_fpga_xxxxxxxx_sign.bit` | 底板固件 |
| `NET_CMD_LINUX_APP_UPDATE` | `airy_app_final.release_ps_xxx_mot_xxx.appimage.hs_fs` | 应用程序固件 |

升级示例代码：

```cpp
// Step 1：升级应用程序
char fileNameApp[255] = {"airy_app_final.release_ps_25030312_mot_25021414.hs_fs"};
bool rst = pCtrl->update(NET_CMD_LINUX_APP_UPDATE, fileNameApp);
if (!rst) { printf("update %s failed.\n", fileNameApp); return -1; }

// Step 2：升级底板
char fileNameBot[255] = {"airy_b0_bot_fpga_10030501_sign.bit"};
rst = pCtrl->update(NET_CMD_BOT_BIN_UPDATE, fileNameBot);
if (!rst) { printf("update %s failed.\n", fileNameBot); return -1; }

// Step 3：升级顶板
char fileNameTop[255] = {"airy_96_top_sign.bin"};
rst = pCtrl->update(NET_CMD_TOP_BIN_UPDATE, fileNameTop);
if (!rst) { printf("update %s failed.\n", fileNameTop); return -1; }

printf("OTA update finished.\n");
```

升级过程中可通过 `getUpdateStatus()` 查询进度。升级完成后的终端输出如下：

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/img7.png').default} alt="三个固件组件依次升级完成的终端输出" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 5: OTA 升级结果</figcaption>
</figure>

### 进阶参数读写

Airy 提供了 `getSupplementParams()` / `setSomeSupplementParams()` 接口，用于读写常用的调参项。这是最易用的参数配置入口，涵盖了客户 80% 以上的调参需求。

#### 支持的功能列表

| 参数名 | 含义 | 取值范围 |
| --- | --- | --- |
| `u16FrameStartAngle` | 缺口角起始角度 | [0, 360] |
| `trailFilterLevel` | 拖尾滤波等级 | [1, 7] |
| `reflectivityEnhance` | 反射率增强 | `0` off, `1` on1, `2` on2, `3` on3 |
| `rainDist` | 雨/遮挡检测距离 | `0` 30cm, `1` 20cm, `2` 10cm |
| `rainSensitivity` | 雨点检测灵敏度 | `0` high, `1` middle, `2` low |
| `blockSensitivity` | 遮挡检测灵敏度 | `0` high, `1` middle, `2` low |
| `deadZone10cmEn` | 10cm 盲区过滤 | `0` on（滤除）, `1` off（保留） |
| `topCh81858393En` | 通道 81/85/89/93 使能 | `0` off, `1` on |
| `poorPerfChnMask` | 低性能通道屏蔽 | `0` on（保留）, `1` off（屏蔽） |
| `gapFilling` | 缝隙填充 | `0` off, `1` on |
| `u8RangingMode` | 测距模式 | `0` 精度优先, `1` 雨雾, `2` 平衡 |
| `noLeepSecond` | 闰秒配置 | 时间相关 |
| `u8RainFogSwitch` | 雨雾开关 | `0` 关闭, `1` 打开 |

#### 读取参数

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
`getSupplementParams()` 调用成功时，会将读取到的值自动复制到 `set_suparam`。如果调用失败，不要继续调用 `setSomeSupplementParams()`。
:::

#### 修改参数

`setSomeSupplementParams()` 是整体写入，因此在修改目标字段之前，必须把其余字段从 `get_suparam` 的读取结果逐一继承到 `set_suparam`，否则未赋值的字段会被写成 0。完整的继承写法如下：

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

继承完成后再修改目标字段并写入。注意**严禁修改** `u8PlasticFreqSaved` 和 `u16PlasticFreq`（出厂标定值，改错会导致雷达异常）。

```cpp
set_suparam.u16FrameStartAngle = 180;    // 缺口角起始角度 180°
set_suparam.poorPerfChnMask    = 1;      // 测绘版建议屏蔽低性能通道
set_suparam.gapFilling         = 1;      // [0,1] 0:OFF  1:ON 开启缝隙填充
set_suparam.deadZone10cmEn     = 1;      // 关闭 10cm 盲区过滤
set_suparam.noLeapSecond       = 1;
memset(set_suparam.resv, 0, sizeof(set_suparam.resv));

rst = pCtrl->setSomeSupplementParams(set_suparam);
if (rst) { printf("setSomeSupplementParams() success.\n"); }
else     { printf("setSomeSupplementParams() failed.\n"); }
```

进阶参数修改后的终端输出如下：

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/img8.png').default} alt="进阶参数读写的终端输出" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 6: 进阶参数读写结果</figcaption>
</figure>

#### 单项设置接口（便捷函数）

除 `setSomeSupplementParams()` 批量设置外，部分进阶参数提供了单独的便捷接口：

```cpp
// 反射率增强：0 off, 1 on1, 2 on2, 3 on3
pCtrl->setReflectEnhance(1);

// 拖尾滤波等级：[1, 7]
pCtrl->setTrailFilter(5);

// GPS 波特率（见下表）
pCtrl->setGpsBaud(0x0A);   // 115200

// 雨/遮挡检测距离：[0,3]  0:30cm 1:20cm 2:10cm
pCtrl->setRainBlockDetectDistance(1);

// 雨点检测灵敏度：[0,2]  0:high 1:middle 2:low
pCtrl->setRainDetectSensitivity(1);

// 遮挡检测灵敏度：[0,2]  0:high 1:middle 2:low
pCtrl->setBlockDetectSensitivity(1);
```

`setGpsBaud()` 的取值与 GPS 波特率对应关系：

| API level 值 | GPS 波特率 |
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

### 其他辅助函数

```cpp
// 回波模式（Airy B1）: 0 strongest, 1 first, 2 last
pCtrl->setWaveMode(0);

// 时间同步模式: 0 GPS, 1 E2E L4, 2 P2P L4, 3 GPTP, 4 E2E L2
pCtrl->setTimeSyncMode(0);

// 电机转速: 0 停止, 1 300rpm, 2 600rpm, 3 1200rpm
pCtrl->setMotorSpeed(2);

// 锁相角度 [0, 360]
pCtrl->setLockPhase(90);

// FOV 设置 [0, 360]
pCtrl->setLidarFov(0, 360);
```

:::tip
demo 代码中使用 `#if 0` / `#if 1` 预编译指令控制各个功能是否启用。用户可根据实际需求将目标块的 `#if 0` 改为 `#if 1` 即可启用，无需逐行取消注释。
:::

---

## 常见问题与注意事项

### ARM 架构下编译运行

本文提供的工程文件**默认支持 x86_64 架构下的编译运行**。如果需要在 **ARM 架构下重新编译**，则需要首先清除现有的静态库文件和已经编译好的 demo 文件；编译时可同步参考 `linux-build` 文件夹下的 `cross_build.txt` 文件。

### getSupplementParams() 与 setSomeSupplementParams()

`getSupplementParams()` 成功时会将结果复制到 `set_suparam`，此时 `set_suparam` 中包含了完整的当前参数。如果 `getSupplementParams()` 失败，`set_suparam` 的内容不可信，此时调用 `setSomeSupplementParams()` 可能写入错误值。

另外需注意，不同库版本的函数签名可能不同：早期版本为单参数形式 `getSupplementParams(get_suparam)`，当前版本为双参数形式 `getSupplementParams(get_suparam, set_suparam)`。实际使用时请以随包头文件为准。

### 严禁修改 u8PlasticFreqSaved 和 u16PlasticFreq

`u8PlasticFreqSaved` 和 `u16PlasticFreq` 两个字段是出厂时写入的频率标定参数，修改后会导致雷达性能异常。在 `setSomeSupplementParams()` 调用中必须保持其原始值。

### 网络参数修改后建议重启

`setLidarNetInfo()` 写入新网络参数后，需要重启雷达才能生效（下方函数默认生效）：

```cpp
pCtrl->setLidarNetInfo(net_params);
sleep(1);
pCtrl->rebootLidar();
```

---

## API 工程文件

最新版本 API：

[linux-lib-namespace.zip](pathname:///downloads/API/linux-lib-namespace.zip)

早期机械式雷达 API（Helios / Ruby / Bpearl）：

[linux-lib-namespace-20240819.tar.gz](pathname:///downloads/API/linux-lib-namespace-20240819.tar.gz)

