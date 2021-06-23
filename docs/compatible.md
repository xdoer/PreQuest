# 兼容

代码采用 TypeScript 语言、ESNext 语法进行编写。打包编译代码，使用 [browserslist](https://github.com/browserslist/browserslist) 的 `>5%` 的策略。如果你的项目需要兼容低版本，请在你的项目中使用 [babel](https://babeljs.io/docs/en/configuration#babelconfigjson) 进行编译。

## Webpack

如果你的项目使用了 Webpack, 那么你可以进行如下配置

```js
module: {
  rules: [
    {
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    },
  ]
}
```

## Webpack Chain

在 `vue-cli`、`taro-cli` 等脚手架中，你可以使用 `webpack-chain` 进行配置

```js
webpackChain(chain) {
  chain.merge({
    module: {
      rule: {
        babelLoader: {
          test: /\.js$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ['@babel/preset-env'],
              },
            },
          ],
        },
      },
    },
  });
}
```

一般脚手架中有提供相应的配置，来编译 node_module 代码。

比如，在 vue.config.js 中，你可以添加 [https://cli.vuejs.org/zh/config/#transpiledependencies](https://cli.vuejs.org/zh/config/#transpiledependencies) 配置项来编译。

## 小程序

### 原生小程序

原生小程序中不支持构建 node_modules 中包含 ES6 代码的包，所以只能复制粘贴相关代码到你的项目中。这里提供了 [demo](https://github.com/xdoer/PreQuest/tree/main/examples/wx-mini) 供参考。

编译好的文件下载地址: [https://unpkg.com/browse/@prequest/miniprogram@0.4.0/dist/miniprogram.esm.js](https://unpkg.com/browse/@prequest/miniprogram@0.4.0/dist/miniprogram.esm.js)(要注意，文件依赖也需要下载)

### 框架小程序

框架小程序(如 taro、uni)一般都提供了基于 webpack 的 cli 工具来进行代码打包，因而你可以直接安装 PreQuest 的 npm 包，然后再使用 `babel` 进行编译。

这里提供了两个 demo 供参考:

taro 版本 [demo](https://github.com/xdoer/PreQuest/tree/main/examples/taro/config/index.js) 。

uni 版本 [demo](https://github.com/xdoer/PreQuest/tree/main/examples/uni/vue.config.js)
