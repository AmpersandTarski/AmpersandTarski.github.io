/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

const ampersandCompilerSidebar = require('./docs/Ampersand/sidebar');

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {

  mainSidebar: [
    'intro', // shorthand for a single doc
    {
      label: 'getting started',
      type: 'category',
      collapsed: false,
      items: [
        'interested-visitor',
        'student',
        'software-engineer',
        'scientist',
        'contributor']
    },
    {
      label: 'Ampersand compiler',
      type: 'category',
      items: ampersandCompilerSidebar.sidebar
    },
    {
      label: 'getting started again (just for demo)',
      type: 'category',
      link: {
        type: 'generated-index',
        title: 'Who do you think you are?',
        description:
          "Depending on your background, we can help you on your way into the documentation."
      },
      items: [
        'interested-visitor',
        'student',
        'software-engineer',
        'scientist',
        'contributor']
    }
  ],
};

module.exports = sidebars;
