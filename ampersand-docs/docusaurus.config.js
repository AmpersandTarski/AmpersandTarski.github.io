// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// Display math equations correctly 
const math = require('remark-math');
const katex = require('rehype-katex');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Ampersand Documentation',
  tagline: 'check out the latest compiler on https://github.com/AmpersandTarski/Ampersand/releases/latest',
  url: 'https://ampersandtarski.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/ampersand-logo.jpg',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'AmpersandTarski', // Usually your GitHub org/user name.
  projectName: 'DocuGen', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
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
          routeBasePath: '/', // Serve the docs at the site's root
          sidebarPath: require.resolve('./sidebars.js'),
          remarkPlugins: [math],
          rehypePlugins: [katex],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        blog: false,
      }),
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      themeConfig: {
        docs: {
          sidebar: {
            autoCollapseCategories: true,
          },
        },
      },
      navbar: {
        title: 'Ampersand',
        logo: {
          alt: 'My Site Logo',
          src: 'img/ampersand-logo.jpg',
        },
        items: [
          {
            label: 'Documentation',
            to: '/',
            position: 'left',
          },
          {
            label: 'GitHub',
            href: 'https://github.com/AmpersandTarski',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'Documentation',
                to: '/',
              },
            ],
          },
          
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/AmpersandTarski',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} AmpersandTarski. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
