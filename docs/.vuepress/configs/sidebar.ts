import type { SidebarConfig } from "vuepress";

export const sidebar: SidebarConfig = {
  '/frontend-base/': [
    '/frontend-base/html.md',
    '/frontend-base/css.md',
    {
      text: 'Javascript',
      children: [
        '/frontend-base/javascript/index.md',
        '/frontend-base/javascript/proxy.md',
      ]
    }
  ],
  '/frame/': [
    {
      text: 'Vue',
      children: [
        '/frame/vue2/',
        '/frame/vue3/'
      ]
    },
    '/frame/react/',
    '/frame/webpack/',
  ],
  '/http/': [
    '/http/headers.md',
    '/http/cache.md'
  ]
}