// @ts-check
const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Valcr Docs',
  tagline: 'Financial benchmark intelligence for commerce operators.',
  favicon: 'img/favicon.svg',
  url: 'https://docs.valcr.site',
  baseUrl: '/',
  organizationName: 'valcr',
  projectName: 'docs-valcr',
  trailingSlash: false,

  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'ignore',

  i18n: { defaultLocale: 'en', locales: ['en'] },

  headTags: [
    { tagName: 'link', attributes: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
    { tagName: 'link', attributes: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' } },
  ],

  presets: [[
    'classic',
    {
      docs: {
        sidebarPath: require.resolve('./sidebars.js'),
        routeBasePath: '/',
        editUrl: 'https://github.com/valcr/docs-valcr/tree/main/',
        showLastUpdateTime: true,
        breadcrumbs: true,
      },
      blog: {
        showReadingTime: true,
        feedOptions: {
          type: ['rss', 'atom'],
          title: 'Valcr Blog',
          description: 'Data insights, product updates, and engineering notes from Valcr.',
          copyright: `Copyright © ${new Date().getFullYear()} Valcr — Cyntax LLC`,
          language: 'en',
        },
        blogTitle: 'Valcr Blog',
        blogDescription: 'Data insights, product updates, and engineering from Valcr.',
        blogSidebarTitle: 'Recent posts',
        blogSidebarCount: 8,
        postsPerPage: 6,
        authorsMapPath: 'authors.yml',
        sortPosts: 'descending',
      },
      sitemap: {
        changefreq: 'weekly',
        priority: 0.8,
        ignorePatterns: ['/tags/**', '/search'],
        filename: 'sitemap-docs.xml',
      },
      theme: { customCss: require.resolve('./src/css/custom.css') },
    },
  ]],

  themeConfig: {
    image: 'img/valcr-social-card.png',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },

    metadata: [
      { name: 'author', content: 'Valcr — Cyntax LLC' },
      { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Valcr Docs' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@cyntax_llc' },
    ],

    navbar: {
      title: '',
      logo: { alt: 'Valcr', src: 'img/logo.svg' },
      items: [
        { type: 'docSidebar', sidebarId: 'docsSidebar', position: 'left', label: 'Docs' },
        { to: '/blog', position: 'left', label: 'Blog' },
        { href: 'https://valcr.site', position: 'right', label: 'Valcr.site' },
        { href: 'https://console.valcr.site', position: 'right', label: 'Console', className: 'navbar-console-link' },
        {
          href: 'https://valcr.site/login',
          position: 'right',
          label: 'Sign in →',
          className: 'navbar-cta-link',
        },
      ],
      style: 'dark',
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            { label: 'Introduction', to: '/' },
            { label: 'Quickstart', to: '/quickstart' },
            { label: 'Authentication', to: '/auth' },
            { label: 'Webhooks', to: '/webhooks' },
            { label: 'Connect a Store', to: '/guides/connect-store' },
            { label: 'Pricing & Billing', to: '/guides/pricing' },
          ],
        },
        {
          title: 'API Reference',
          items: [
            { label: 'Overview', to: '/api/overview' },
            { label: 'Benchmarks', to: '/api/benchmarks' },
            { label: 'Merchant', to: '/api/merchant' },
            { label: 'Segments', to: '/api/segments' },
            { label: 'XBRL Export', to: '/api/xbrl' },
          ],
        },
        {
          title: 'Guides',
          items: [
            { label: 'VCFS Schema', to: '/guides/vcfs-schema' },
            { label: 'XBRL Export', to: '/guides/xbrl-export' },
            { label: 'Valcr Score', to: '/guides/valcr-score' },
            { label: 'Security', to: '/guides/security' },
            { label: 'Support', to: '/support' },
            { label: 'Blog', to: '/blog' },
          ],
        },
        {
          title: 'Valcr',
          items: [
            { label: 'Valcr Platform', href: 'https://valcr.site' },
            { label: 'Console', href: 'https://console.valcr.site' },
            { label: 'Pricing', href: 'https://valcr.site/pricing' },
            { label: 'About', href: 'https://valcr.site/about' },
            { label: 'support@valcr.site', href: 'mailto:support@valcr.site' },
            { label: 'teams@valcr.site', href: 'mailto:teams@valcr.site' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Valcr · Cyntax LLC · 🇺🇸 &nbsp;·&nbsp; <a href="https://twitter.com/cyntax_llc" style="color:#3A527A;text-decoration:none">Twitter</a> &nbsp;·&nbsp; <a href="https://instagram.com/valcr.io" style="color:#3A527A;text-decoration:none">Instagram</a> &nbsp;·&nbsp; <a href="https://valcr.site/terms" style="color:#3A527A;text-decoration:none">Terms</a> &nbsp;·&nbsp; <a href="https://valcr.site/privacy" style="color:#3A527A;text-decoration:none">Privacy</a>`,
    },

    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ['python', 'bash', 'json', 'typescript', 'go', 'markup'],
    },

    tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
    docs: { sidebar: { hideable: true, autoCollapseCategories: false } },
  },

  plugins: [

    ['@docusaurus/plugin-client-redirects', {
      redirects: [
        { from: '/docs', to: '/' },
        { from: '/api', to: '/api/overview' },
        { from: '/schema', to: '/guides/vcfs-schema' },
        { from: '/faq', to: '/support' },
        { from: '/pricing', to: '/guides/pricing' },
        { from: '/connect', to: '/guides/connect-store' },
      ],
    }],
  ],
};

module.exports = config;