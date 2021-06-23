# 超时

超时中间件。对于不支持设置超时时间的请求内核，你可以安装超时中间件来获得超时请求失败的能力。

## 安装

```bash
npm install @prequest/timeout
```

## 使用

```ts
import TimeoutMiddleware, { TimeoutInject } from '@prequest/timeout'
import { create } from '@prequest/fetch'

// 你可以对所有请求统一设置超时
const timeoutMiddleware = new TimeoutMiddleware({ timeout: 5000 })
prequest.use(timeoutMiddleware.run)

// 或者针对单一请求进行设置
const prequest = create<TimeoutInject, {}>()
prequest('/api', { timeout: 1000 })
```

## 配置项

### 实例配置项

| Option Name | Type   | Default | Required | Meaning  |
| ----------- | ------ | ------- | -------- | -------- |
| timeout     | number | 0       | false    | 超时时间 |
