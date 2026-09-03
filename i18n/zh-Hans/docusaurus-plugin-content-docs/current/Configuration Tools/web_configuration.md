---
title: Web 端配置指南（Airy / Fairy）
sidebar_position: 1
---

Airy 与 Fairy 激光雷达均内置 Web 端界面，可用于参数配置与固件升级。两款机型的操作流程完全一致，仅界面截图不同，机型差异截图在下文各小节中分别给出。

## 1. 前置条件

1. 激光雷达与电脑完成物理连接（航插线、网线、电源线连接正常），设备通电并正常启动。
2. 配置电脑本地 IP 与激光雷达同网段（默认激光雷达 IP：192.168.1.200，建议电脑 IP：192.168.1.102，子网掩码 255.255.255.0）。
3. 关闭防火墙及安全软件，使用 Chrome/Edge/Firefox 等主流浏览器访问。

## 2. Web 端访问操作流程

确认激光雷达和电脑的网络连接正常，在浏览器输入激光雷达 Device IP，**出厂默认地址为 192.168.1.200**；若已修改过激光雷达 IP，输入修改后的新 IP 地址，即可进入激光雷达 Web 端界面。

### 2.1 Airy

<figure className="doc-figure">
  <img src={require('./images/web/image_2.png').default} alt="浏览器中打开的 Airy 激光雷达 Web 端首页" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 1：Airy Web 端首页</figcaption>
</figure>

### 2.2 Fairy

<figure className="doc-figure">
  <img src={require('./images/web-fairy/image_3.png').default} alt="浏览器中打开的 Fairy 激光雷达 Web 端首页" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 2：Fairy Web 端首页</figcaption>
</figure>

## 3. Web 端参数修改操作流程

Web 端参数修改分为 **General Setting（基本参数设定）**、**Performance Setting（高级参数设定）**、**Angle Pulse Setting（角度脉冲触发设定）** 三大模块，所有参数修改完成后均需点击 **Save** 保存，提示成功即为设定生效，未点击保存则参数不发生变更。

### 3.1 General Setting（基本参数设定）

Airy：

<figure className="doc-figure">
  <img src={require('./images/web/image_3.png').default} alt="Airy General Setting 页面，展示基本网络与设备参数" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 3：Airy General Setting 页面</figcaption>
</figure>

Fairy：

<figure className="doc-figure">
  <img src={require('./images/web-fairy/image.png').default} alt="Fairy General Setting 页面，展示基本网络与设备参数" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 4：Fairy General Setting 页面</figcaption>
</figure>

按需求修改对应参数。具体参数配置规则及取值范围请参考对应机型的产品手册。

### 3.2 Performance Setting（高级参数设定）

Airy：

<figure className="doc-figure">
  <img src={require('./images/web/image_1.png').default} alt="Airy Performance Setting 页面，展示高级参数" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 5：Airy Performance Setting 页面</figcaption>
</figure>

Fairy：

<figure className="doc-figure">
  <img src={require('./images/web-fairy/image_2.png').default} alt="Fairy Performance Setting 页面，展示高级参数" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 6：Fairy Performance Setting 页面</figcaption>
</figure>

按需求修改对应参数。具体参数配置规则及取值范围请参考对应机型的产品手册。

### 3.3 Angle Pulse Setting（角度脉冲触发设定）

Airy：

<figure className="doc-figure">
  <img src={require('./images/web/image.png').default} alt="Airy Angle Pulse Setting 页面，用于角度脉冲触发配置" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 7：Airy Angle Pulse Setting 页面</figcaption>
</figure>

Fairy：

<figure className="doc-figure">
  <img src={require('./images/web-fairy/image_1.png').default} alt="Fairy Angle Pulse Setting 页面，用于角度脉冲触发配置" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 8：Fairy Angle Pulse Setting 页面</figcaption>
</figure>

按需求修改对应参数。具体参数配置规则及取值范围请参考对应机型的产品手册。

### 3.4 参数修改通用注意事项

1. Device IP 和 Destination IP 必须保持在同一网段，否则会导致设备无法正常连接。
2. MSOP、DIFOP、IMU 三个端口号取值均为 1025~65535，且不可设置为相同数值，避免端口冲突。
3. 若修改了 Device IP，后续访问 Web 端需使用新的 IP 地址，且需重新配置电脑本地 IP 至新网段。
4. 每次仅修改需调整的参数，无需修改的参数保持默认值，避免误操作导致设备异常。
5. 多台激光雷达组网操作时，需为每台设备配置唯一的 IP 地址和端口号，避免网段和端口冲突。

## 4. Web 端固件升级操作流程

### 4.1 升级前准备

1. 将固件包保存至电脑本地，**保存路径不可包含中文字符、特殊符号**。
2. 确保激光雷达与电脑的网络连接稳定，升级过程中不可断开连接、断电或重启设备 / 电脑。

### 4.2 固件升级步骤

<figure className="doc-figure">
  <img src={require('./images/web/ae7a6bb201acddc8e9a1e359230b0756.jpg').default} alt="Web 端固件升级页面，显示文件选择与升级按钮" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 9：固件升级页面</figcaption>
</figure>

1. 点击**选择文件**，在弹出窗口选中固件升级包。
2. 上传完成后，页面显示固件文件名及 `Update App/Bottom/Top/All` 按钮，分别对应 App、底板、主板、全部固件升级。
3. 按需求点击对应升级按钮：
    - 单独升级某一固件：点击 **Update App**、**Update Bottom** 或 **Update Top**。
    - 升级所有固件：点击 **Update All**。
4. 等待升级完成，过程中禁止其他操作，页面会显示进度 / 完成提示。
5. 提示**升级成功**即完成；需升级多个固件重复步骤 1 至 3。

### 4.3 固件升级注意事项

1. 升级包仅限 **Zip 格式**，Web 端不支持其他格式，非 Zip 格式将提示升级失败。
2. 固件包名称及路径**禁止包含中文、空格、特殊符号**，否则会解析失败。
3. 升级中需保持**供电稳定、网络通畅**，严禁断电、断网、重启设备 / 电脑或关闭浏览器，避免设备固件损坏。
4. 升级前建议记录当前固件版本（Web 端 **Device** 栏查看），方便升级后核对。
5. 升级完成后设备若短暂无响应，属正常现象，等待 1 至 2 分钟即可恢复；若长时间无响应，可断电重启（仅限升级完成后操作）。

## 5. 常见问题解决指南

1. **无法访问 Web 端**：

    - 检查激光雷达供电及电机运转状态；
    - 核对电脑本地 IP 与激光雷达 Device IP 网段、子网掩码一致性；
    - 关闭防火墙 / 安全软件，检查浏览器网络设置；
    - 更换网线、网口或电脑，排查硬件连接故障；
    - 用 Wireshark 抓包，确认设备与电脑的网络通信状态。

2. **参数修改后保存失败**：

    - 核查参数取值是否符合本文规范；
    - 确认 MSOP、DIFOP、IMU 端口号无重复；
    - 核对 Device IP 与 Destination IP 网段一致性；
    - 刷新 Web 页面、清除缓存后，重新修改并保存参数；
    - 若仍失败，重启激光雷达后再次尝试。

3. **固件升级失败**：

    - 检查固件包为官方适配的 Zip 格式；
    - 确认固件包路径无中文、空格及特殊符号；
    - 确保网络稳定，重新上传固件包升级；
    - 核实设备工作模式为 High Performance（非 Standby）；
    - 仍失败则联系 RoboSense 官方技术支持。

4. **参数修改 / 固件升级后设备工作异常**：

    - 参数修改导致故障：在 Web 端 General Setting 开启 Restore Default 恢复出厂设置，重启设备后重新配置；
    - 固件升级导致故障：立即停用设备，联系 RoboSense 官方排查，严禁自行拆解或刷机。

5. **Web 端页面加载异常 / 部分功能不可用**：

    - 更换主流浏览器重新访问；
    - 清除浏览器缓存、禁用插件后重试；
    - 重启激光雷达，刷新网络连接。
