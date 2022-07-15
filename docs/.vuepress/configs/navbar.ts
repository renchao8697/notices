import type { NavbarConfig } from "vuepress";

export const navbar: NavbarConfig = [
  {
    text: '前端基础',
    children: [
      '/frontend-base/html.md',
      '/frontend-base/css.md',
      '/frontend-base/javascript/'
    ]
  },
  {
    text: '框架',
    children: [
      {
        text: 'Vue',
        children: [
          '/frame/vue2/',
          '/frame/vue3/',
        ]
      },
      {
        text: 'React',
        children: [
          '/frame/react/',
        ]
      },
      {
        text: 'Webpack',
        children: [
          '/frame/webpack/',
        ]
      }
    ]
  },
  {
    text: 'HTTP',
    children: [
      '/http/headers.md',
      '/http/cache.md'
    ]
  }
]