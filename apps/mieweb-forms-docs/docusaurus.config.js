// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Demo URL: use local dev server in development, production URL otherwise
const isDev = process.env.NODE_ENV === 'development';
const demoUrl = isDev 
  ? 'http://localhost:3001' 
  : 'https://questionnaire-dev-test.opensource.mieweb.org';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Forms at MIE',
  tagline: 'Embeddable FHIR-compatible questionnaire editor and renderer',
  favicon: 'img/forms_favicon.ico',

  // Algolia site verification
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'algolia-site-verification',
        content: '7461043025E608F',
      },
    },
  ],

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'mieweb', // Usually your GitHub org/user name.
  projectName: 'questionnaire-builder', // Usually your repo name.

  onBrokenLinks: 'throw',

  customFields: {
    demoUrl,
  },

  plugins: [
    function webpackConfigPlugin() {
      return {
        name: 'webpack-config-plugin',
        configureWebpack(config, isServer) {
          const path = require('path');
          
          const base = {
            resolve: {
              alias: {
                react: path.resolve(__dirname, '../../node_modules/react'),
                'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
                'react/jsx-runtime': path.resolve(__dirname, '../../node_modules/react/jsx-runtime'),
                'react/jsx-dev-runtime': path.resolve(__dirname, '../../node_modules/react/jsx-dev-runtime'),
              },
              symlinks: false,
            },
            module: {
              rules: [
                {
                  test: /\.m?js$/,
                  resolve: {
                    fullySpecified: false,
                  },
                },
              ],
            },
          };

          if (isServer) return base;

          return {
            ...base,
            ignoreWarnings: [
              /Invalid character/
            ],
            optimization: {
              ...config.optimization,
              splitChunks: {
                ...(typeof config.optimization?.splitChunks === 'object'
                  ? config.optimization.splitChunks
                  : {}),
                cacheGroups: {
                  ...(typeof config.optimization?.splitChunks === 'object'
                    ? config.optimization.splitChunks.cacheGroups
                    : {}),
                  react: {
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    name: 'react-vendor',
                    priority: 60,
                    reuseExistingChunk: true,
                    enforce: true,
                  },
                },
              },
            },
          };
        },
      };
    },
  ],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/mieweb/questionnaire-builder/tree/main/apps/mieweb-forms-docs/',
        },
        blog: false,
        theme: {
          customCss: ['./src/css/custom.css'],
        },
      }),
    ],
  ],
  
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/mie_forms_2.svg',
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'Forms',
        logo: {
          alt: 'MIE Logo',
          src: 'img/mie_icon_logo.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: demoUrl,
            label: 'Live Demo',
            position: 'left',
            target: '_self',
            className: 'header-live-demo-link',
          },
          {
            href: 'https://github.com/mieweb/questionnaire-builder',
            label: 'GitHub',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub Repository',
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
                label: 'Getting Started',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/mieweb/questionnaire-builder',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Medical Informatics Engineering, LLC.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
