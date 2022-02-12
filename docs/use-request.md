# useRequest

一个 Http Request React Hook.

## 安装

```bash
npm install @prequest/use-request
```

## 初始化

```ts
import createQueryHook from '@prequest/use-request'
import { create, PreQuest, Request, Response } from '@prequest/xhr'

const prequest = create({
  baseURL: 'http://localhost:3001',
})

const useQuery = createQueryHook<Request, Response>(prequest)
```

同时你也可以不受影响的使用 PreQuest 的能力。

```ts
import { create, PreQuest } from '@prequest/xhr'

PreQuest.defaults.baseURL = 'http://localhost:3000'

const prequest = create({
  baseURL: 'http://localhost:3001',
})

prequest.use(async (ctx, next) => {
  console.log('---request log', ctx.request)
  await next()
  console.log('---response log', ctx.response)
})
```

## 使用

### 基本使用

```ts
// 组件 props
interface UserProps {
  id: number
}

interface Response<T> {
  success: boolean
  data: T
  error: any
}

// 接口响应的数据类型
interface UserRes {
  id: number
  name: string
  age: number
}

const User: FC<UserProps> = ({ id }) => {
  const { response, loading, error } = useQuery<Response<UserRes>>('/user', {
    params: { id },
  })

  return (
    <div>
      {loading && <div>加载中</div>}
      {response && <div>姓名:{response?.name}</div>}
      {error && <div>{error}</div>}
    </div>
  )
}
```

### 校验参数

当 useQuery 请求参数不确定时，可以传入函数参数，进行请求参数校验

```tsx
interface UserProps {
  id?: number
}

const User: FC<UserProps> = ({ id }) => {
  const { response, loading, error } = useQuery('/user', () => {
    if (!id) throw new Error()
    return {
      params: { id },
    }
  })

  return (
    <div>
      {loading && <div>加载中</div>}
      {response && <div>{response}</div>}
      {error && <div>{error}</div>}
    </div>
  )
}
```

### 延迟请求/手动请求

由事件触发请求。需要配置 `lazy` 为 `true`。进行调用时，使用导出的 `toFetch` 进行调用。当需要刷新数据时，也可以调用 `toFetch`

```tsx
interface UserProps {
  id: number
}

const User: FC<UserProps> = ({ id }) => {
  const { response, loading, error, toFetch } = useQuery(
    { path: '/user', params: { id } },
    { lazy: true }
  )

  async function onClick() {
    toFetch()
  }

  return (
    <div>
      <div onClick={onClick}>点击请求</div>
      {loading && <div>加载中</div>}
      {response && <div>{response}</div>}
      {error && <div>{error}</div>}
    </div>
  )
}
```

此外，还可以使用 `useQuery.get('/user').toFetch` 进行调用

### 循环请求

传参 `loop` 即可开启循环请求

```tsx
interface UserProps {
  id: number
}

const User: FC<UserProps> = ({ id }) => {
  const { response, loading, error, stopLoop } = useQuery(
    { path: '/user', params: { id } },
    { loop: 1000 }
  )

  function onClick() {
    stopLoop()
  }

  return (
    <div>
      <div onClick={onClick}>点击停止</div>
      {loading && <div>加载中</div>}
      {response && <div>{response}</div>}
      {error && <div>{error}</div>}
    </div>
  )
}
```

### Loading 状态与分页更新

```tsx
const Users = () => {
  const [pageNo, setPageNo] = useState(0)
  const { response, loading, error } = useQuery('/users', {
      params: {
        pageSize: 10,
        pageNo: pageNo
      },
    },
    {
      deps: [pageNo]  // pageNo 变更时，重新请求
      onUpdate(prev, cur) {
        if (!prev) return cur
        return prev.concat(cur)
      },
    }
  )

  function onScrollToLower() {
    if (loading) return
    setPageNo(i => i + 1)
  }

  return (
    <ScrollView onScrollToLower={onScrollToLower}>
      {loading && <div>加载中</div>}
      {response && <div>{response}</div>}
      {error && <div>{error}</div>}
    </ScrollView>
  )
}
```
