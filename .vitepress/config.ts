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
        { text: 'wasm与wgpu（一）：窗口', link: '/blog/rww/wgpu-001' },
        { text: 'wasm与wgpu（二）：展示平面', link: '/blog/rww/wgpu-002' },
        { text: 'wasm与wgpu（三）：管线', link: '/blog/rww/wgpu-003' },
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
        { text: '冬雷', link: '/blog/other/donglei' },
        { text: '单点登录设计方案', link: '/blog/other/sso' },
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
        { text: 'Figma引发的思考', link: '/blog/fengqi/figmadev' },
      ]
    }
  ]
}
