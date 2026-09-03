---
title: LiDAR Terminology
description: Ranging principles, accuracy vs. precision, FOV, angular resolution, range capability, and intensity.
---

# LiDAR Terminology

This page explains the basic terms used across RoboSense LiDAR specifications.

## Ranging Principle

All current RoboSense LiDAR products measure distance using dToF
(**D**irect **T**ime **o**f **F**light).

The basic idea: the LiDAR fires a laser pulse at the target, the pulse is
reflected off the target surface, and the receiving end of the LiDAR picks it
up. The system measures the total round-trip time **Δt** of the laser pulse
through *emission → hits target → reflection → reception*, then computes the
distance between the target and the LiDAR.

<figure className="doc-figure">
  <img src={require('./images/terminology/image_3.png').default} alt="Diagram of the dToF ranging principle" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 1: The dToF ranging principle</figcaption>
</figure>

The distance is given by:

```
R = c × Δt / 2
```

where:

- **R** — distance from the LiDAR to the target;
- **c** — speed of light;
- **Δt** — round-trip flight time of the laser pulse from emission to reception.

The division by 2 is because the laser travels *from the LiDAR to the target*
and *from the target back to the LiDAR* along the way; the measured Δt
corresponds to the **round-trip** distance, so it has to be halved to get the
one-way distance from the LiDAR to the target.

## Ranging Accuracy and Precision

In LiDAR measurement, **accuracy** (absolute accuracy) and **precision**
(relative accuracy) are two important metrics. In simple terms:

> **Accuracy (absolute)**: the deviation of the measured point cloud values
> from the true value.
> **Precision (relative)**: the dispersion of the LiDAR point cloud data
> itself.

**Affecting factors:** LiDAR precision and accuracy are mainly influenced by
target reflectivity, measurement distance, incidence angle, ambient light,
weather conditions, system signal-to-noise ratio, and system calibration.

### Absolute Accuracy

Absolute accuracy is the deviation between the average of multiple LiDAR
measurements and the true value of the target. It is also called 准度
(accuracy) in Chinese.

<figure className="doc-figure">
  <img src={require('./images/terminology/image_1.png').default} alt="Illustration of absolute accuracy" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 2: Absolute accuracy</figcaption>
</figure>

The formula and its explanation are as follows:

<figure className="doc-figure">
  <img src={require('./images/terminology/image_6.png').default} alt="Formula for absolute accuracy" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 3: Absolute accuracy formula</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/terminology/image_5.png').default} alt="Formula for absolute accuracy deviation" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 4: Deviation of the mean value</figcaption>
</figure>

The closer μ is to 0, the higher the accuracy.

### Relative Precision

Precision describes the stability of repeated measurements under the same
conditions, usually characterised by the standard deviation σ. The smaller
σ is, the smaller the dispersion of the measurements.

<figure className="doc-figure">
  <img src={require('./images/terminology/image_8.png').default} alt="Formula for relative precision" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 5: Relative precision formula</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/terminology/image.png').default} alt="Formula for the standard deviation" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 6: Standard deviation</figcaption>
</figure>

### An Intuitive Reading of Accuracy and Precision

μ characterises the absolute ranging deviation (accuracy), i.e. **how right**
the measurement is; σ characterises the ranging repeatability (precision), i.e.
**how consistent** the measurement is.

For example, if the true distance is 10.000 m and the average of several
measurements is 10.020 m, then:

```
μ = 10.020 − 10.000 = 0.02 m
```

which means there is a **+2 cm** absolute accuracy deviation. Meanwhile, if the
measurements cluster around 10.019 ~ 10.021 m, with σ ≈ 1.02 mm, the
measurements are **very consistent** even though there is an about-2-cm
systematic deviation.

<figure className="doc-figure">
  <img src={require('./images/terminology/image_7.png').default} alt="Illustration comparing accuracy and precision" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 7: Accuracy vs. precision</figcaption>
</figure>

## Field of View (FOV)

FOV (**F**ield **o**f **V**iew) defines the angular coverage of the LiDAR's
effective point cloud in space. It is usually given as HFOV (Horizontal FOV)
and VFOV (Vertical FOV).

For example, the E1R LiDAR has an FOV of 120° × 90° (HFOV 120°, VFOV 90°).

<figure className="doc-figure">
  <img src={require('./images/terminology/image_2.png').default} alt="Diagram of horizontal and vertical field of view" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 8: Field of view</figcaption>
</figure>

## Angular Resolution

FOV answers *where and how wide* the LiDAR looks; angular resolution answers
*how fine the sampling is within that field of view*.

Angular resolution is usually defined as the angle between adjacent detection
points, or the angular interval between adjacent scan lines. For a given FOV,
the smaller the angular resolution, the better the ability to capture small
targets and target contours in principle — but this usually comes at the cost
of a higher point rate, more complex scan control, or a lower frame rate.

<figure className="doc-figure">
  <img src={require('./images/terminology/image_4.png').default} alt="Diagram of angular resolution" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 9: Angular resolution</figcaption>
</figure>

## Range Capability

The **range capability** of a LiDAR is the distance range over which it can
detect a target and output valid point cloud data, under the specified test
conditions (target reflectivity, environment, etc.). It can be split into the
measurement range, the far-range performance, and the near-range performance
(blind zone). For example, the Airy datasheet lists a range capability of
**60 m (30 m @ 10% NIST)** and a blind zone of **0.1 m**, which means:

**Range capability 1 — 60 m: the measurement range.**

The maximum distance over which the LiDAR design can measure distance and
output point clouds. For LiDAR using the ToF principle, the maximum range is
related to the maximum ToF time window the system supports, i.e. the maximum
round-trip flight time of a laser pulse determines the maximum distance the
system can cover.

**Range capability 2 — 30 m @ 10% NIST: the far-range performance.**

The maximum distance at which the LiDAR can stably detect a target and form
valid point clouds under the specified target reflectivity and environmental
conditions. Since the actual detection distance depends strongly on the target
reflectivity, the industry usually uses a standard reflective plate as the test
target. For example, **30 m @ 10% NIST** means that for a standard target with
10% reflectivity, the LiDAR can achieve an effective detection distance of
about 30 m.

**Blind zone — 0.1 m: the near-range performance.**

The closest distance at which the LiDAR can detect and output valid point
clouds. When the target is closer than this, measurement may not work
normally, due to the system and other factors. Therefore, a smaller blind zone
means the LiDAR is better at detecting nearby targets.

**Affecting factors:** the actual ranging performance is affected by target
reflectivity, ambient light, weather conditions, target incidence angle, and
target size, so the range specifications must be evaluated with clearly defined
test conditions.

## Intensity

**Intensity**: the raw echo signal strength received by the LiDAR.

**Reflectivity**: an intrinsic optical property of the material of the object,
independent of distance, normalised after calibration.

Intensity information is often used for **target recognition, semantic
segmentation, and noise filtering**, etc.

For example, road markings can be extracted from the intensity information, and
high-reflectivity objects can be recognised from the intensity.

In LiDAR ranging performance tests, a standard reflective plate of a specified
reflectivity (e.g. 10% NIST) is usually used as a unified test target, so that
results across different products or different tests are comparable.

**Affecting factors:** the measured intensity is affected by the target
material, environmental conditions, and incidence angle.
