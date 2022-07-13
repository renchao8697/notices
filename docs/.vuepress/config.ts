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
    repo: 'renchao8697/note',
    docsDir: 'docs',
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
