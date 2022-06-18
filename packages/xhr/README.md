# @prequest/xhr

一个基于 XMLHttpRequest 的请求库

## 安装

```bash
npm install @prequest/xhr
```

## 使用

由于在不同平台上使用基本一致，所以基本使用文档，请查阅 [这里](https://pre-quest.vercel.app/#/usage)

### 获取原生请求实例

```ts
import { prequest } from '@prequest/xhr'

prequest.post('/api', {
  getNativeRequestInstance(xhr) {
    // 仅做示例，推荐使用 cancelToken 取消请求
    xhr.abort()
  },
})
```

## 参数

| Option Name              | Type                                       | Default | Required | Meaning          | Example                 |
| ------------------------ | ------------------------------------------ | ------- | -------- | ---------------- | ----------------------- |
| path                     | string                                     | none    | Y        | 接口路径         | /api                    |
| method                   | string                                     | GET     | N        | 请求方式         | post                    |
| baseURL                  | string                                     | none    | N        | 服务器地址       | 'http://localhost:3000' |
| getNativeRequestInstance | (value: Promise\<NativeInstance\>) => void | none    | N        | 获取原生请求实例 |                         |
| cancelToken              | CancelToken                                | none    | N        | 取消请求         |                         |
| timeout                  | number                                     | none    | N        | 请求超时         | 5000                    |
| params                   | object                                     | none    | N        | url 参数         | { id: 10}               |
| data                     | object                                     | none    | N        | 请求头传输数据   | { id: 10}               |
| responseType             | json \| text \| arraybuffer \|...          | none    | N        | 响应的数据类型   | json                    |
| headers                  | object                                     | none    | N        | 请求头           | { token: 'aaaaa'}       |
| withCredentials          | boolean                                    | none    | N        | 认证             |                         |
| onDownloadProgress       | (e) => void                                | none    | N        | 下载进度         |                         |
| onUploadProgress         | (e) => void                                | none    | N        | 上传进度         |                         |
