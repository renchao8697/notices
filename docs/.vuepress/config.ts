import { defaultTheme, defineUserConfig } from 'vuepress';
import { searchPlugin } from '@vuepress/plugin-search';

import { head, navbar, sidebar } from './configs';

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'Note',
  description: '学习笔记',
  base: '/note/',
  head,
  theme: defaultTheme({
    docsRepo: 'https://github.com/renchao8697/note',
    docsBranch: 'main',
    docsDir: 'docs',
    editLinkPattern: ':repo/-/edit/:branch/:path',
    navbar: navbar,
    sidebar: sidebar,
  }),
  plugins: [
    searchPlugin({
      locales: {
        '/': {
          placeholder: 'search',
        },
      },
      getExtraFields: (page) => (page.frontmatter.tags as []) ?? [],
    }),
  ],
});
