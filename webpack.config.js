'use strict';

let path = require('path'),
    fs = require('fs'),
    webpack = require('webpack'),
    {VueLoaderPlugin} = require('vue-loader'),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    {CleanWebpackPlugin} = require('clean-webpack-plugin'),
    OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
    args = process.argv, // 获取命令参数，数组格式
    dist = path.resolve(__dirname, "dist");

let plugins = [
    // CSS提取
    new MiniCssExtractPlugin({
        filename: "[name].[chunkhash].css",
        chunkFilename: "[id].[chunkhash].css"
    }),
    new OptimizeCssAssetsPlugin(),  // CSS压缩
    // 入口HTML 生成
    new HtmlWebpackPlugin({
        template: './assets/index.html',
        favicon: './assets/favicon.ico',
        filename: 'index.html',
        title: '野路子',  // 与html-loader 会有冲突
        chunks: ['login']
    }),
    new HtmlWebpackPlugin({
        template: './assets/index.html',
        favicon: './assets/favicon.ico',
        filename: 'index.html',
        title: '野路子',  // 与html-loader 会有冲突
        chunks: ['operation']
    }),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: [dist]})        // 清空dist
];
if (!args.includes('--inline')) {
    plugins.push(new webpack.IgnorePlugin(/\/mock$/));    // 不是本地调试时，mock模块不打进包里
}

module.exports = {
    // 入口文件
    entry: {
        operation: './operation/main.js',
        login: './login/main.js'
    },
    // 输出
    output: {
        // 输出目录
        path: dist,
        // 输出文件名，[name]与入口文件同名
        filename: '[name]-[chunkhash].js',
        // 入口服务器在国外，访问慢的话，可以设置publicPath，即访问JS、CSS、图片的前缀。
        // 在国外 和 国内 部署两套代码，入口html访问国外，剩下的都访问过内
        // publicPath: "http://128.2.3.3/"
    },
    resolve: {
        extensions: ['.js', '.vue'], // require 文件时可省略后缀 .js .vue
        alias: {
            'vue': 'vue/dist/vue.js'  // 使用完整版的vue
        }
    },
    module: {
        // 加载器配置
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }, {
                // 目标文件
                test: /\.css$/,
                use: [
                    // 使用这个插件，使得所有less 能被打入一个文件，而不是一个个style
                    MiniCssExtractPlugin.loader,
                    'css-loader', 'postcss-loader' // 先用css-loader处理css,再用style-loader将css写入<style>标签
                ]
            }, {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader', 'postcss-loader', 'sass-loader'
                ]
            }, {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader', 'postcss-loader', 'less-loader'
                ]
            }, {
                test: /\.(js)$/,
                exclude: /(node_modules)/,       // 排除目标
                loader: "babel-loader",
                options: {
                    babelrc: false,  // 不用配置文件
                    presets: ["es2015"],
                    plugins: [
                        'transform-runtime',  // 转换ES7的一些关键字
                        "syntax-dynamic-import", // 有这个插件才能异步加载模块
                        // 按需导入element-ui组件，需要 babel-plugin-component 这个插件，可以在每个页面只引入所需的组件
                        // ["component", {"libraryName": "element-ui", "styleLibraryName": "~theme"}]
                    ]
                }
            }, {
                test: /\.(png|jpg|jpeg|gif|webp|svg)$/,
                loader: "url-loader",
                options: {
                    name: 'assets/image/[name].[hash:8].[ext]',
                    limit: 8192         // 小于 8k的图片，输出为base64 dataurl
                }
            }, {
                test: /\.(ttf|otf|woff|eot)$/,
                loader: "url-loader",
                options: {   // 给loader的参数
                    name: 'assets/font/[name].[hash:8].[ext]',
                    limit: 1024         // 字体转 dataurl
                }
            }, {
                test: /\.text$/,
                loader: 'text-loader'     // 将字符串包装为模块
            }
        ]
    },
    // 插件
    plugins: plugins,
    optimization: {
        /*
        * splitChunks 配置 代替了 原先的CommonsChunkPlugin插件，用于提取多个 entry 公用的模块
        * 有一个默认配置，node_modules下公用的模块打成 vendors bundle，引用超过两次的模块打到 default bundle
        * */
        splitChunks: {}
    },
    // 配置 webpack-dev-server
    devServer: {
        historyApiFallback: true, // 允许路由
        inline: true,
        port: 8090,
        headers: {
            "Access-Control-Allow-Origin": "http://127.0.0.1:8081",
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Methods": "POST, GET, PUT, OPTIONS",
            "Access-Control-Allow-Headers": "X-PINGOTHER, Content-Type"
        }
    }
};
