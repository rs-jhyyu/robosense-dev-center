---
title: 激光雷达基础名词解析
description: 测距原理、准度与精度、视场角、角分辨率、测距能力与反射强度。
---

# 激光雷达基础名词解析

本页介绍速腾聚创激光雷达规格书中常见的术语。

## 测距原理

当前 RoboSense 各款激光雷达均采用 dToF（Direct Time of Flight，直接飞行时间）测距原理。

其基本原理是：激光雷达向目标发射一个激光脉冲，激光到达目标表面后发生反射，并被激光雷达的接收端探测。系统通过精确测量激光脉冲从**发射 → 到达目标 → 反射 → 接收**这一完整往返过程所经历的时间 Δt，计算目标与激光雷达之间的距离。

<figure className="doc-figure">
  <img src={require('./images/terminology/image_3.png').default} alt="dToF 测距原理示意图" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 1：dToF 测距原理</figcaption>
</figure>

距离计算公式为：

```
R = c × Δt / 2
```

其中：

- **R**：激光雷达到目标的距离；
- **c**：光速；
- **Δt**：激光脉冲从发射到接收所经历的往返飞行时间。

公式中除以 2，是因为激光在测量过程中经历了“激光雷达到目标”和“目标返回激光雷达”两个传播过程，测得的 Δt 是激光传播**往返距离**所对应的时间，因此需要除以 2 才能得到激光雷达到目标的单程距离。

## 测距精度（Accuracy 与 Precision）

在激光雷达（LiDAR）测量中，准度（绝对精度）和精度（相对精度）是两个重要的衡量指标。简单理解：

> **准度（绝对精度）**：激光雷达采集的点云测量值相对真值的偏差。
> **精度（相对精度）**：激光雷达点云数据自身的离散程度。

**影响因素**：激光雷达精度和准度主要受目标反射率、测量距离、入射角、环境光、天气条件、系统信噪比及系统标定等因素的影响。

### 绝对精度（Accuracy）

绝对精度是指激光雷达多次测量结果的平均值与目标真值之间的偏差，也称准度。

<figure className="doc-figure">
  <img src={require('./images/terminology/image_1.png').default} alt="绝对精度示意图" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 2：绝对精度</figcaption>
</figure>

计算公式与说明如下：

<figure className="doc-figure">
  <img src={require('./images/terminology/image_6.png').default} alt="绝对精度计算公式" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 3：绝对精度公式</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/terminology/image_5.png').default} alt="均值偏差计算公式" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 4：均值偏差</figcaption>
</figure>

μ 越趋于 0，准度越高。

### 相对精度（Precision）

Precision 描述相同条件下重复测量的稳定性，通常可使用标准差 σ 表征。σ 越小，说明测量数据的离散程度越小。

<figure className="doc-figure">
  <img src={require('./images/terminology/image_8.png').default} alt="相对精度计算公式" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 5：相对精度公式</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/terminology/image.png').default} alt="标准差计算公式" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 6：标准差</figcaption>
</figure>

### Accuracy / Precision 的直观理解

μ 表征绝对测距偏差（绝对精度/Accuracy），即为测得准不准；σ 表征测距重复性（相对精度/Precision），即为测得稳不稳。

例如真实距离为 10.000 m，多次测量的平均值为 10.020 m，则：

```
μ = 10.020 − 10.000 = 0.02 m
```

说明存在 +2 cm 的绝对精度偏差。期间多次测量结果都集中在 10.019 ~ 10.021 m 附近，σ ≈ 1.02 mm，说明虽然存在约 2 cm 的系统偏差，但**离散程度表现很好**。

<figure className="doc-figure">
  <img src={require('./images/terminology/image_7.png').default} alt="准度与精度对比示意图" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 7：准度 vs 精度</figcaption>
</figure>

## 视场角 FOV（Field of View）

FOV（Field of View，视场角）定义激光雷达有效点云在空间中的角度覆盖范围。通常分别给出 HFOV（Horizontal FOV，水平视场角）和 VFOV（Vertical FOV，垂直视场角）。

例如 E1R 激光雷达的 FOV 为 120° × 90°（HFOV 120°，VFOV 90°）。

<figure className="doc-figure">
  <img src={require('./images/terminology/image_2.png').default} alt="水平与垂直视场角示意图" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 8：视场角</figcaption>
</figure>

## 角分辨率（Angular Resolution）

FOV 回答“看哪里、看多广”；Angular Resolution 回答“在这个视野里采样有多细”。

角分辨率通常定义为相邻探测点方向之间的夹角或相邻扫描线的角度间隔。相同 FOV 下，角分辨率越小，理论上越有利于刻画小目标和目标轮廓，但通常需要付出更高点频、更复杂扫描控制或更低帧率等代价。

<figure className="doc-figure">
  <img src={require('./images/terminology/image_4.png').default} alt="角分辨率示意图" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">图 9：角分辨率</figcaption>
</figure>

## 测距能力（Range Capability）

**激光雷达的测距能力（Range Capability）**，是指在规定的目标反射率、环境条件等测试条件下，激光雷达能够探测目标并输出有效点云数据的距离范围。测距能力通常可进一步分为测距量程、测远性能以及测近性能（盲区）等指标。例如 Airy 参数表中标注测距能力为 **60 m（30 m @ 10% NIST）**，盲区为 **0.1 m**，具体含义如下：

**测距能力 1——60 m：即测距量程**

表示激光雷达系统在设计上能够进行距离测量并输出点云的最大距离范围。对于采用 ToF（Time of Flight，飞行时间）测距原理的激光雷达，其最大测距量程与系统可支持的最大 ToF 时间窗口相关，即能够测量的激光脉冲最大往返飞行时间决定了系统可覆盖的最大距离范围。

**测距能力 2——30 m @ 10% NIST：即测远性能**

表示在规定的目标反射率及环境条件下，激光雷达能够稳定探测目标并形成有效点云数据的最远距离。由于实际探测距离与目标反射率密切相关，行业内通常采用标准反射板作为测试目标。例如 **30 m @ 10% NIST** 表示对于反射率为 10% 的标准目标，激光雷达可实现约 30 m 的有效探测距离。

**盲区——0.1 m：即测近性能**

表示激光雷达能够正常探测并输出有效点云的最近距离。当目标距离小于该值时，受系统等因素影响，可能无法正常测量。因此，盲区越小，代表激光雷达对近距离目标的探测能力越强。

**影响因素**：激光雷达的实际测距性能受目标反射率、环境光、天气条件、目标入射角和目标尺寸等因素影响，因此测距指标必须结合明确的测试条件进行评价。

## 反射强度（Intensity）

**反射强度（Intensity）**：激光雷达收到的原始回波信号大小。

**反射率（Reflectivity）**：物体材质本身固有光学属性，和距离无关，是经过标定校正后的归一化值。

Intensity 信息通常可用于**目标识别、语义分割、噪声过滤等**。

如道路标线可以通过 Intensity 信息进行提取，高反射率物体可以通过 Intensity 进行识别等。

在激光雷达测距性能测试中，通常采用规定反射率的标准反射板，如 10% NIST，作为统一的测试目标，从而保证不同产品或不同测试结果之间具有可比性。

**影响因素**：激光雷达检测到的 Intensity 值，受目标材质、环境条件、入射角等因素影响。
