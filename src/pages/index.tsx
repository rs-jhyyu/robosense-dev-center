import type {ReactNode} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Translate, {translate} from '@docusaurus/Translate';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={clsx('hero__title', styles.heroTitle)}>
          <Translate id="homepage.title">RoboSense Developer Center</Translate>
        </Heading>
        <p className={clsx('hero__subtitle', styles.heroSubtitle)}>
          <Translate id="homepage.tagline">
            LiDAR Information and Step-by-step Guidelines
          </Translate>
        </p>
      </div>
    </header>
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
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        {/* 在这里添加自定义首页内容 */}
      </main>
    </Layout>
  );
}
