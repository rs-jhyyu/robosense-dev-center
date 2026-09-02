---
title: AiryLite 485/串口版本使用指南
sidebar_position: 3
---

## 一、建立激光雷达与主机连接

### 1.1 连接激光雷达

激光雷达连接方式如图 1 所示。

(a) 激光雷达通过 485 接口连接转接板；

(b) 主机与转接板之间通过 USB 线进行连接；

(c) 通电后，激光雷达即可正常工作。

> **注：** AiryLite 仅支持 12～16V 电压供电，请使用稳定 12V 电源供电，严禁使用 16V 及以上电源供电。

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_9.png').default} alt="AiryLite 激光雷达通过转接板与主机 USB 连接的接线示意图" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 1：雷达连接示意图</figcaption>
</figure>

### 1.2 获取雷达数据

#### 1.2.1 Windows 系统

a. 下载串口驱动程序（[下载地址](https://www.wch.cn/downloads/CH343SER_EXE.html)），执行安装程序并完成安装。

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_2.png').default} alt="CH343 串口驱动程序下载页面" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 2：下载串口驱动程序</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_6.png').default} alt="运行 CH343 驱动安装程序" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 3：执行安装程序</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/airylite485/img_v3_02vl_c1a3d2ac-53ed-4d11-9c27-7870110b256g.png').default} alt="CH343 驱动安装窗口显示安装进行中" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 4：安装串口驱动</figcaption>
</figure>

b. 在正确完成 1.1 连接激光雷达并完成驱动安装后，查看设备管理器，确认驱动安装是否生效。若电脑识别到共 5 个端口，则表明数据链路接线正常。其中，SERIAL-A 与 SERIAL-D 为双高速串口。

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_11.png').default} alt="Windows 设备管理器列出 5 个 COM 端口，包含 SERIAL-A 与 SERIAL-D" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 5：设备管理器查看端口</figcaption>
</figure>

#### 1.2.2 Ubuntu 系统

a. 下载串口驱动程序软件包（[下载地址](https://github.com/WCHSoftGroup/ch343ser_linux)）。

b. 执行以下代码进行安装：

```shell-session
user:~/ch343ser_linux-main$ cd driver && sudo make install && cdd
# 编译成功后会在 driver 目录下生成 ch343.ko 驱动文件
user:~$ cd /usr/include/asm-generic
user:~/usr/include/asm-generic$ sudo cp termbits.h termbits.h.bak
user:~/usr/include/asm-generic$ sudo sed -i '12,19 s/^/\/\//' \
/usr/include/asm-generic/termbits.h
user:~/usr/include/asm-generic$ sudo reboot
```

> **注：** Ubuntu 环境下驱动需重启主机后生效。

c. 监听串口（需在 USB 线插入前启动监控指令）。其中编号最小和最大的两个为高速串口。

```shell-session
user:~$ udevadm monitor --udev| grep -E 'UDEV.*\(tty\)'
```

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_3.png').default} alt="udevadm monitor 终端输出中显示 ttyCH343USB 串口节点" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 6：高速串口为 ttyCH343USB0 和 ttyCH343USB3</figcaption>
</figure>

d. 给串口赋予读写权限：

```shell-session
user:~$ sudo chmod 666 /dev/ttyCH343*
```

## 二、使用 RSView

完成激光雷达与主机间连接后，即可使用 RSView 在线查看点云。

### 2.1 Windows 系统下使用 RSView

a. 打开 Sensor Network Config，按图示填入监听到的串口名称（参照章节 1.2.1 步骤 b），波特率为 4M（4000000），填完后点击 OK；

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_1.png').default} alt="RSView 的 Sensor Network Config 对话框中填入串口名称与波特率" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 7：填写配置参数</figcaption>
</figure>

b. 在工具栏项点击雷达图标打开在线雷达。也可以选择菜单项 File -> Open Sensor 打开在线雷达。

在 Sensor Type 栏选择对应的雷达类型 0352_4M，点击 OK。

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_10.png').default} alt="Windows 下 RSView 的 Sensor Type 选择对话框中选中 0352_4M" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 8：选择雷达类型</figcaption>
</figure>

### 2.2 Ubuntu 系统下使用 RSView

a. 在工具栏项点击雷达图标打开在线雷达。也可以选择菜单项 File -> Open Sensor 打开在线雷达。

在 Sensor Type 栏选择对应的雷达类型 0352_4M，点击 OK。

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_8.png').default} alt="Ubuntu 下 RSView 的 Sensor Type 选择对话框中选中 0352_4M" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 9：选择雷达类型</figcaption>
</figure>

b. 自动跳入打开 Sensor Network Config 界面，按图示填入监听到的串口名称（参照章节 1.2.2 步骤 c），波特率为 4M（4000000），填完后点击 OK；

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_12.png').default} alt="Ubuntu 下 RSView 的 Sensor Network Config 对话框中填入串口名称与波特率" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 10：填写配置参数</figcaption>
</figure>

## 三、驱动使用

### 3.1 编译驱动

a. 联系 RoboSense 工作人员获取串口激光雷达最新版本驱动。

b. 参照工程包中 README.md / README_CN.md 文件完成编译。

### 3.2 配置驱动参数

打开 src -> config -> config.yaml 文件，确认重点配置参数：

A. 数据源（msg_source）；

B. 驱动串口号（如上 1.2.2 章节）；

C. 波特率（默认双 4M）。

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_7.png').default} alt="config.yaml 内容中的 msg_source、串口与波特率配置项" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 11：常用驱动参数配置</figcaption>
</figure>

## 四、常见问题排查

### 4.1 Windows

#### 4.1.1 RSView 启动异常

程序无法打开（需关闭防火墙）以及启动报错 `No module named rsview`（程序路径不得含有非法字符）这两类问题，请参考 [RSView FAQ](../RSView/faq.md)。

<figure className="doc-figure">
  <img src={require('./images/airylite485/image.png').default} alt="Windows 防火墙设置页面中所有防火墙均已关闭" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 12：关闭防火墙</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/airylite485/img_v3_02102_067e8142-39ab-4615-8ba4-f832656ec1dg.png').default} alt="Windows 下因 RSView 程序路径含非法字符导致的报错信息" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 13：因路径含有非法字符报错</figcaption>
</figure>

#### 4.1.2 RSView 无点云

排查步骤：

1. 排查前请先确保已正确参照章节 2.1 Windows 系统下使用 RSView 完成配置；若 RSView 仍无点云输出，参考以下步骤进行排查。

2. 根据章节 1.1 连接激光雷达完成线束连接，转接板有灯光亮起，并且雷达有激光发出，说明**给电成功且雷达启动**。

<figure className="doc-figure">
  <img src={require('./images/airylite485/img_v3_02uh_d43fd878-3e57-4a58-8035-8655cfabd7bg.webp').default} alt="通过相机观察到激光雷达有激光发出" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 14：雷达有激光发出</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_4.png').default} alt="转接板指示灯亮起" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 15：转接板灯光亮起</figcaption>
</figure>

3. 打开设备管理器，电脑识别到端口（共 5 个）“COM + 数字”，表明**数据链路接线正常**。

<figure className="doc-figure">
  <img src={require('./images/airylite485/img_v3_02uh_806fd32d-7dbf-487a-8644-9b4d3606de1g.jpg').default} alt="设备管理器端口列表，确认数据链路接线正常" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 16：确认数据链路接线正常</figcaption>
</figure>

4. 打开串口监控程序 XCOM，先在串口选择窗口选择设备管理器 A 和 D 对应的 9114 串口，勾选 16 进制显示，再点击串口操作 - 打开串口，观察数据流是否滚动。

> **注意：** 请勿长时间打开串口监控，容易造成电脑卡顿。

<figure className="doc-figure">
  <img src={require('./images/airylite485/img_v3_02uh_7088f327-d2fe-407b-b5d4-ca30a8d31c4g.png').default} alt="XCOM 串口监控中滚动显示来自激光雷达的十六进制数据" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 17：查看主机是否接收到串口数据</figcaption>
</figure>

5. 以管理员身份运行 RSView 并参照章节 2.1 Windows 系统下使用 RSView 完成相关配置。

6. 若以上步骤均正确无误且 RSView 仍无法显示点云，请联系 RoboSense 技术支持。

### 4.2 Ubuntu 环境

#### 4.2.1 RSView 启动异常

启动报错 `No module named rsview`：请检查程序路径是否含有非法字符，详见 [RSView FAQ](../RSView/faq.md)。

<figure className="doc-figure">
  <img src={require('./images/airylite485/img_v3_02102_067e8142-39ab-4615-8ba4-f832656ec1dg_1.png').default} alt="Ubuntu 下因 RSView 程序路径含非法字符导致的报错信息" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 18：因路径含有非法字符报错</figcaption>
</figure>

#### 4.2.2 RSView 无点云

排查步骤：

1. 排查前请先确保已正确参照章节 2.2 Ubuntu 系统下使用 RSView 完成配置；若 RSView 仍无点云输出，参考以下步骤进行排查。

2. 根据章节 1.1 连接激光雷达完成线束连接，转接板有灯光亮起，并且雷达有激光发出，说明**给电成功且雷达启动**。

<figure className="doc-figure">
  <img src={require('./images/airylite485/img_v3_02uh_d43fd878-3e57-4a58-8035-8655cfabd7bg_1.webp').default} alt="通过相机观察到激光雷达有激光发出" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 19：雷达有激光发出</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_5.png').default} alt="转接板指示灯亮起" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 20：转接板灯光亮起</figcaption>
</figure>

3. 确认串口权限：

```shell-session
user:~$ ls -al /dev/ttyCH343*
```

确认发现串口且串口具备读、写权限。若未发现串口节点，请参考下一章节：4.2.3 未发现串口节点。

4. 打开串口监控程序 cutecom，在 Device 中选择高速串口（请参考章节 1.2.2 确认高速串口名称），再点击 Open，观察数据流是否滚动。

5. 若以上步骤均正确无误且 RSView 仍无法显示点云，请联系 RoboSense 技术支持。

#### 4.2.3 未发现串口节点

1. 检查串口驱动是否已编译成功。若正确编译会在 driver 目录下生成 ch343.ko 驱动文件。

<figure className="doc-figure">
  <img src={require('./images/airylite485/image_noext.png').default} alt="终端中列出 driver 目录下生成的 ch343.ko 驱动文件" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 21：生成的 ch343.ko 驱动文件</figcaption>
</figure>

2. 通过 lsusb 指令检查该设备是否已插入并正常工作。

3. 检查驱动是否已加载，成功时如下所示：

```shell-session
user:~$ sudo chmod 666 /dev/ttyCH343*
```

4. 若仍然未发现串口节点，可参照 https://blog.csdn.net/wch_techgroup/article/details/132173723 做进一步诊断。

5. 若以上步骤均正确无误且 RSView 仍无法显示点云，请联系 RoboSense 技术支持。

#### 4.2.4 串口驱动编译报错 insmod error could not insert module ch343.ko: key was rejected by service

原因：主机处于 Secure Boot 模式，此功能会导致驱动签名错误，阻止驱动加载。

```shell-session
user:~$ mokutil --sb-state      # 确认 Secure Boot 是否启用
```

若输出 Secure Boot enabled，则需要禁用。

禁用 Secure Boot 需通过 BIOS/UEFI 设置。操作步骤如下：

a. 重启进入 BIOS/UEFI：

1. 关机后开机，在启动时按 BIOS 键（常见键：F2、F10、Del 或 Esc，具体取决于主板）。

2. 如果 Ubuntu 已启动，运行 `sudo reboot now` 并立即按住 BIOS 键。

b. 导航到 Secure Boot 选项：

1. 在 BIOS/UEFI 界面中，使用键盘导航到 "Security" 或 "Boot" 选项卡。

2. 找到 "Secure Boot" 选项（可能名为 "Secure Boot Control" 或类似）。

c. 禁用 Secure Boot：

1. 将 "Secure Boot" 状态从 "Enabled" 改为 "Disabled"。

2. 保存更改：通常按 F10 键，选择 "Save Changes and Exit"。

3. 系统将重启。

d. 验证禁用成功：

1. 重启后进入 Ubuntu。

2. 再次运行 `mokutil --sb-state`，确保输出 SecureBoot disabled。

