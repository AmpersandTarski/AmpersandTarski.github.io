/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

const ampersandSidebars = require('/app/docs/ampersand/sidebar');

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {

  mainSidebar: [
    'ampersand/toc', // THE FIRST ITEM MUST BE A SINGLE FILE!
    {
      label: 'Introduction',
      type: 'category',
      link: {
        type: 'generated-index',
        title: 'Welcome!',
        description:
          "Depending on your background, we can help you on your journey into Ampersand."
      },
      collapsed: false,
      items: [
        'student',
        'software-engineer',
        'scientist',
        'contributor',
        'interested-visitor',
      ]
    },
    {
      label: 'Guides',
      type: 'category',
      collapsed: true,
      items: ampersandSidebars.ampersandGuideSidebar.concat(
        ampersandSidebars.prototypeGuideSidebar)
    },
    {
      label: 'Reference materials',
      type: 'category',
      collapsed: true,
      items: ampersandSidebars.ampersandReferenceSidebar.concat(
        ampersandSidebars.prototypeReferenceSidebar)
    },
    {
      label: 'Ampersand compiler',
      type: 'category',
      collapsed: true,
      items: ampersandSidebars.ampersandMainSidebar
    },
    // {
    //   label: 'Prototype',
    //   type: 'category',
    //   collapsed: true,
    //   items: ampersandSidebars.prototypeMainSidebar
    // },
    {
      label: 'Tools we use',
      type: 'category',
      collapsed: true,
      items: ampersandSidebars.toolsWeUseMainSidebar
    },
  ],
};

module.exports = sidebars;
