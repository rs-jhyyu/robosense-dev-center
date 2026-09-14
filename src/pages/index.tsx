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
          'Scanning principles, point cloud characteristics, coordinate systems, and product specifications, including the terminology used in the datasheets and explanations of commonly seen phenomena.',
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
          'Connect the LiDAR, visualize the point cloud, configure parameters with the tools, and synchronize time.',
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
          'Control API, IMU data parsing, the ROS / ROS2 SDK and driver, and SLAM integration.',
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
          'The issues support gets asked about most often, with step-by-step fixes.',
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
