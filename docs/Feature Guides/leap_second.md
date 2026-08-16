---
title: Leap Second Offset (37s Sync Discrepancy)
sidebar_position: 2
---

# Leap Second Offset (37s Sync Discrepancy)

This page covers a single troubleshooting case of PTP/gPTP time synchronization: the LiDAR timestamp lags the clock source by exactly 37 seconds. For the full setup and verification workflow, see the [Time Synchronization Guide](./time_synchronization_guide.md).

## 1. Why exactly 37 seconds

37 seconds is the current difference between TAI and UTC.

- **TAI (PTP time)**: atomic clock time. It is continuous and does not account for the slowing of the Earth's rotation.
- **UTC**: the time used in daily life. To stay aligned with the Earth's rotation, leap seconds are inserted from time to time.
- As of today, the accumulated total of leap seconds since 1972 is 37 seconds.

## 2. The key flag: ptpTimescale (Announce message)

In linuxptp (ptp4l), this flag determines the timescale property of the clock:

- `ptpTimescale = 1` means the **PTP timescale** is in use; `ptpTimescale = 0` means the **UTC timescale** is in use.
- `ptp.v2.an.origincurrentutcoffset` is the offset between TAI and UTC that the master clock reports to the slave clock.
- When `ptpTimescale = 1`, the slave clock synchronizes by subtracting `ptp.v2.an.origincurrentutcoffset` from the master clock timestamp.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/leapsecond/image_2.jpg').default} alt="Wireshark dissection of a PTPv2 Announce message showing the PTP_TIMESCALE flag set to True and originCurrentUTCOffset equal to 37" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 1: PTP_TIMESCALE flag and originCurrentUTCOffset in an Announce message</figcaption>
</figure>

## 3. Solutions

### 3.1 Modify the linuxptp source to force `ptp_timescale=0`

In `port.c`, in the `port_tx_announce` function, clear the `PTP_TIMESCALE` flag bit instead of setting it, then rebuild linuxptp.

```c
msg->header.flagField[1] = tp.flags;
/* force the ptp_timescale flag to true */
// msg->header.flagField[1] |= PTP_TIMESCALE;
/* force the ptp_timescale flag to false */
msg->header.flagField[1] &= ~PTP_TIMESCALE;
```

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/leapsecond/image_3.jpg').default} alt="linuxptp port.c source code with the PTP_TIMESCALE flag bit being cleared in the port_tx_announce function" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 2: Forcing ptp_timescale to 0 in the linuxptp source</figcaption>
</figure>

### 3.2 Enable No Leap Second on the LiDAR web page

On the LiDAR web page, go to the Setting interface and turn on **No Leap Second** so that the leap second is ignored.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/leapsecond/image.jpg').default} alt="LiDAR web Setting interface with the No Leap Second option highlighted" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 3: The No Leap Second option on the LiDAR web Setting page</figcaption>
</figure>

### 3.3 Compensate 37s directly in the driver

Add 37 seconds to the timestamp in the corresponding decoder of the driver, for example in `decoder_RSAIRY.hpp`.

<figure style={{textAlign: 'center', margin: '0 0 1rem'}}>
  <img src={require('./images/leapsecond/image_1.jpg').default} alt="Driver source file decoder_RSAIRY.hpp with 37 seconds added to the channel timestamp calculation" style={{maxWidth: '600px', width: '100%', height: 'auto'}} />
  <figcaption style={{fontSize: '0.85em', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.4rem'}}>Figure 4: Compensating 37 seconds on the driver side</figcaption>
</figure>
