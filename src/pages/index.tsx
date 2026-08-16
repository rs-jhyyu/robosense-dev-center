import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Translate, {translate} from '@docusaurus/Translate';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={clsx('hero__title', styles.heroTitle)}>
          <Translate id="homepage.title">RoboSense Developer Center</Translate>
        </Heading>
        <p className={clsx('hero__subtitle', styles.heroSubtitle)}>
          <Translate id="homepage.tagline">
            LiDAR Information and Step-by-step Guidelines
          </Translate>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/Getting Started/intro">
            <Translate id="homepage.cta">Read the Docs</Translate>
          </Link>
        </div>
      </div>
    </header>
  );
}

type FeatureItem = {
  icon: string;
  titleId: string;
  title: string;
  descId: string;
  description: string;
  to: string;
};

const FEATURES: FeatureItem[] = [
  {
    icon: '🔌',
    titleId: 'homepage.card.gettingStarted.title',
    title: 'Getting Started',
    descId: 'homepage.card.gettingStarted.desc',
    description:
      'Wire up the LiDAR, configure the network, and capture your first packets.',
    to: '/docs/Getting Started/intro',
  },
  {
    icon: '📡',
    titleId: 'homepage.card.rsview.title',
    title: 'RSView',
    descId: 'homepage.card.rsview.desc',
    description:
      'Visualize LiDAR point clouds, play back PCAP files, and inspect data in real time.',
    to: '/docs/RSView/quick_start',
  },
  {
    icon: '🛠️',
    titleId: 'homepage.card.tools.title',
    title: 'Configuration Tools',
    descId: 'homepage.card.tools.desc',
    description:
      'Set IP and ports, upgrade firmware, and diagnose the LiDAR from the web page or the desktop tools.',
    to: '/docs/Configuration Tools/web_configuration',
  },
  {
    icon: '🧩',
    titleId: 'homepage.card.sdk.title',
    title: 'rslidar_sdk & rs_driver',
    descId: 'homepage.card.sdk.desc',
    description:
      'Integrate RoboSense LiDAR into your applications with the SDK and driver.',
    to: '/docs/rslidar_sdk & rs_driver/introduction',
  },
  {
    icon: '⌨️',
    titleId: 'homepage.card.api.title',
    title: 'RS-LiDAR API',
    descId: 'homepage.card.api.desc',
    description:
      'Control and configure the LiDAR programmatically with the C++ control library.',
    to: '/docs/RS-LiDAR API/rs_lidar_api',
  },
  {
    icon: '🕐',
    titleId: 'homepage.card.features.title',
    title: 'Feature Guides',
    descId: 'homepage.card.features.desc',
    description:
      'Time synchronization, IMU data, and SLAM integration explained step by step.',
    to: '/docs/Feature Guides/time_synchronization_guide',
  },
];

function FeatureCard({item}: {item: FeatureItem}) {
  return (
    <Link className={styles.card} to={item.to}>
      <div className={styles.cardIcon}>{item.icon}</div>
      <div className={styles.cardTitle}>
        <Translate id={item.titleId}>{item.title}</Translate>
      </div>
      <p className={styles.cardDescription}>
        <Translate id={item.descId}>{item.description}</Translate>
      </p>
      <span className={styles.cardArrow}>
        <Translate id="homepage.card.learnMore">Learn more →</Translate>
      </span>
    </Link>
  );
}

function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          <Translate id="homepage.section.title">Explore the Docs</Translate>
        </Heading>
        <p className={styles.sectionSubtitle}>
          <Translate id="homepage.section.subtitle">
            Everything you need to get started with RoboSense LiDAR.
          </Translate>
        </p>
        <div className="row">
          {FEATURES.map((item) => (
            <div className="col col--4" key={item.titleId}>
              <FeatureCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={translate({
        id: 'homepage.metaTitle',
        message: `Hello from ${siteConfig.title}`,
      })}
      description="RoboSense LiDAR developer documentation and step-by-step guides.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
