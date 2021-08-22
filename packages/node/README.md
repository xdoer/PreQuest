# @prequest/node

代码移植自 [axios](https://github.com/axios/axios/blob/e9965bfafc/lib/adapters/http.js)，传参与响应与 axios 一致

## 安装

```bash
npm install @prequest/node
```

## 使用

由于在不同平台上使用基本一致，所以基本使用文档，请查阅 [这里](https://pre-quest.vercel.app/usage?id=%e5%bc%80%e7%ae%b1%e5%8d%b3%e7%94%a8)

## 参数

| Option Name      | Type                              | Default | Required | Meaning                   | Example                 |
| ---------------- | --------------------------------- | ------- | -------- | ------------------------- | ----------------------- |
| path             | string                            | none    | Y        | 接口路径                  | /api                    |
| method           | string                            | GET     | N        | 请求方式                  | post                    |
| baseURL          | string                            | none    | N        | 服务器地址                | 'http://localhost:3000' |
| timeout          | number                            | none    | N        | 请求超时                  | 5000                    |
| params           | object                            | none    | N        | url 参数                  | { id: 10}               |
| data             | object                            | none    | N        | 请求头传输数据            | { id: 10}               |
| responseType     | json \| text \| arraybuffer \|... | none    | N        | 响应的数据类型            | json                    |
| header           | object                            | none    | N        | 请求头                    | { token: 'aaaaa'}       |
| cancelToken      | CancelToken                       | none    | N        | 取消请求                  |                         |
| responseEncoding | BufferEncoding                    | utf-8   | N        | 解码响应的编码            |                         |
| socketPath       | string                            | none    | N        | 使用的 UNIX 套接字        | '/var/run/docker.sock'  |
| auth             | Auth                              | none    | N        | HTTP 认证                 |                         |
| proxy            | Proxy                             | none    | N        | 代理请求                  |                         |
| httpAgent        | http.agent                        | none    | N        | 自定义请求                |                         |
| httpsAgent       | https.agent                       | none    | N        | 自定义请求                |                         |
| maxRedirects     | number                            | none    | N        | 重定向次数                |                         |
| maxBodyLength    | number                            | none    | N        | http 请求内容的最大字节数 |                         |
