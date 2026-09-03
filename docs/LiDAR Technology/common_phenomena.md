---
title: Common Phenomena Explained
description: Mirror reflections, high-reflectivity blooming, glass detection, and window contamination.
---

# Common Phenomena Explained

This page explains several phenomena that are often seen when working with a
LiDAR, and confirms that most of them are normal optical physics rather than a
hardware or software fault.

## Point Cloud Mirroring

A mirrored point cloud is a **normal optical physical phenomenon** of the LiDAR
in certain scenes, not a malfunction of the LiDAR hardware or algorithms. The
principle is as follows:

<figure className="doc-figure">
  <img src={require('./images/phenomena/image.png').default} alt="Mirror reflection causing a point cloud ghost image" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 1: How a mirror reflection creates ghost points</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/phenomena/image_2.png').default} alt="Second illustration of a mirrored point cloud" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 2: Another example of a mirrored point cloud</figcaption>
</figure>

1. When the laser hits a smooth specular surface (such as **glass curtain
   walls, water surfaces, polished metal**, etc.), most of the energy is
   specularly reflected and does not return to the LiDAR directly;
2. This reflected laser shines on a distant high-reflectivity object (such as a
   tall building, a metal component, a high-reflectivity billboard, etc.);
3. The high-reflectivity object reflects the laser energy back along the same
   path to the mirror, and then the mirror reflects it back to the LiDAR;
4. The LiDAR computes the target position only from the round-trip time of the
   laser, and cannot account for the deflection along the way, so it mistakes
   this *indirectly reflected target* for a real target, forming a mirrored
   point (ghost point).

PS: note that in a real working scene the mirror surface can be very small, so
the mirrored points it produces may be small in scale. In some scenes they turn
into sporadic noise points that appear at a fixed angle and position; this kind
of noise tends to appear stably at a particular angle and position.

## High-Reflectivity Blooming

When the laser scans a **high-reflectivity target** (such as a high-reflection
board, a metal mirror, a white high-reflection wall, a traffic sign, etc.), the
point cloud can spread outwards and the target can look "bigger". This is
called "high-reflectivity blooming" and its core causes are:

1. **Physical level**: a high-reflectivity target reflects extremely strong
   laser energy, causing a **hot-carrier overflow effect** in the LiDAR's
   photosensitive element, which emits near-infrared crosstalk photons
   outwards;
2. **Signal level**: these crosstalk photons spread to the surrounding
   photosensitive elements, triggering "false triggers" in the nearby pixels and
   generating additional spurious point clouds;
3. **Characteristics**: the bloomed point cloud **only appears at the edge of
   the high-reflectivity target**, and its reflected intensity is significantly
   lower than that of the real target points, visually making the target look
   "bigger and blurrier"; **other non-high-reflectivity targets do not show
   this blooming-related size stretching**.

<figure className="doc-figure">
  <img src={require('./images/phenomena/image_3.png').default} alt="High-reflectivity blooming on a wall" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 3: High-reflectivity blooming</figcaption>
</figure>

<figure className="doc-figure">
  <img src={require('./images/phenomena/image_1.png').default} alt="Second example of high-reflectivity blooming" className="doc-figure-img" />
  <figcaption className="doc-figure-caption">Figure 4: Another example of high-reflectivity blooming</figcaption>
</figure>

## Glass Target Detection

### Core Factors Affecting Glass Detection

The LiDAR's ability to detect glass **depends heavily on the specifics of the
environment**, and is jointly influenced by the following key factors:

1. **Glass material itself**: glass of different thickness, coating processes,
   and transmittance varies enormously in its reflection / transmission of the
   laser;
2. **Glass contamination**: when the surface is covered with dust, water
   stains, or oil, the reflection characteristics change, which may turn the
   glass from "almost invisible" into "detectable";
3. **Laser incidence angle**: the closer the laser hits the glass to the
   specular reflection angle, the more easily the reflected energy departs from
   the LiDAR, and the harder the glass is to detect;
4. **Ambient light intensity**: in strong light, ambient light noise interferes
   with the laser echo signal, further lowering the detection probability of
   the glass target.

### An Objective Note on Optimisation

Because glass detection is affected by **multi-dimensional, dynamically
changing environmental factors**, the problem **cannot be quantified by a
single standard**, and there is no universal, perfect solution:

- Even if we optimise for a specific scene (e.g. a fixed pane of glass at a
  fixed incidence angle), when the scene changes (different glass, adjusted
  mounting angle, changed ambient light), the improvement also fluctuates
  greatly and cannot guarantee the expected result in other glass scenes;
- Forcing an algorithmic optimisation for a single glass environment may
  introduce false-detection or missed-detection risks in other scenes, harming
  the overall point cloud quality.

### A More Pragmatic Business Recommendation

We recommend shifting the business detection logic **from "detecting glass
directly" to "detecting the easily-detected solid targets around the glass"**,
which is the common and efficient approach in the industry:

- Prioritise detecting the glass's **metal frames, metal fences, and support
  structures**: these materials have a high reflectivity and stable features,
  so the LiDAR can detect them reliably, indirectly satisfying the business
  need of "locating the glass area";
- If the task is to detect "whether there is an obstruction / obstacle in the
  glass area", you can judge it indirectly by checking the integrity and
  position change of the surrounding metal structure, without relying on the
  glass's own point cloud feedback.

## Window Contamination

### Common Causes and Types of Window Contamination

The LiDAR window is the core channel for laser emission and echo reception,
directly exposed to the working environment. Contamination is mainly caused by
the following scenarios:

- Outdoor / industrial scenes: dust, sand, fluff, insect remains, rain residue,
  and oil (e.g. industrial equipment leaks, vehicle exhaust) adhere;
- High-humidity / low-temperature scenes: condensation and frost on the inside
  and outside of the window; the condensed water vapour attracts dust to form
  stains;
- Human / environmental interference: fingerprints and water marks left by
  mis-touching during inspection, or corrosive dust and chemical pollutants
  from the surrounding environment;
- Long-term use: wear and ageing of the window surface, which indirectly
  aggravates contamination (a worn surface is easier to attract dust).

### Contamination Types and Characteristics

- Light contamination: oil, thick dust, and dried water stains, with obvious
  marks on the surface;
- Heavy contamination: thick oil, corrosive stains, large-area condensation or
  frost, or scratches / damage to the window, seriously blocking the laser
  transmission channel.

### Core Impact of Contamination on the LiDAR

The window is a key part of the LiDAR optical system, and its cleanliness
directly determines the laser transmission efficiency and echo signal quality.
Contamination affects the device in multiple dimensions, as follows.

#### Degrades point cloud quality, causing detection abnormalities

- **Laser scattering and attenuation**: contamination (such as dust, water
  droplets, oil) scatters and refracts the laser as it is emitted, attenuating
  the laser energy and lowering the echo signal strength, resulting in
  "sparse point clouds and missed detections";
- **Spurious point cloud generation**: contamination reflects and scatters the
  laser, triggering false triggers in the LiDAR's photosensitive elements and
  generating spurious point clouds (such as intensified blooming and stray
  points in empty areas), interfering with target recognition and positioning;
- **Reduced ranging accuracy**: after scattering, the laser propagation path
  changes, and the target distance computed by the LiDAR from the time of
  flight (TOF) deviates, affecting core business such as obstacle avoidance and
  inspection;
- **Missing points**: contamination greatly attenuates the laser energy, so
  part of the laser cannot reflect back to the LiDAR normally, leading to
  obvious missing points, incomplete target contours, and a higher risk of
  missed detections.

#### Triggers device alarms, affecting business continuity

- Some LiDARs have window contamination detection; once contamination reaches a
  certain level, it triggers "optical abnormality" or "signal attenuation"
  alarms, causing the device to shut down or run degraded;
- In scenarios with high stability requirements, such as autonomous driving and
  industrial inspection, the point cloud abnormalities and ranging deviations
  caused by contamination may lead to business interruptions and safety risks
  (e.g. obstacle-avoidance failure, missed inspection items).

#### Association with other phenomena

It is worth noting that window contamination can aggravate the common
phenomena described above, such as high-reflectivity blooming and point cloud
mirroring: the laser scattering caused by contamination amplifies the crosstalk
effect of the photosensitive element, making the blooming at the edge of
high-reflectivity targets more obvious; meanwhile, the scattered laser may form
additional mirrored points through mirror reflection, further interfering with
point cloud quality.
