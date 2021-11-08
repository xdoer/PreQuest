# 与 Axios 一同使用

大多数情况下，你可以使用 axios 很好的完成需求，但 axios 中对于请求错误重试、token 添加、接口缓存等没有开箱即用的方案，迁移到 PreQuest 又有一定的成本。根据本文档，你可以很容易的整合两者，兼具两者的能力。

## 安装

```bash
npm install axios @prequest/core
```

## 配置

### 适配器

首先定义适配器函数

```ts
import axios from 'axios'

function adapter(opt) {
  return axios(opt.path, opt)
}

// 或者
const axiosInstance = axios.create()

function adapter(opt) {
  return axiosInstance(opt.path, opt)
}
```

### 创建实例

```ts
import { PreQuest } from '@prequest/core'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

const prequest = PreQuest.create<AxiosRequestConfig, AxiosResponse>(adapter)
```

通过 PreQuest 创建的实例，兼具了 axios 与 PreQuest 的特点。

### 执行请求

prequest 支持以下调用方式

```text
prequest(config)

prequest(path[, config])

prequest#[request|get|post|delete|put|patch|head|options](path[, config])
```

你可以查看这里 [axios 实例](https://axios-http.com/zh/docs/instance)，来看一下区别

## 旧代码适配

### 发起请求

基本上，axios 与 prequest 调用方式区别不大，你可以直接替换为 prequest，但需要注意传入 data 的调用，prequest 并不支持。

```text
axios#post(url[, data[, config]])

axios#put(url[, data[, config]])

axios#patch(url[, data[, config]])
```

你需要做如下的修改

```ts
// 将
axios.post('/api', { a: 1 })

// 改为
prequest.post('/api', {
  data: {
    a: 1,
  },
})
```

### 配置项

原有的项目中 axios 配置不需要修改，比如全局配置，拦截器等等。

如果你在 axios 进行了一些请求的配置，那么不建议再使用 PreQuest 进行请求参数的配置，避免引起代码混乱。

## 使用示例

下面演示在实际项目中，怎么整合 axios 与 PreQuest.

### Axios 配置

```ts
<!-- http.js -->

import axios from 'axios'

axios.defaults.method = 'POST'

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 1000,
  headers: {
    'X-Custom-Header': 'foobar'
  }
})

axiosInstance.interceptor.request.use()
axiosInstance.interceptor.response.use()
```

### PreQuest 配置

```ts
<!-- prequest.js -->

import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { PreQuest } from '@prequest/core'
import ErrorRetryMiddleware from '@prequest/error-retry'
import { axiosInstance } from './http'

export const prequest = PreQuest.create<AxiosRequestConfig, AxiosResponse>(opt => axiosInstance(opt.path, opt))

// 错误重试中间件
const errorRetryMiddleware = ErrorRetryMiddleware()
prequest.use(errorRetryMiddleware)
```

### 调用

prequest 除了与 axios 调用有[些许不同](#发起请求)，其余请求参数、响应都一致。

```ts
import { prequest } from './prequest'

async function getData() {
  try {
    // 参数列表，参阅: https://axios-http.com/zh/docs/req_config
    const opt = {}
    const res = await prequest('/api', opt)

    // 响应结构，参阅: https://axios-http.com/zh/docs/res_schema
    console.log(res)
  } catch (e) {
    // 错误处理，参阅: https://axios-http.com/zh/docs/handling_errors
    console.log(e)
  }
}
```
