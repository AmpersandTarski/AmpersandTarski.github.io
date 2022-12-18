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
      label: 'Theory & background',
      type: 'category',
      // We asume that all theory stuff is in the Ampersand repo
      items: ampersandSidebars.ampersandTheorySidebar

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
      label: 'Other documents in Ampersand repo',
      type: 'category',
      // These documents eventually have to move to one of the three main categories.
      collapsed: true,
      items: ampersandSidebars.ampersandMainSidebar
    },
    {
      label: 'Other documents in Tools we use',
      type: 'category',
      // These documents eventually have to move to one of the three main categories.
      collapsed: true,
      items: ampersandSidebars.toolsWeUseMainSidebar
    },
  ],
};

module.exports = sidebars;
