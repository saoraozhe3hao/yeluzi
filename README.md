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