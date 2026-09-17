import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {translate} from '@docusaurus/Translate';

import styles from './index.module.css';

type Section = {
  id: string;
  title: string;
  description: string;
  /** Entry document for the section, matching the navbar link. */
  to: string;
};

/**
 * The four top-level sections, in the same order as sidebars.ts. Each card
 * links to the first document of its category, which is also where the
 * matching navbar item points.
 */
function useSections(): Section[] {
  return [
    {
      id: 'lidar-technology',
      title: translate({
        id: 'homepage.section.tech.title',
        message: 'LiDAR Technology',
      }),
      description: translate({
        id: 'homepage.section.tech.desc',
        message:
          'Datasheet terminology — dToF ranging principle, accuracy vs. precision, FOV, angular resolution, range capability, and intensity — plus explanations of common phenomena such as point cloud mirroring, high-reflectivity blooming, glass detection, and window contamination.',
      }),
      to: '/docs/LiDAR Technology/lidar_technology',
    },
    {
      id: 'operation-guides',
      title: translate({
        id: 'homepage.section.guides.title',
        message: 'Operation Guides',
      }),
      description: translate({
        id: 'homepage.section.guides.desc',
        message:
          'Ethernet and 485 connection, Wireshark capture, point cloud visualization and export in RSView, parameter configuration through the web page and the LidarAssistant / M1P tools, and time synchronization.',
      }),
      to: '/docs/Getting Started/intro',
    },
    {
      id: 'developer-resources',
      title: translate({
        id: 'homepage.section.dev.title',
        message: 'Developer Resources',
      }),
      description: translate({
        id: 'homepage.section.dev.desc',
        message:
          'RS-LiDAR control API, IMU data acquisition and parsing, FAST-LIO mapping integration, and the rslidar_sdk / rs_driver ROS / ROS2 packages with their configuration and installation guides.',
      }),
      to: '/docs/RS-LiDAR API/rs_lidar_api',
    },
    {
      id: 'faq',
      title: translate({
        id: 'homepage.section.faq.title',
        message: 'FAQ',
      }),
      description: translate({
        id: 'homepage.section.faq.desc',
        message:
          'FastDDS shared memory under ROS2, recording point clouds as PCD, and the troubleshooting questions support gets asked most often about the SDK / driver and RSView.',
      }),
      to: '/docs/rslidar_sdk & rs_driver/fastdds_shared_memory',
    },
  ];
}

/** Full-width banner at the top of the page, above the card grid. */
function HomepageHeader() {
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={clsx('hero__title', styles.heroTitle)}>
          {translate({
            id: 'homepage.title',
            message: 'RoboSense Developer Center',
          })}
        </Heading>
        <p className={clsx('hero__subtitle', styles.heroSubtitle)}>
          {translate({
            id: 'homepage.tagline',
            message: 'LiDAR Information and Step-by-step Guidelines',
          })}
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/Getting Started/intro">
            {translate({id: 'homepage.cta', message: 'Read the Docs'})}
          </Link>
          <Link
            className={clsx('button button--lg', styles.heroButtonOutline)}
            href="https://www.robosense.cn/resources">
            {translate({
              id: 'homepage.cta.resources',
              message: 'Manual Resources',
            })}
          </Link>
          <Link
            className={clsx('button button--lg', styles.heroButtonOutline)}
            href="https://github.com/RoboSense-LiDAR/">
            {translate({id: 'homepage.cta.github', message: 'GitHub'})}
          </Link>
        </div>
      </div>
    </header>
  );
}

/** One card per top-level section: title, description, and nothing else. */
function SectionCard({section}: {section: Section}) {
  return (
    <Link className={styles.card} to={section.to}>
      <Heading as="h2" className={styles.cardTitle}>
        {section.title}
      </Heading>
      <p className={styles.cardDescription}>{section.description}</p>
    </Link>
  );
}

function HomepageSections({sections}: {sections: Section[]}) {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.cardGrid}>
          {sections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const sections = useSections();
  return (
    <Layout
      title={translate({
        id: 'homepage.metaTitle',
        message: 'RoboSense Development Center',
      })}
      description="RoboSense LiDAR developer documentation and step-by-step guides.">
      <HomepageHeader />
      <main>
        <HomepageSections sections={sections} />
      </main>
    </Layout>
  );
}
