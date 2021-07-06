# @prequest/jsonp

jsonp 请求

## 安装

```bash
npm install @prequest/jsonp
```

## 使用

基本使用，请查阅 [文档](https://pre-quest.vercel.app/usage?id=%e5%bc%80%e7%ae%b1%e5%8d%b3%e7%94%a8)

```tsx
import { prequest } from '@prequest/jsonp'

prequest('https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su', {
  params: {
    wd: '哈哈',
  },
  callbackParamName: 'fn',
}).then(res => {
  console.log(res)
})
```

## 请求配置项

| Option Name       | Type        | Default  | Required | Meaning                       |
| ----------------- | ----------- | -------- | -------- | ----------------------------- |
| path              | string      | none     | Y        | server interface path         |
| baseURL           | string      | none     | N        | base server interface address |
| cancelToken       | CancelToken | none     | N        | cancel a request              |
| params            | object      | none     | N        | url parameters                |
| callbackParamName | string      | callback | N        | callback name                 |
