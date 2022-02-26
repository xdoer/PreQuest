# @prequest/timeout

超时中间件。对于不支持设置超时时间的请求内核，你可以安装超时中间件来获得超时响应失败的能力。

> 对于一些本不支持设置超时时间的请求内核以及 Fetch 来说，没有办法真正的在超时之后，取消请求。只能使用超时抛异常的方式来满足需求。

## 安装

```bash
npm install @prequest/timeout
```

## 使用

```ts
import { create, PreQuest } from '@prequest/xhr'

// 全局超时
PreQuest.defaults.timeout = 1000

// 实例超时
const prequest = create({ timeout: 6000 })

// 单个超时
prequest('/api', { timeout: 1000 })
```
