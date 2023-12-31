<div style="overflow:hidden;"><img src="../assets/me.jpeg" alt="风起" style="border-radius:50%;width: 25px;float:left;"> <div style="float:left;margin-top: 2px;margin-left: 3px;font-size: 12px;">风起</div></div>
<div style="clear:both;font-size: 12px;height:50px;line-height: 34px;">2023-08-03</div>

# 前端框架搭建-微前端

### 需求

公司业务上需要一个前端框架，主要满足以下功能：

- 方便的集成各个应用服务下的页面
- 不管是应用内部跳转还是跨应用的跳转，页面都能够保活，且可以自由控制删除保活的实例
- 可动态配置菜单
- 支持多种布局，有的页面需要左侧菜单和顶部导航，有的页面不需要这些
- 提供一种登录鉴权机制
- 能够做到基座应用和子应用的前端框架无关
- 能够动态替换掉页面上的某个组件
- 弹框、浏览器刷新、前进后退，交互体验像是一个应用

### 设计

鉴于以上需求，最好的解决方案是微前端，微前端做应用级或页面级的集成，组件级的用插件机制（远程组件）来集成。

![](../assets/wujie-1.png)

微前端集成后的结构如下图：

- 每个应用是一个服务，应用底下都有各自的页面及路由
- 框架层可以集成应用级别，用应用自己的菜单
- 框架层也可以直接跨应用集成到页面级别，动态配置自己的菜单
- 远程组件以插件的机制挂到页面上，前提是提前预留位置及接口

![](../assets/wujie-2.png)

### 吐槽

- 确实有这样的需求存在所以才出现微前端，感觉前端总是在做兼容，浏览器的兼容，框架的兼容，修修补补，当然兼容性也是微前端需要考虑的一个重要因素。
- 能够提供保活功能，但不提供删除保活缓存的接口，就是耍流氓。
