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
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installation',
        'getting-started/quickstart-renderer',
        'getting-started/quickstart-editor',
      ],
    },
    'schema-format',
    'field-types',
    'conditional-logic',
    {
      type: 'category',
      label: 'Renderer',
      items: [
        'renderer/overview',
        'renderer/props',
        'renderer/get-response',
        'renderer/web-component',
        'renderer/blaze',
      ],
    },
    {
      type: 'category',
      label: 'Editor',
      items: [
        'editor/overview',
        'editor/props',
        'editor/importing',
      ],
    },
  ],
};

export default sidebars;
