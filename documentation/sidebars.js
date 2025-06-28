// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  // CodeBuddy documentation sidebar
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '🚀 Getting Started',
      items: [
        'getting-started/quick-start',
        'getting-started/installation',
        'getting-started/configuration',
      ],
    },
    {
      type: 'category',
      label: '📖 User Guides',
      items: [
        'guides/repository-setup',
        'guides/chat',
        'guides/diagrams',
      ],
    },
    {
      type: 'category',
      label: '🔌 API Reference',
      items: [
        'api/overview',
        'api/chat',
        'api/diagrams',
        'api/tools',
      ],
    },
    {
      type: 'category',
      label: '🛠️ Development',
      items: [
        'development/architecture',
      ],
    },
  ],
};

export default sidebars;