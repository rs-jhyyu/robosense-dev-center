---
title: M1P 小工具操作指南
sidebar_position: 4
---

工具包下载：

- [M1P_Tool_Win.7z](pathname:///downloads/LidarAssistant/M1P_Tool_Win.7z)
- [M1P_Tool_Ubuntu.zip](pathname:///downloads/LidarAssistant/M1P_Tool_Ubuntu.zip)

注：小工具支持 Ubuntu 下使用，可直接运行 `DiagCmdTool` 可执行文件。

<figure className="doc-figure">
  <img src={require('./images/m1p/image_4.png').default} alt="M1P 小工具主界面，展示各功能区域" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 1：M1P 小工具主界面</figcaption>
</figure>

## 1. 连接激光雷达

1. 激光雷达与电脑完成物理连接（航插线、网线、电源线连接正常），设备通电并正常启动。
2. 默认情况下，将电脑本地 IP 配置为激光雷达目的 IP；**出厂默认目的 IP 为 192.168.1.102，默认激光雷达 IP 为 192.168.1.200，子网掩码 255.255.255.0**。
3. 关闭电脑防火墙及其他可能阻止网络通信的安全软件，打开小工具，在下图**区域 1** 所示的 LiDAR IP 处输入当前激光雷达 IP，点击"建立连接"按钮进行连接。

## 2. 工具界面区域介绍

### 区域 1：激光雷达连接区

<figure className="doc-figure">
  <img src={require('./images/m1p/image_9.png').default} alt="激光雷达连接区，包含 Project Name 与 LiDAR IP 输入框" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 2：激光雷达连接区</figcaption>
</figure>

- **Project Name**：P0220，对应 M1P。
- **LiDAR IP**：激光雷达 IP 地址填写在此处，用于连接激光雷达。

### 区域 2：固件刷写区

<figure className="doc-figure">
  <img src={require('./images/m1p/image_1.png').default} alt="M1P 小工具的固件刷写区" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 3：固件刷写区</figcaption>
</figure>

### 区域 3：激光雷达参数配置区

<figure className="doc-figure">
  <img src={require('./images/m1p/image_2.png').default} alt="激光雷达参数配置区，展示 IP、端口、MAC 与 SN 字段" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 4：激光雷达参数配置区</figcaption>
</figure>

- **SrcIP**：激光雷达 IP 读写区域。
- **DstIP**：目的 IP 读写区域（电脑 IP 和目的 IP 需要保持一致）。
- **MSOP Port**：MSOP 端口号。
- **DIFOP Port**：DIFOP 端口号。
- **MAC**：激光雷达 MAC 地址（默认无法修改）。
- **SN**：激光雷达 SN 号码（默认无法修改）。

### 区域 4：UDS 请求区

<figure className="doc-figure">
  <img src={require('./images/m1p/image_7.png').default} alt="UDS 请求区，用于发送 UDS 请求报文" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 5：UDS 请求区</figcaption>
</figure>

- **UDS Request**：发送 UDS 请求报文，用于修改时间同步模式、PHY 芯片模式等功能。

## 3. 修改 IP 参数

<figure className="doc-figure">
  <img src={require('./images/m1p/image_5.png').default} alt="在小工具中修改激光雷达 IP 参数" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 6：修改 IP 参数</figcaption>
</figure>

## 4. 固件升级

<figure className="doc-figure">
  <img src={require('./images/m1p/image_6.png').default} alt="M1P 小工具中的固件升级操作" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 7：固件升级</figcaption>
</figure>

## 5. DID 服务

UDS 请求区支持 DID 的读写操作，常见 DID 命令如下：

| 功能 | 命令 | 取值 | 注释 |
|---|---|---|---|
| **修改时间同步模式** | 22FE0B：读取时间同步模式<br />2EFE0B：修改时间同步模式 | 00：Internal Time<br />02：PTP-E2E_L2<br />03：gPTP | 如果时间同步模式修改后不生效，请联系 RoboSense 技术支持确认固件版本 |
| **修改 PHY 芯片模式** | 22FE96：读取 PHY 芯片模式<br />2EFE96：修改 PHY 芯片模式 | 00: Master (By default)<br />01: Slave | |
| **修改回波模式** | 22F1AB：读取回波模式<br />2EF1AB：修改回波模式 | 00：双回波<br />04：最强回波 | |

**操作注意：** 写入任何 DID 命令之前，需要依次点击**客户解锁1**和**客户解锁2**按钮，解锁后有 5s 的执行命令窗口期，超过 5s 之后再点击"发送"命令会提示失败。

### 例：使用 DID 修改时间同步模式

1. 输入激光雷达 IP，连接成功后，点击"客户解锁1"和"客户解锁2"，注意每次发送 DID 指令前都要解锁一次，并且要在解锁 5 秒之内发送 DID 指令，超时需要重新解锁；

<figure className="doc-figure">
  <img src={require('./images/m1p/image_3.png').default} alt="发送 DID 指令前依次点击两个客户解锁按钮" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 8：客户解锁操作</figcaption>
</figure>

2. 在对话框输入 `2EFE0B02`，点击"发送"，即可修改同步模式为 PTP-E2E_L2 模式，默认是 gPTP 模式；

<figure className="doc-figure">
  <img src={require('./images/m1p/image_8.png').default} alt="发送写入时间同步模式的 DID 指令" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 9：发送 DID 写入指令</figcaption>
</figure>

3. 发送成功后重启激光雷达（记住：一定要断电重启，否则不生效），再次在对话框输入 `22FE0B`，如果显示 `62FE0B02`，则修改成功；

<figure className="doc-figure">
  <img src={require('./images/m1p/image.png').default} alt="回读时间同步模式以确认修改结果" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 10：回读确认结果</figcaption>
</figure>

## 6. 注意事项

1. 工具连接激光雷达之后，所有参数务必**先读后写**，避免工具中默认值覆盖掉原有参数。
2. MSOP、DIFOP 两个端口号取值均为 1025~65535，且不可设置为相同数值，避免端口冲突。
3. **激光雷达 IP 和目的 IP 必须保持在同一网段**，否则会导致设备无法正常连接。
4. 使用工具修改完激光雷达参数后，激光雷达需断电重启，参数方可生效。
