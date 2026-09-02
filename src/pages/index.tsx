import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {translate} from '@docusaurus/Translate';

import styles from './index.module.css';

type DocLink = {
  label: string;
  to: string;
};

/** A named group of documents, mirroring a sub-category in the doc sidebar. */
type Group = {
  label?: string;
  links: DocLink[];
};

type Section = {
  id: string;
  title: string;
  description: string;
  groups: Group[];
};

/**
 * The four top-level sections. The structure here intentionally mirrors
 * sidebars.ts one-for-one (same categories, same sub-categories, same order,
 * same documents), so the homepage index and the sidebar always agree.
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
          'Scanning principles, point cloud characteristics, coordinate systems, and product specifications. Coming soon.',
      }),
      groups: [
        {
          links: [
            {
              label: translate({
                id: 'homepage.link.tech.overview',
                message: 'Overview',
              }),
              to: '/docs/LiDAR Technology/lidar_technology',
            },
          ],
        },
      ],
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
      groups: [
        {
          label: translate({
            id: 'homepage.group.gettingStarted',
            message: 'Getting Started',
          }),
          links: [
            {
              label: translate({
                id: 'homepage.link.intro',
                message: 'Introduction',
              }),
              to: '/docs/Getting Started/intro',
            },
            {
              label: translate({
                id: 'homepage.link.network',
                message: 'Network Connection and Wireshark Capture',
              }),
              to: '/docs/Getting Started/network_and_wireshark',
            },
            {
              label: translate({
                id: 'homepage.link.airylite485',
                message: 'AiryLite 485 / Serial Version Guide',
              }),
              to: '/docs/Getting Started/airylite_485',
            },
          ],
        },
        {
          label: translate({
            id: 'homepage.group.rsview',
            message: 'RSView',
          }),
          links: [
            {
              label: translate({
                id: 'homepage.link.rsviewQuickStart',
                message: 'Quick Start',
              }),
              to: '/docs/RSView/quick_start',
            },
            {
              label: translate({
                id: 'homepage.link.pointcloudInteraction',
                message: 'Point Cloud Interaction',
              }),
              to: '/docs/RSView/pointcloud_interaction',
            },
            {
              label: translate({
                id: 'homepage.link.advancedOperations',
                message: 'Advanced Operations',
              }),
              to: '/docs/RSView/advanced_operations',
            },
          ],
        },
        {
          label: translate({
            id: 'homepage.group.configTools',
            message: 'Configuration Tools',
          }),
          links: [
            {
              label: translate({
                id: 'homepage.link.webConfig',
                message: 'Web Configuration Guide (Airy / Fairy)',
              }),
              to: '/docs/Configuration Tools/web_configuration',
            },
            {
              label: translate({
                id: 'homepage.link.ePlatform',
                message: 'E Platform',
              }),
              to: '/docs/Configuration Tools/E_Platform',
            },
            {
              label: translate({
                id: 'homepage.link.emPlatform',
                message: 'EM Platform',
              }),
              to: '/docs/Configuration Tools/EM_Platform',
            },
            {
              label: translate({
                id: 'homepage.link.m1pTool',
                message: 'M1P Tool Guide',
              }),
              to: '/docs/Configuration Tools/m1p_tool',
            },
            {
              label: translate({
                id: 'homepage.link.toolDownloads',
                message: 'Tool Downloads',
              }),
              to: '/docs/Configuration Tools/LidarAssistant Download',
            },
          ],
        },
        {
          label: translate({
            id: 'homepage.group.timeSync',
            message: 'Time Synchronization',
          }),
          links: [
            {
              label: translate({
                id: 'homepage.link.timeSync',
                message: 'Time Synchronization Guide',
              }),
              to: '/docs/Feature Guides/time_synchronization_guide',
            },
            {
              label: translate({
                id: 'homepage.link.leapSecond',
                message: 'Leap Second Offset (37s Sync Discrepancy)',
              }),
              to: '/docs/Feature Guides/leap_second',
            },
          ],
        },
      ],
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
      groups: [
        {
          links: [
            {
              label: translate({
                id: 'homepage.link.api',
                message: 'RS-LiDAR API Guide',
              }),
              to: '/docs/RS-LiDAR API/rs_lidar_api',
            },
            {
              label: translate({
                id: 'homepage.link.imu',
                message: 'IMU Data Acquisition and Parsing',
              }),
              to: '/docs/Feature Guides/imu_guide',
            },
            {
              label: translate({
                id: 'homepage.link.fastlio',
                message: 'FAST-LIO Mapping Integration',
              }),
              to: '/docs/Feature Guides/fast_lio',
            },
          ],
        },
        {
          label: translate({
            id: 'homepage.group.sdkDriver',
            message: 'rslidar_sdk & rs_driver',
          }),
          links: [
            {
              label: translate({
                id: 'homepage.link.sdkIntro',
                message: 'Introduction',
              }),
              to: '/docs/rslidar_sdk & rs_driver/introduction',
            },
            {
              label: translate({
                id: 'homepage.link.configGuide',
                message: 'Configuration Guide',
              }),
              to: '/docs/rslidar_sdk & rs_driver/configuration_guide',
            },
            {
              label: translate({
                id: 'homepage.link.sdk',
                message: 'rslidar_sdk User Guide',
              }),
              to: '/docs/rslidar_sdk & rs_driver/rslidar_sdk_user_guide',
            },
            {
              label: translate({
                id: 'homepage.link.driver',
                message: 'rs_driver User Guide',
              }),
              to: '/docs/rslidar_sdk & rs_driver/rs_driver_user_guide',
            },
            {
              label: translate({
                id: 'homepage.link.packages',
                message: 'SDK and Driver Packages',
              }),
              to: '/docs/rslidar_sdk & rs_driver/SDK and Driver Packages',
            },
            {
              label: translate({
                id: 'homepage.link.oneClickInstall',
                message: 'One-Click Install Script',
              }),
              to: '/docs/rslidar_sdk & rs_driver/one_click_install',
            },
          ],
        },
      ],
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
      groups: [
        {
          links: [
            {
              label: translate({
                id: 'homepage.link.ros2Fps',
                message: 'ROS2 Frame Rate Drop (FastDDS Shared Memory)',
              }),
              to: '/docs/rslidar_sdk & rs_driver/fastdds_shared_memory',
            },
            {
              label: translate({
                id: 'homepage.link.recordPcd',
                message: 'Recording Point Clouds as PCD in Rviz',
              }),
              to: '/docs/RSView/recording_pcd',
            },
            {
              label: translate({
                id: 'homepage.link.sdkFaq',
                message: 'SDK & Driver FAQ',
              }),
              to: '/docs/rslidar_sdk & rs_driver/faq',
            },
            {
              label: translate({
                id: 'homepage.link.rsviewFaq',
                message: 'RSView FAQ',
              }),
              to: '/docs/RSView/faq',
            },
          ],
        },
      ],
    },
  ];
}

/**
 * Left title column. Renders the same tree as the doc sidebar so the homepage
 * and the doc pages present an identical table of contents.
 */
function TitleColumn({sections}: {sections: Section[]}) {
  return (
    <aside className={styles.titleColumn}>
      <div className={styles.titleColumnInner}>
        <div className={styles.titleColumnHeading}>
          {translate({
            id: 'homepage.nav.heading',
            message: 'Contents',
          })}
        </div>
        <nav>
          <ul className={styles.titleList}>
            {sections.map((section) => (
              <li key={section.id} className={styles.titleListItem}>
                <a className={styles.titleListLink} href={`#${section.id}`}>
                  {section.title}
                </a>
                {section.groups.map((group, gi) => (
                  <div key={group.label ?? gi} className={styles.titleGroup}>
                    {group.label && (
                      <div className={styles.titleGroupLabel}>
                        {group.label}
                      </div>
                    )}
                    <ul className={styles.titleSubList}>
                      {group.links.map((link) => (
                        <li key={link.to}>
                          <Link
                            className={clsx(
                              styles.titleSubLink,
                              !group.label && styles.titleSubLinkFlat,
                            )}
                            to={link.to}>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

function SectionBlock({section, index}: {section: Section; index: number}) {
  return (
    <section className={styles.docSection} id={section.id}>
      <Heading as="h2" className={styles.docSectionTitle}>
        <span className={styles.docSectionIndex}>{index}</span>
        {section.title}
      </Heading>
      <p className={styles.docSectionDesc}>{section.description}</p>
      {section.groups.map((group, gi) => (
        <div key={group.label ?? gi} className={styles.docGroup}>
          {group.label && (
            <div className={styles.docGroupLabel}>{group.label}</div>
          )}
          <ul className={styles.docSectionLinks}>
            {group.links.map((link) => (
              <li key={link.to}>
                <Link className={styles.docSectionLink} to={link.to}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
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
      <div className={styles.page}>
        <TitleColumn sections={sections} />
        <main className={styles.content}>
          <div className={styles.contentInner}>
            <header className={styles.hero}>
              <Heading as="h1" className={styles.heroTitle}>
                {translate({
                  id: 'homepage.title',
                  message: 'RoboSense Developer Center',
                })}
              </Heading>
              <p className={styles.heroSubtitle}>
                {translate({
                  id: 'homepage.tagline',
                  message: 'LiDAR Information and Step-by-step Guidelines',
                })}
              </p>
              <div className={styles.heroLinks}>
                <Link
                  className="button button--primary"
                  to="/docs/Getting Started/intro">
                  {translate({id: 'homepage.cta', message: 'Read the Docs'})}
                </Link>
                <Link
                  className="button button--secondary button--outline"
                  href="https://www.robosense.cn/resources">
                  {translate({
                    id: 'homepage.cta.resources',
                    message: 'Manual Resources',
                  })}
                </Link>
                <Link
                  className="button button--secondary button--outline"
                  href="https://github.com/RoboSense-LiDAR/">
                  {translate({
                    id: 'homepage.cta.github',
                    message: 'GitHub',
                  })}
                </Link>
              </div>
            </header>

            {sections.map((section, i) => (
              <SectionBlock key={section.id} section={section} index={i + 1} />
            ))}
          </div>
        </main>
      </div>
    </Layout>
  );
}
