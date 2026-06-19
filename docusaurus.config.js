// @ts-check
// docusaurus.config.js — Valcr API Documentation

const lightCodeTheme  = require('prism-react-renderer').themes.github
const darkCodeTheme   = require('prism-react-renderer').themes.dracula

/** @type {import('@docusaurus/types').Config} */
const config = {
  title:          'Valcr API Docs',
  tagline:        'Financial benchmark intelligence for commerce operators.',
  favicon:        'img/logo.svg',
  url:            'https://docs.valcr.site',
  baseUrl:        '/',
  organizationName: 'valcr',
  projectName:    'docs-valcr',

  onBrokenLinks:       'throw',


  i18n: { defaultLocale: 'en', locales: ['en'] },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath:    require.resolve('./sidebars.js'),
          routeBasePath: '/docs',
          editUrl:       undefined ,
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
          blogTitle:       'Valcr Blog',
          blogDescription: 'Product updates, data insights, and engineering notes.',
          postsPerPage:    8,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  markdown: {
  hooks: {
    onBrokenMarkdownLinks: 'warn',
  },
},

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/favicon.svg',
      colorMode: {
        defaultMode:         'dark',
        disableSwitch:       false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: '',
        logo: {
          alt: 'Valcr',
          src: 'img/logo.svg',
        },
        items: [
          { type: 'docSidebar', sidebarId: 'docsSidebar', position: 'left', label: 'Docs' },
          { to: '/blog', label: 'Blog', position: 'left' },
          { href: 'https://console.valcr.site', label: 'Console', position: 'right' },
          { href: 'https://valcr.site/pricing',  label: 'Pricing',  position: 'right' },
          { href: 'https://github.com/valcr',     label: 'GitHub',   position: 'right' },
        ],
        style: 'dark',
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              { label: 'Getting started', to: '/quickstart' },
              { label: 'Authentication',  to: '/auth' },
              { label: 'API reference',   to: '/api/overview' },
              { label: 'VCFS schema',     to: '/guides/vcfs-schema' },
              { label: 'XBRL export',     to: '/guides/xbrl-export' },
            ],
          },
          {
            title: 'API',
            items: [
              { label: 'Benchmarks',  to: '/api/benchmarks' },
              { label: 'Merchant',    to: '/api/merchant' },
              { label: 'Segments',    to: '/api/segments' },
              { label: 'XBRL',        to: '/api/xbrl' },
              { label: 'Webhooks',    to: '/webhooks' },
            ],
          },
          {
            title: 'Valcr',
            items: [
              { label: 'Website',          href: 'https://valcr.site' },
              { label: 'Console',          href: 'https://console.valcr.site' },
              { label: 'Pricing',          href: 'https://valcr.site/pricing' },
              { label: 'Status',           href: 'https://status.valcr.site' },
              { label: 'Terms of service', href: 'https://valcr.site/terms' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Valcr. Built with precision.`,
      },
      prism: {
        theme:        lightCodeTheme,
        darkTheme:    darkCodeTheme,
        additionalLanguages: ['python', 'bash', 'json', 'typescript'],
      },
      algolia: undefined, // Add Algolia credentials when ready
      metadata: [
        { name: 'og:description', content: 'Valcr Data API — financial benchmark intelligence for commerce operators.' },
      ],
    }),
}

module.exports = config
