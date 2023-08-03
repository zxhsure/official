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
      '/blog/rww/': rww(),
      '/blog/other/': other(),
      '/blog/fengqi/': fengqi(),
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zxhsure' }
    ],

    footer: {
      copyright: 'Copyright © 2023-present zxhsure@163.com'
    },

  }
});

function rww() {
  return [
    {
      text: 'RUST/WASM/WGPU',
      items: [
        { text: 'wasm环境搭建', link: '/blog/rww/wasm-env' },
        { text: 'wasm内存模型', link: '/blog/rww/wasm-memory' },
        { text: 'wasm VS js，谁快？', link: '/blog/rww/wasm-vs-js' },
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
        { text: '前端框架搭建-微前端', link: '/blog/other/wujie' },
      ]
    }
  ]
}

function fengqi() {
  return [
    {
      text: '风起',
      items: [
        { text: '函数式编程/逻辑图/AI', link: '/blog/fengqi/fpai' },
      ]
    }
  ]
}
