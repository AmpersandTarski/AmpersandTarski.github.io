/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

const ampersandSidebars = require('/app/docs/ampersand/sidebar');
const prototypeSidebars = require('/app/docs/prototype/sidebar');
const prototypeFrontendSidebars = require('/app/docs/prototypeFrontend/sidebar');
// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {

  mainSidebar: [
    {
      label: 'Introduction',
      type: 'category',
      link: {
        slug: '/',
        type: 'generated-index',
        title: 'Welcome!',
        description:
          "Depending on your background, we can help you on your journey into Ampersand."
      },
      collapsed: false,
      // We asume that all landingpages are in the Ampersand repo
      items: ampersandSidebars.ampersandLandingpagesSidebar
    },
    {
      label: 'Theory & background',
      type: 'category',
      // We asume that all theory stuff is in the Ampersand repo
      items: ampersandSidebars.ampersandTheorySidebar,
      link: {
        type: 'generated-index',
        title: 'Theory & background',
        description:
          "Here you will find all kind of how-to instructions to help you get going with Ampersand."
      }

    },
    {
      label: 'Guides',
      type: 'category',
      collapsed: true,
      items: ampersandSidebars.ampersandGuideSidebar.concat(
        prototypeSidebars.prototypeGuideSidebar).concat(
          prototypeFrontendSidebars.prototypeFrontendGuideSidebar
        ),
      link: {
        type: 'generated-index',
        title: 'Guides',
        description:
          "Here you will find all kind of how-to instructions to help you get going with Ampersand."
      }
    },
    {
      label: 'Reference materials',
      type: 'category',
      collapsed: true,
      items: ampersandSidebars.ampersandReferenceSidebar.concat(
        prototypeSidebars.prototypeReferenceSidebar).concat(
          prototypeFrontendSidebars.prototypeFrontendReferenceSidebar
        ),
      link: {
        type: 'generated-index',
        title: 'Reference materials'
      }
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
  ].concat(ampersandSidebars.oldTableOfContent),
};

module.exports = sidebars;
