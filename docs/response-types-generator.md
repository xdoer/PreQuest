# @prequest/response-types-generator

Restful-API 响应的 JSON 数据的 TypeScript 类型生成器

## 安装

```bash
npm install @prequest/response-types-generator
```

## 使用

### 最简单使用

下面的例子，将在当前目录下，生成导出 interface 为 Topics 的文件名为 topics 的 TS 文件。

```ts
import responseTypesGenerator from '@prequest/response-types-generator'

responseTypesGenerator({
  data: [
    {
      path: 'https://cnodejs.org/api/v1/topics',
    },
  ],
})
```

### 全功能使用

```ts
import responseTypesGenerator from '@prequest/response-types-generator'

responseTypesGenerator({
  // 全局配置项，data 中的请求会自动与这里进行 merge
  requestOptions: {
    baseURL: 'https://webspiderr.herokuapp.com',
    method: 'GET',
  },
  // 输出文件夹地址
  outPutDir: '/Users/xdoer',
  // 同时请求的接口数量
  requestPoolLimit: 10,
  // 解析响应
  parseResponse: res => res.data,
  // 自定义导出的 interface 名称
  customRootInterfaceName:  (req) => {
    return req.path.replace(/.+\/(\w+)/, (_, name) => name).replace(/^[a-z]/, (c) => c.toUpperCase())
  },
  // 自定义输出的文件名称
  customOutPutFileName: (req) => {
    return req.path.replace(/.+\/(\w+)/, (_, name) => name)
  },
  data: [
    {
      // 接口请求路径
      path: '/crawl/api'
      // 请求配置项项
      requestOptions: {
        params: {
          user: 'xdoer',
          cid: '73b1430d-faa0-44eb-899e-36cf5cbfaec8',
        },
      },
      // 输出文件名
      outPutFileName: 'crawl-types',
      // 导出的 interface 名称
      rootInterfaceName: 'Crawl',
      // 解析响应
      parseResponse: res => JSON.parse(res.data),
      // 自定义中间产物的 interface 名称
      customInterfaceName: (key, value, data) => {
        if (key === 'a') return 'name'
      },
    },
  ],
})
```

## 配置

配置分为两部分: 全局配置与局部配置。

### 全局配置

| 名称                    | 类型                                                                                  | 必填 | 默认值             | 含义                                          | 备注                                               |
| ----------------------- | ------------------------------------------------------------------------------------- | ---- | ------------------ | --------------------------------------------- | -------------------------------------------------- |
| requestOptions          | [@prequest/node](https://github.com/xdoer/PreQuest/tree/main/packages/node)请求配置项 | 否   | 无                 | 接口请求配置项                                | 全局和局部配置中的字段会进行 merge                 |
| outPutDir               | string                                                                                | 否   | 无                 | 类型文件输出目录                              |                                                    |
| requestPoolLimit        | number                                                                                | 否   | 10                 | 同时请求的接口数量                            |                                                    |
| parseResponse           | (res) => Json string \| Json object                                                   | 否   | (res) => res.data  | 全局解析接口响应                              | 全局解析响应，局部响应有差异，可以局部配置中配置   |
| customRootInterfaceName | (req) => string \| void                                                               | 否   | 默认为最后的子路径 | 自定义符合自己预期的 interfaceName 以方便调用 |                                                    |
| customOutPutFileName    | (req) => string \| void                                                               | 否   | 默认为最后的子路径 | 自定义符合自己预期的文件名称                  | 当局部配置项中配置了 outPutPath, 则                |
| data                    | 局部参数[]                                                                            | 是   | []                 | 类型解析列表                                  | 程序根据配置，自动请求接口，解析响应，生成类型文件 |

### 局部配置

| 名称                | 类型                                                                                  | 必填 | 默认值             | 含义                                          | 备注                                                          |
| ------------------- | ------------------------------------------------------------------------------------- | ---- | ------------------ | --------------------------------------------- | ------------------------------------------------------------- |
| path                | string                                                                                | 是   | 无                 | 接口路径                                      |                                                               |
| requestOptions      | [@prequest/node](https://github.com/xdoer/PreQuest/tree/main/packages/node)请求配置项 | 否   | 无                 | 接口请求配置项                                | requestOptions 也配置了 path 的话，会使用这里的 path 进行请求 |
| outPutFileName      | string                                                                                | 否   | 无                 | 文件输出名称                                  |                                                               |
| rootInterfaceName   | string                                                                                | 否   | 默认为最后的子路径 | 自定义符合自己预期的 interfaceName 以方便调用 | 没配置的话，会使用全局 customRootInterfaceName                |
| parseResponse       | (res) => Json string \| Json object                                                   | 否   | 无                 | 解析接口响应                                  |                                                               |
| customInterfaceName | (key, value, data) => string \| void                                                  | 否   | 无                 | 自定义中间产物的 interface                    |                                                               |

## 其他

项目使用 [@prequest/node](https://github.com/xdoer/PreQuest/tree/main/packages/node) 发起请求，使用 [json-types-generator](https://github.com/xdoer/json-types-generator) 进行数据解析。
