---
title: 闰秒偏差（同步慢 37 秒）
sidebar_position: 2
---

# 闰秒偏差（同步慢 37 秒）

本页仅针对 PTP/gPTP 时间同步中的一个常见问题：LiDAR 时间戳比时钟源恰好慢 37 秒。完整的配置与验证流程请参见[时间同步指南](./time_synchronization_guide.md)。

## 1. 为什么是 37 秒

37 秒为 TAI 与 UTC 的差值。

- **TAI（PTP 时间）**：原子钟时间，是连续的，不考虑地球自转减慢的影响。
- **UTC 时间**：我们日常使用的时间，为了与地球自转同步，会不定期加入“闰秒”。
- 截至目前，自 1972 年以来累计的闰秒总数为 37 秒。

## 2. 关键标志位：ptpTimescale（Announce 报文）

在 linuxptp（ptp4l）中，这个标志位决定了时钟的时间尺度属性：

- `ptpTimescale = 1` 表示使用的是 **PTP 时间尺度**；`ptpTimescale = 0` 表示使用的是 **UTC 时间尺度**。
- `ptp.v2.an.origincurrentutcoffset` 表示主时钟告知从时钟当前 TAI 和 UTC 之间的偏移量。
- 当 `ptpTimescale = 1` 时，从时钟会基于主时钟时间戳减掉 `ptp.v2.an.origincurrentutcoffset` 进行同步。

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/leapsecond/image_2.jpg').default} alt="Wireshark 解析 PTPv2 Announce 报文，PTP_TIMESCALE 标志位为 True，originCurrentUTCOffset 为 37" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>图 1：Announce 报文中的 PTP_TIMESCALE 标志位与 originCurrentUTCOffset</figcaption>
</figure>

## 3. 解决方案

### 3.1 修改 linuxptp 源码，强制 `ptp_timescale=0`

在 `port.c` 的 `port_tx_announce` 函数中，把 `PTP_TIMESCALE` 标志位由置位改为清零，然后重新编译 linuxptp。

```c
msg->header.flagField[1] = tp.flags;
/* 强制设置 ptp_timescale 标志位为 true */
// msg->header.flagField[1] |= PTP_TIMESCALE;
/* 强制设置 ptp_timescale 标志位为 false */
msg->header.flagField[1] &= ~PTP_TIMESCALE;
```

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/leapsecond/image_3.jpg').default} alt="linuxptp port.c 源码中在 port_tx_announce 函数内清除 PTP_TIMESCALE 标志位" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>图 2：在 linuxptp 源码中强制 ptp_timescale 为 0</figcaption>
</figure>

### 3.2 在雷达网页端打开 No Leap Second

在雷达网页端的 Setting 界面打开 **No Leap Second**，忽略闰秒。

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/leapsecond/image.jpg').default} alt="雷达网页 Setting 界面中高亮的 No Leap Second 选项" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>图 3：雷达网页 Setting 页面中的 No Leap Second 选项</figcaption>
</figure>

### 3.3 在驱动端直接补偿 37s

在驱动对应的解码器中给时间戳加上 37 秒，例如 `decoder_RSAIRY.hpp`。

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/leapsecond/image_1.jpg').default} alt="驱动源文件 decoder_RSAIRY.hpp 中在通道时间戳计算里加上 37 秒" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>图 4：在驱动端补偿 37 秒</figcaption>
</figure>
