# @prequest/response-types-generator

Restful-API 响应的 JSON 数据的 TypeScript 类型生成器

## 安装

```bash
npm install @prequest/response-types-generator
```

## 使用

```ts
import responseTypesGenerator from '@prequest/response-types-generator'

responseTypesGenerator({
  requestOptions: {
    baseURL: 'http://localhost:3000',
    method: 'GET',
    headers: {
      authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5c',
    },
  },
  outPutDir: '/Users/xdoer',
  outPutPath: '/api-types.ts',
  parseResponse: res => res.data,
  requestPoolLimit: 5,
  data: [
    {
      outPutPath: '/user-types.ts',
      rootInterfaceName: 'User',
      requestOptions: { path: '/user' },
      parseResponse: res => JSON.parse(res.data),
      customInterfaceName: (key, value, data) => {
        if (key === 'a') return 'name'
      },
    },
  ],
})
```

## 参数

参数分为两大部分: 全局参数与局部参数。

### 全局参数

| 名称                    | 类型                                                                        | 必填 | 默认值             | 含义                                          | 备注                                               |
| ----------------------- | --------------------------------------------------------------------------- | ---- | ------------------ | --------------------------------------------- | -------------------------------------------------- |
| requestOptions          | [@prequest/node](https://github.com/xdoer/PreQuest/tree/main/packages/node) | 否   | 无                 | 接口请求配置项                                | 全局和局部配置中的字段会进行 merge                 |
| outPutDir               | string                                                                      | 否   | 无                 | 类型文件输出目录                              |                                                    |
| outPutPath              | string                                                                      | 否   | 无                 | 类型文件输出路径                              | 类型默认输出的路径,配置 outPutDir 的话，会整合路径 |
| requestPoolLimit        | number                                                                      | 否   | 10                 | 同时请求的接口数量                            |                                                    |
| parseResponse           | (res) => Json string \| Json object                                         | 否   | 无                 | 全局解析接口响应                              | 全局解析响应，局部响应有差异，可以局部配置中配置   |
| customRootInterfaceName | (req) => string \| void                                                     | 否   | 默认为最后的子路径 | 自定义符合自己预期的 interfaceName 以方便调用 |                                                    |
| data                    | 局部参数[]                                                                  | 是   | []                 | 类型解析列表                                  | 程序根据配置，自动请求接口，解析响应，生成类型文件 |

### 局部参数

| 名称                | 类型                                                                        | 必填 | 默认值             | 含义                                          | 备注                                                                     |
| ------------------- | --------------------------------------------------------------------------- | ---- | ------------------ | --------------------------------------------- | ------------------------------------------------------------------------ |
| requestOptions      | [@prequest/node](https://github.com/xdoer/PreQuest/tree/main/packages/node) | 否   | 无                 | 接口请求配置项                                |                                                                          |
| outPutPath          | string                                                                      | 否   | 无                 | 类型文件输出路径                              | 没配置的话，会输出到全局 outPutPath, 全局配置 outPutDir 的话，会整合路径 |
| rootInterfaceName   | string                                                                      | 否   | 默认为最后的子路径 | 自定义符合自己预期的 interfaceName 以方便调用 | 没配置的话，会使用全局 customRootInterfaceName                           |
| parseResponse       | (res) => Json string \| Json object                                         | 否   | 无                 | 解析接口响应                                  |                                                                          |
| customInterfaceName | (key, value, data) => string \| void                                        | 否   | 无                 | 自定义中间产物的 interface                    |                                                                          |

## 其他

项目使用 [@prequest/node](https://github.com/xdoer/PreQuest/tree/main/packages/node) 发起请求，使用 [json-types-generator](https://github.com/xdoer/json-types-generator) 进行数据解析。
