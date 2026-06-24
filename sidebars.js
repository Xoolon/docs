/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    { type: 'doc', id: 'index',      label: 'Introduction' },
    { type: 'doc', id: 'quickstart', label: 'Quickstart' },
    { type: 'doc', id: 'auth',       label: 'Authentication' },
    { type: 'doc', id: 'webhooks',   label: 'Webhooks' },
    {
      type: 'category', label: 'API Reference', collapsed: false,
      items: [
        { type: 'doc', id: 'api/overview',   label: 'Overview' },
        { type: 'doc', id: 'api/benchmarks', label: 'Benchmarks' },
        { type: 'doc', id: 'api/merchant',   label: 'Merchant' },
        { type: 'doc', id: 'api/segments',   label: 'Segments' },
        { type: 'doc', id: 'api/xbrl',       label: 'XBRL Export' },
      ],
    },
    {
      type: 'category', label: 'Guides', collapsed: false,
      items: [
        { type: 'doc', id: 'guides/connect-store', label: 'Connect a Store' },
        { type: 'doc', id: 'guides/pricing',       label: 'Pricing & Billing' },
        { type: 'doc', id: 'guides/valcr-score',   label: 'Valcr Score' },
        { type: 'doc', id: 'guides/vcfs-schema',   label: 'VCFS Schema' },
        { type: 'doc', id: 'guides/xbrl-export',   label: 'XBRL Export Guide' },
        { type: 'doc', id: 'guides/security',      label: 'Security' },
      ],
    },
    { type: 'doc', id: 'support', label: '💬 Support' },
  ],
}
module.exports = sidebars
