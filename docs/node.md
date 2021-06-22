# @prequest/node

代码移植自 [axios](https://github.com/axios/axios/blob/e9965bfafc/lib/adapters/http.js)，传参与响应与 axios 一致

## 安装

```bash
npm install @prequest/node
```

## 使用

基本使用，请查阅 [文档](/usage?id=%e5%bc%80%e7%ae%b1%e5%8d%b3%e7%94%a8)

## 参数

| Option Name  | Type                              | Default | Required | Meaning        | Example                 |
| ------------ | --------------------------------- | ------- | -------- | -------------- | ----------------------- |
| path         | string                            | none    | Y        | 接口路径       | /api                    |
| method       | string                            | GET     | N        | 请求方式       | post                    |
| baseURL      | string                            | none    | N        | 服务器地址     | 'http://localhost:3000' |
| timeout      | number                            | none    | N        | 请求超时       | 5000                    |
| params       | object                            | none    | N        | url 参数       | { id: 10}               |
| data         | object                            | none    | N        | 请求头传输数据 | { id: 10}               |
| responseType | json \| text \| arraybuffer \|... | none    | N        | 响应的数据类型 | json                    |
| header       | object                            | none    | N        | 请求头         | { token: 'aaaaa'}       |
