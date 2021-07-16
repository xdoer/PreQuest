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

在 Taro 中，如果你的平台只需要支持小程序平台，那么你可以在 `mini.compile` 字段配置如下代码

```ts
  mini: {
    compile: {
      include: [
        (modulePath) => {
          // 正常项目要这样写
          return modulePath.indexOf("@prequest") > -1
        },
      ],
    },
  }
```

如果要支持打包成 H5，则需要在 `h5` 字段配置上面的 `webpackChain`
