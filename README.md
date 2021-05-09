<div align=center>
<img src="logo.png" width="100%" height="100%" />
</div>

# PreQuest

A modular and pluggable solution for native http request.

[![npm](https://img.shields.io/npm/v/@prequest/core.svg)](https://www.npmjs.com/package/@prequest/core)
[![Minzipped size](https://img.shields.io/bundlephobia/minzip/@prequest/core.svg)](https://bundlephobia.com/result?p=@prequest/core)
[![NPM Downloads](https://img.shields.io/npm/dm/@prequest/core.svg?style=flat)](https://www.npmjs.com/package/@prequest/core)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

English | [中文](./README_zh-CN.md)

## Introduction

If you use axios、umi-request or some other http request library, you may don't need this. But if you use native request api like fetch、miniprogram request、node http module and so on, This library can add middleware, interceptor, global config, request alias and some modern feature to native request api easily.

## Example

```ts
import { PreQuest } from '@prequest/core'

// you just need to implement the adapter function which include native request core.
const adapter = opt => {
  const { path, baseURL, ...rest } = opt
  return fetch(baseURL + path, rest).then(res => res.json())
}

const prequest = PreQuest.create(adapter, { baseURL: 'http://localhost:3000' })

// perform a http request
prequest.request('/api', { method: 'get' })
prequest.request({ path: '/api', method: 'get' })

// prequest.request shortcut
prequest('/api', { method: 'get' })
prequest({ path: '/api', method: 'get' })

// request alias
prequest.get('/api')

// instance middleware
prequest.use(async (ctx, next) => {})

// global request options
PreQuest.defaults.baseURL = 'http://localhost:3000'

// global middleware
PreQuest.use(async (ctx, next) => {})
```

## More Details

For more details, please check the docs.

> - [@prequest/core](https://github.com/xdoer/PreQuest/blob/main/packages/core/README.md). Core of PreQuest, build-in middleware, request alias.
> - [@prequest/xhr](https://github.com/xdoer/PreQuest/blob/main/packages/xhr/README.md). A request library base on XMLHttpRequest api.
> - [@prequest/fetch](https://github.com/xdoer/PreQuest/blob/main/packages/fetch/README.md). A request library base on Fetch api.
> - [@prequest/miniprogram](https://github.com/xdoer/PreQuest/blob/main/packages/miniprogram/README.md).A request library base on miniprogram request api.
> - [@prequest/graphql](https://github.com/xdoer/PreQuest/blob/main/packages/graphql/README.md).A Syntax Sugar For Post Http Request Based On PreQuest.
> - [@prequest/interceptor](https://github.com/xdoer/PreQuest/blob/main/packages/interceptor/README.md).A Interceptor Middleware For PreQuest

## Development

- [Contributing Guide](/CONTRIBUTING.md)

## License

[MIT License](https://github.com/xdoer/PreQuest/blob/main/LICENSE)
