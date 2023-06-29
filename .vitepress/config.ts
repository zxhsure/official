import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'TomorrowOS',
  description: '明日系统',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/blog/index', activeMatch: '/blog/' }
    ],

    sidebar: [
      {
        text: 'WASM',
        items: [
          { text: 'wasm内存模型', link: '/blog/wasm-memory' },
          { text: 'wasm VS js，谁快？', link: '/blog/wasm-vs-js' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zxhsure' }
    ],

    footer: {
      copyright: 'Copyright © 2023-present zxhsure@163.com'
    },

  }
})
