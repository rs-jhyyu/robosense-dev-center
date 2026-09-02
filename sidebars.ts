import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * The sidebar is defined manually so the docs are grouped by what the reader is
 * trying to do, rather than by the folder they happen to live in:
 *
 *   1. LiDAR Technology       - product / technology background (placeholder for now)
 *   2. Operation Guides       - connect, operate, and configure with the tools
 *   3. Developer Resources    - API, IMU, SDK / driver, SLAM integration
 *   4. FAQ                    - the questions support gets asked most often
 *
 * Files are left where they are on disk, so every existing URL and every
 * relative link between documents keeps working.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'LiDAR Technology',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'LiDAR Technology/lidar_technology',
      },
      items: [],
    },
    {
      type: 'category',
      label: 'Operation Guides',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Getting Started',
          items: [
            'Getting Started/intro',
            'Getting Started/network_and_wireshark',
            'Getting Started/airylite_485',
          ],
        },
        {
          type: 'category',
          label: 'RSView',
          items: [
            'RSView/quick_start',
            'RSView/pointcloud_interaction',
            'RSView/advanced_operations',
          ],
        },
        {
          type: 'category',
          label: 'Configuration Tools',
          items: [
            'Configuration Tools/web_configuration',
            'Configuration Tools/E_Platform',
            'Configuration Tools/EM_Platform',
            'Configuration Tools/m1p_tool',
            'Configuration Tools/LidarAssistant Download',
          ],
        },
        {
          type: 'category',
          label: 'Time Synchronization',
          items: [
            'Feature Guides/time_synchronization_guide',
            'Feature Guides/leap_second',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Developer Resources',
      collapsed: false,
      items: [
        'RS-LiDAR API/rs_lidar_api',
        'Feature Guides/imu_guide',
        'Feature Guides/fast_lio',
        {
          type: 'category',
          label: 'rslidar_sdk & rs_driver',
          items: [
            'rslidar_sdk & rs_driver/introduction',
            'rslidar_sdk & rs_driver/configuration_guide',
            'rslidar_sdk & rs_driver/rslidar_sdk_user_guide',
            'rslidar_sdk & rs_driver/rs_driver_user_guide',
            'rslidar_sdk & rs_driver/SDK and Driver Packages',
            'rslidar_sdk & rs_driver/one_click_install',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'FAQ',
      collapsed: false,
      items: [
        'rslidar_sdk & rs_driver/fastdds_shared_memory',
        'RSView/recording_pcd',
        'rslidar_sdk & rs_driver/faq',
        'RSView/faq',
      ],
    },
  ],
};

export default sidebars;
