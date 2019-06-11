# 一、安装
官方推荐本地安装

## 1.标准web开发
```
npm i --save-dev webpack webpack-cli webpack-dev-server webpack-merge style-loader css-loader file-loader html-webpack-plugin clean-webpack-plugin babel-loader @babel/core @babel/preset-env
```
| 包名                            | 作用                                   |
| ------------------------------- | -------------------------------------- |
| webpack                         |                                        |
| webpack-cli                     | webpack v4+ 需要安装                   |
| webpack-dev-server              | 开发环境的server                       |
| webpack-merge                   | 配置config用的                         |
| style-loader                    | style loader                           |
| css-loader                      | css loader                             |
| file-loader                     | file loader，处理image，字体等本地文件 |
| html-webpack-plugin             | 生成html文件                           |
| clean-webpack-plugin            | 清除dist文件夹                         |
| babel-loader                    |                                        |
| @babel/core                     |                                        |
| @babel/preset-env               |                                        |

## 2.问题
### clean-webpack-plugin
插件升级之后，引入方式和配置方式都有变化。与官方文档不一致。
```
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
```
```
plugin: [
  new CleanWebpackPlugin(),
  ...
]
```
### html-webpack-plugin
可以指定html模板和其他配置。
```
plugin: [
  new HtmlWebpackPlugin({
    template: './src/index.html',
    inject: 'body',
  }),
  ...
]
```
### babel
- babel转义后，IE8还是会报错。
- 不要使用 @babel/plugin-transform-runtime ，会带来更多麻烦。
