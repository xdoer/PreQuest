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

在 `vue-cli` 等脚手架中，你可以使用 `webpack-chain` 进行配置

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
