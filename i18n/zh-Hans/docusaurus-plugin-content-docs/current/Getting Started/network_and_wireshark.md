---
title: 网络连接与 Wireshark 抓包
sidebar_position: 2
---

## 一、概述

RoboSense 激光雷达（LiDAR）本质上是一种网络终端通讯设备，根据特定协议向使用端（如域控、PC 主机等）发送网络报文形式的点云数据。RoboSense 激光雷达支持多种网络参数配置：

- 激光雷达端与目的端的 IP 地址及端口号；

- 网络通讯方式，包括单播、组播及广播；

- VLAN 层配置。

本文将提供如下使用指导，可与对应型号激光雷达的《产品手册》配套使用：

- 如何正确建立激光雷达端与主机端的网络通信；

- 如何使用 Wireshark 判断通信已正确建立，并录制雷达点云数据；

- 常见使用问题排查方案。

## 二、建立激光雷达与主机的以太网通信

### 2.1 物理连接

首先，根据您已有的 RoboSense 激光雷达，找到对应的产品手册，搜索【快速连接】章节。手册中的该章节会明确告知您如何将激光雷达通过线束连接至上位机。一般情况下，我司默认出货时均会发出配套的线束、电源适配器、双端 RJ45 网线，以及转接盒（如有）。

下图是以我司 Helios32 激光雷达产品手册中的截图示意的连接方法，其他型号激光雷达同理。

<figure className="doc-figure">
  <img src={require('./images/network/image2.png').default} alt="激光雷达、转接盒、电源适配器与上位机的连接示意图" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 1：Helios32 产品手册中的连接示意图</figcaption>
</figure>

### 2.2 配置本机以太网

#### 2.2.1 Windows 系统（Win10 / Win11）

默认情况下，激光雷达出厂本机 IP（Source IP Address）为 192.168.1.200，目的 IP（Destination IP Address）为 192.168.1.102（默认单播）。出厂后首次连接 PC 时，需对本机以太网配置进行更改，操作步骤如下：

- 依次打开【控制面板】【网络和 Internet】【网络和共享中心】【更改适配器设置】，右键点击已连接激光雷达的以太网，选择【属性】，操作如图。

<figure className="doc-figure">
  <img src={require('./images/network/image3.png').default} alt="Windows 网络和共享中心界面，标出更改适配器设置入口" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 2：打开【更改适配器设置】</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/network/image4.png').default} alt="右键以太网适配器并选择属性的菜单" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 3：打开已连接激光雷达的以太网属性</figcaption>
</figure>

- 双击【Internet 协议版本 4 (TCP/IPv4)】，选择【使用下面的 IP 地址】，更改以太网的静态路由。若激光雷达为默认出厂状态，设置主机 IP 地址为 192.168.1.102，子网掩码为 255.255.255.0；若不是，则可参照本文【捕获激光雷达数据】章节中提供的方法操作。

<figure className="doc-figure">
  <img src={require('./images/network/image5.jpeg').default} alt="TCP/IPv4 属性对话框中填入静态 IP 地址与子网掩码" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 4：为主机设置静态 IP 地址与子网掩码</figcaption>
</figure>

#### 2.2.2 Linux 系统（Ubuntu）

参照以下操作步骤执行：

- 打开【Settings】-【Network】，进入网络配置界面，并配置以太网的本机 IP 及子网掩码；

<figure className="doc-figure">
  <img src={require('./images/network/image6.png').default} alt="Ubuntu 设置中的 Network 页面，显示有线连接" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 5：Ubuntu 网络配置界面</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/network/image7.png').default} alt="Ubuntu IPv4 设置为 Manual 并填入本机 IP 与子网掩码" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 6：在 Ubuntu 下配置本机 IP 及子网掩码</figcaption>
</figure>

- 单击关闭再单击开启，使得网络配置生效。

<figure className="doc-figure">
  <img src={require('./images/network/image8.png').default} alt="Ubuntu 有线连接开关，用于使配置生效" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 7：关闭再开启连接使配置生效</figcaption>
</figure>

对于默认出厂的设备来说，此时激光雷达应已与主机建立正常通讯。您可通过在 cmd 或终端中输入以下命令来确认：

```bash
ping 192.168.1.200
```

如果出现 ping 失败的问题，请参考【以太网连接与 Wireshark 使用常见问题排查】章节。

## 三、Wireshark 使用

### 3.1 安装并使用 Wireshark

#### 3.1.1 下载与安装

前往官网下载 Wireshark 最新释放版本：[https://www.wireshark.org/download.html](https://www.wireshark.org/download.html)

- Ubuntu 系统下，直接使用指令安装：

```bash
sudo apt-get install wireshark
```

- Windows 系统下，需下载安装包并根据下列步骤进行安装。

<figure className="doc-figure">
  <img src={require('./images/network/image9.png').default} alt="Windows 下 Wireshark 安装程序的欢迎界面" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 8：在 Windows 下运行 Wireshark 安装程序</figcaption>
</figure>

- 安装时，保持插件全选，特别是下图中的【Npcap 1.86】。

<figure className="doc-figure">
  <img src={require('./images/network/image10.png').default} alt="Wireshark 安装组件列表，所有插件均已勾选" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 9：安装时保持插件全选</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/network/image11.png').default} alt="Wireshark 安装界面中已勾选 Npcap 组件" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 10：确认安装 Npcap 组件</figcaption>
</figure>

#### 3.1.2 捕获激光雷达数据

右键选择【以管理员身份运行】并启动 Wireshark，在主页的【捕获】下选择已经连接激光雷达的以太网口。

<figure className="doc-figure">
  <img src={require('./images/network/image12.png').default} alt="Wireshark 启动页列出可用的抓包网络接口" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 11：选择已连接激光雷达的以太网口</figcaption>
</figure>

双击该网口开始捕获数据，若您已参照【配置本机以太网】章节中内容正确配置为出厂默认 IP，则应看到实时捕获的 UDP 数据显示，如下图。

<figure className="doc-figure">
  <img src={require('./images/network/image13.png').default} alt="Wireshark 报文列表中显示来自激光雷达的 UDP 数据" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 12：实时捕获到的激光雷达 UDP 数据</figcaption>
</figure>

若您手上的激光雷达已经被修改过网络配置，您尚不清楚应该如何设置主机 IP，那此时在该数据捕获页面中，可在搜索框中输入 `arp` 进行搜索，即可看到激光雷达与主机之间的互相寻址报文。将本机 IP 改为激光雷达试图寻找的【目的 IP】，则以太网通信正常建立，您同样会在数据捕获页面中看到激光雷达发出的 UDP 数据。

<figure className="doc-figure">
  <img src={require('./images/network/image14.png').default} alt="Wireshark 使用 arp 过滤后显示激光雷达请求的目的 IP" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 13：通过 arp 过滤查看激光雷达寻址的目的 IP</figcaption>
</figure>

#### 3.1.3 录制激光雷达数据包（抓包）

数据能够正常被 PC 接收后，您可以通过 Wireshark 来捕获并保存激光雷达数据，按以下步骤操作即可：

- 点击图示的左上方蓝色【开始捕获】按钮；

- 当您需要停止抓包时，点击图示左上方红色【停止捕获】按钮。此时这段数据已被记录；

- 点击图示【保存捕获文件】按钮，重命名并将保存类型选定为【pcap】格式。

<figure className="doc-figure">
  <img src={require('./images/network/image15.png').default} alt="Wireshark 工具栏中标出的蓝色开始捕获按钮" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 14：开始捕获数据</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/network/image16.png').default} alt="Wireshark 工具栏中标出的红色停止捕获按钮" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 15：停止捕获数据</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/network/image17.png').default} alt="Wireshark 工具栏中标出的保存捕获文件按钮" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 16：保存捕获文件</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/network/image18.png').default} alt="Wireshark 保存对话框中将保存类型选为 pcap" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 17：将保存类型选定为 pcap 格式</figcaption>
</figure>

保存下来的 .pcap 文件即为激光雷达数据文件，可在我司提供的上位机软件 RSView 中进行点云的回放与查看。关于 RSView 的具体使用指导，请参考 RSView 相关文档。

## 四、以太网连接与 Wireshark 使用常见问题排查

### 4.1 Win11 下如何配置本机以太网设置？

打开【设置】-【网络和 Internet】，点击选中连接激光雷达的以太网，在【IP 分配】位置，将 IP 分配方式选为【手动】，并在 IPv4 下输入预期的激光雷达目的 IP，如图示操作。

<figure className="doc-figure">
  <img src={require('./images/network/image19.jpeg').default} alt="Windows 11 网络和 Internet 设置页中选中以太网适配器" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 18：在 Windows 11 中打开以太网设置</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/network/image20.jpeg').default} alt="Windows 11 中将 IP 分配方式选为手动" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 19：将 IP 分配方式设置为手动</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/network/image21.jpeg').default} alt="Windows 11 IPv4 配置中填入激光雷达目的 IP" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 20：在 IPv4 下输入激光雷达目的 IP</figcaption>
</figure>

### 4.2 LiDAR IP 无法 ping 通

若出现激光雷达 IP 通过 cmd 或终端 ping 不通的情况，请参照如下步骤进行排查：

- 通过 Wireshark 检查是否正在 ping 正确的激光雷达 IP，ping 的 IP 应当与 UDP 数据包的 Source IP 保持一致，或与 arp 报文中的请求 IP 保持一致；

- 检查接线是否正确：连在主机上的网线是否松动，连在转接盒上的线束是否松动，可进行重新拔插测试，或拔插电源重新给激光雷达上电，或换用其他转接盒及网线进行交叉验证，以排除线束或转接盒的问题；

- 检查当前本机以太网配置是否正确：请参照【3.1.2 捕获激光雷达数据】章节，检查 Wireshark 中能否捕获到激光雷达发送的 UDP 数据，若没有则搜索 `arp` 查看本机以太网地址是否已配成目的 IP；

- 检查以太网网络高级配置：在以太网【属性】中，点击【配置】-【高级】，检查【VLAN ID】是否启用，若启用，对于默认出货的机器而言应设置为关闭；此外检查【连接速度和双工模式】，推荐使用【自动协商】；最后关闭【节能以太网络】及【环保节能】选项。

<figure className="doc-figure">
  <img src={require('./images/network/image22.png').default} alt="以太网适配器高级属性页中的 VLAN ID 设置项" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 21：在以太网高级属性中检查 VLAN ID 设置</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/network/image23.png').default} alt="以太网适配器高级属性页中的连接速度和双工模式及节能选项" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 22：检查连接速度和双工模式并关闭节能选项</figcaption>
</figure>

### 4.3 Ubuntu 下抓包报错

<figure className="doc-figure">
  <img src={require('./images/network/image24.png').default} alt="Ubuntu 终端中因权限不足导致的 Wireshark 抓包报错" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 23：Ubuntu 下权限不足时的抓包报错</figcaption>
</figure>

检查是否以 sudo 权限打开 Wireshark：

```bash
sudo wireshark
```

### 4.4 Linux 下不能可视化 Wireshark 时该如何抓包？

可以使用 tcpdump 指令抓取指定网口或指定 IP 的激光雷达数据：

```bash
# 用于抓取指定网口（eno1）上的数据并保存为 test.pcap 文件（命名可自行修改）
sudo tcpdump -i eno1 -w test.pcap

# 用于抓取指定 IP 192.168.1.200 发出的数据并保存为 name.pcap 文件（命名可自行修改）
sudo tcpdump src net 192.168.1.200 -w name.pcap
```

