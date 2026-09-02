import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'RoboSense Development Center',
  tagline: 'LiDAR Information and Step-by-step Guidelines',
  favicon: 'img/robosense_icon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // TODO: switch to a custom domain once one has been decided on.
  // Three things have to change together, or the site will 404:
  //   1. url      -> 'https://<the-new-domain>'
  //   2. baseUrl  -> '/'  (a custom domain serves from the root, so the
  //                        '/robosense-dev-center/' prefix has to go)
  //   3. add static/CNAME containing just the domain, which is how GitHub
  //      Pages recognises it
  // Prerequisite outside this repo: a DNS record for the domain pointing at
  // rs-jhyyu.github.io (CNAME for a subdomain, or A records to GitHub's IPs
  // for an apex domain), plus Settings > Pages > Custom domain in GitHub.
  // Note that every existing /robosense-dev-center/... link changes shape,
  // so anything already shared with customers will need reissuing.
  url: 'https://rs-jhyyu.github.io',
  baseUrl: '/robosense-dev-center/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'rs-jhyyu', // Usually your GitHub org/user name.
  projectName: 'robosense-dev-center', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-Hans'],
    localeConfigs: {
      en: {
        label: 'English',
      },
      'zh-Hans': {
        label: '简体中文',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    [
      // Local, offline full-text search. Builds a separate index per locale
      // (en / zh-Hans), so the Chinese site searches Chinese content and the
      // English site searches English content.
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        // Index docs only. Blog and standalone pages are not surfaced in the
        // site navigation, so they are excluded from search.
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        // Enable both English and Chinese tokenizers.
        language: ['en', 'zh'],
        // Highlight the matched terms on the target page after navigation.
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
        searchResultContextMaxLength: 50,
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'RoboSense',
      logo: {
        alt: 'RoboSense Logo',
        src: 'img/robosense.png',
      },
      items: [
        {
          type: 'search',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/RoboSense-LiDAR/rslidar_sdk',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Docs',
              to: '/docs/Getting Started/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Website',
              href: 'https://www.robosense.cn/en/',
            },
            {
              label: 'Manual Resources',
              href: 'https://www.robosense.cn/resources',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'ROS SDK & Driver',
              href: 'https://github.com/RoboSense-LiDAR/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} RoboSense. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'shell-session'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
