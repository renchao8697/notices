import { defaultTheme, defineUserConfig } from 'vuepress';
import { docsearchPlugin } from '@vuepress/plugin-docsearch';

import { head, navbar, sidebar } from './configs';

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'Note',
  description: '学习笔记',
  base: '/note/',
  head,
  theme: defaultTheme({
    logo: '/images/logo.png',
    repo: 'renchao8697/note',
    docsDir: 'docs',
    navbar: navbar,
    sidebar: sidebar,
  }),
  plugins: [
    docsearchPlugin({
      appId: '1OGXP86PP2',
      apiKey: '0c7062939aa842c7a7fb8efcf9b499f5',
      indexName: 'renchao8697'
    })
  ],
});
