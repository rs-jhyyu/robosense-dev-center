---
title: EM 平台
sidebar_position: 2
---

# EM 平台 LidarAssistant 工具

## 1. 连接激光雷达

1. 激光雷达已与计算机完成物理连接（线束、网线、电源线连接正常），设备已上电并正常启动。
2. 将计算机的本地 IP 地址配置为与激光雷达处于同一网段（激光雷达出厂默认 IP：`192.168.1.200`，建议计算机配置为 `192.168.1.102`，子网掩码 `255.255.255.0`）。
3. 关闭计算机防火墙以及其他可能阻止网络通信的安全软件。

## 2. 工具界面区域介绍

![工具界面总览](./images/tool_interface_overview_em.png)

### 区域 1：项目选择区

- **Project Name**：EM4/EMX
- **Com Channel**：以太网通信方式

### 区域 2：激光雷达连接参数配置区

- **Local IPv4**：计算机 IP 地址，需要在计算机网卡中配置对应的 IP 地址。
- **LidarIPv4**：激光雷达 IP 地址。
- **DoIpSrcAddr**：DoIp 源 IP 地址。
- **LidarNetMask**：激光雷达 IP 地址的子网掩码。
- **DoIpPhyAddr**：目标物理地址（十六进制）。
- **DoIpFuncAddr**：目标功能地址（十六进制）。
- **DoIpPort**：DoIp 端口。
- **MsopNetData**：源端口（十进制）、目标地址、目标端口（十进制）。
- **DifopNetData**：源端口（十进制）、目标地址、目标端口（十进制）。
- **Read Parameter**：读取所有网络参数。
- **Write Parameter**：写入所有网络参数。

### 区域 3：UDS 请求区

- **UDS Request**：发送 UDS 请求报文。

### 区域 4：固件升级区

- **Fw Folder**：固件文件路径。选择固件文件夹后，软件会根据 `/project/cmd_config.xlsx` 中 FwExp 配置的正则表达式自动匹配 Sbl File、Swap File 和 Sign File。
- **Sbl File**：sbl 文件路径。
- **Swap File**：swap 文件路径。
- **Sign File**：签名文件路径。
- 点击 **Uds Flash** 按钮，将对应路径下的固件升级到激光雷达。

### 区域 5：日志输出区

- **Clear**：清空日志显示区。
- **Connect/Disconnect**：与激光雷达建立/断开连接。

## 3. 修改 IP 参数

![修改 IP 参数](./images/modify_ip_parameters_em.png)

## 4. 固件升级

![固件升级](./images/firmware_upgrade_em.png)

## 5. 注意事项

1. MSOP、DIFOP 和 DIFOP2 的端口号取值范围均为 1025 到 65535，且不能设置为相同值，以避免端口冲突。
2. LocalIPv4 与 LidarIPv4 必须处于同一网段，否则会导致设备无法正常连接。
3. 使用工具修改激光雷达参数后，需要将激光雷达断电重启，参数才能生效。
