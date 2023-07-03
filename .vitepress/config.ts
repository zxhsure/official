import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'TomorrowOS',
  description: '明日系统',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/blog/index', activeMatch: '/blog/' }
    ],

    sidebar: {
      '/blog/wasm/': wasm(),
      '/blog/other/': other(),
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zxhsure' }
    ],

    footer: {
      copyright: 'Copyright © 2023-present zxhsure@163.com'
    },

  }
});

function wasm() {
  return [
    {
      text: 'WASM',
      items: [
        { text: 'wasm环境搭建', link: '/blog/wasm/wasm-env' },
        { text: 'wasm内存模型', link: '/blog/wasm/wasm-memory' },
        { text: 'wasm VS js，谁快？', link: '/blog/wasm/wasm-vs-js' },
      ]
    }
  ];
}

function other() {
  return [
    {
      text: 'OTHER',
      items: [
        { text: 'multipass(mac上的ubuntu)', link: '/blog/other/multipass-env' },
      ]
    }
  ]
}
