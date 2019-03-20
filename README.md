#### Vue项目导引 
1、安装 nodejs
2、安装 webpack 工具：npm install -g webpack-cli
3、安装项目依赖：在项目根目录下执行 npm install
4、开始开发
5、编译打包，以下四个命令任选一
npm run dev （编译并打包到/dist目录）
npm run watch （监听文件变化，实时编译并打包到/dist目录）
npm run build （编译、压缩、打包到/dist目录）
npm run server （监听文件变化，实时编译，本地起一个web服务，通过 localhost:8090 访问）

#### 第三方组件
打包工具：webpack        https://webpack.github.io/
MVVM框架：vue            https://cn.vuejs.org/
状态管理工具：Vuex       https://vuex.vuejs.org/
http工具：axios          https://www.kancloud.cn/yunye/axios/234845
UI组件：element-ui       http://element-cn.eleme.io/#/zh-CN
假数据工具：mockjs       http://mockjs.com/
路由组件：vue-router     https://router.vuejs.org/
时间转换工具：momentjs   http://momentjs.cn/

#### 目录结构
git 配置：.gitignore
npm配置（项目依赖配置）：package.json package-lock.json
webpack配置：webpack.config
postcss配置：postcss.config.js，webpack打包时会调用postcss
npm下载的依赖模块：node_modules，这个目录在.gitignore中配置成了不提交到git仓库

项目公共资源：assets/
项目公共组件：components/
给移动端引用的页面：h5/
健康检查页面：healthCheck/

客服登录相关页面：serviceLogin/
供应商注册登录相关页面：supplierLogin/
登录后的管理页面：admin/  , admin/ 下 service前缀的目录是客服相关，supplier前缀的目录是供应商相关

#### 基本原理
1、页面切换
页面切换有两种方式，一是，从一个html跳转到另一个html,两个html页面不会共享任何变量
二是，改变URL #后的值，这个值称为哈希（锚、路由），这种切换方式称为局部刷新，由路由组件 vue-router 实现
admin/ 整个目录 会打包成 一个html，serviceLogin/ 和 supplierLogin/ 同理，打包规则在webpack.config中配置
admin/ 下的不同页面通过 路由 切换，路由规则配置在 admin/router.js
2、引用逻辑
任何web页面的入口都是HTML文档，本项目的HTML文档的模板是assets/index.html
assets/index.html经过webpack打包后，会生成admin.html（登录后的管理页面）,serviceLogin.html（客服登录）,supplierLogin.html（供应商注册和登录）
admin.html 会引用 admin/main.js，即 admin/main.js 是 admin页面的入口js
admin/main.js 引用admin/目录下所有的 样式、脚本、模板
3、假数据
假数据写在stub.js中，main.js中判断了只在通过localhost访问时，才使用假数据
假数据功能由 mockjs 实现

#### 快速上手
1、新增HTML
在根目录下新建目录，模仿admin/ ，需要有App.vue，main.js，router.js，stub.js
模仿admin/ 在webpack.config.js的配置
2、在admin/ 下新增页面
根据页面 和 菜单的关系，在相应目录下新建.vue文件，.vue是一个单文件组件，它定义了这个组件的模板<template>、脚本<script>、样式<style>
在router.js 中配置路由，即通过什么哈希值能访问到这个页面
在stub.js 中配置需要的假数据