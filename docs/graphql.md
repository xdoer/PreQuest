# GraphQL

GraphQL 请求语法糖

## 安装

```bash
npm install @prequest/graphql
```

## 使用

```ts
import { prequest } from '@prequest/xhr'

const request = graphql(prequest, {
  path: '/graphql',
  baseURL: 'http://localhost:3000',
  headers: {
    token: '12345',
  },
})

const query = `
  {
    me {
      name
    }
  }
`

const variables = { name: 'prequest' }

const opt = { params: { a: 1 } }

request(query, variables, opt).then(res => console.log(res))
```
