import { defaultTheme, defineUserConfig } from 'vuepress'

import { head, navbar, sidebar } from './configs'

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'Note',
  description: '学习笔记',
  base: '/note/',
  head,
  theme: defaultTheme({
    docsDir: 'docs',
    locales: {
      '/': {
        navbar: navbar,
        sidebar: sidebar
      }
    }
  })
})