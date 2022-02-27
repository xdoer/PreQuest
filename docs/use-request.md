# useRequest

一个 Http Request React Hook.

## 安装

```bash
npm install @prequest/use-request
```

## 初始化

```ts
import createQueryHook from '@prequest/use-request'
import { create, PreQuest } from '@prequest/xhr'

const prequest = create({
  baseURL: 'http://localhost:3001',
})

const useQuery = createQueryHook(prequest)
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
declare module '@prequest/types' {
  // 接口响应
  interface PQResponse<T> {
    success: boolean
    data: T
  }
}

// 组件 props
interface UserProps {
  id: number
}

// 接口响应的数据类型
interface UserRes {
  id: number
  name: string
  age: number
}

const User: FC<UserProps> = ({ id }) => {
  const { response, loading, error } = useQuery<UserRes>('/user', {
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
    toFetch({
      params: {
        id: 1,
      },
    })

    // 或者
    toFetch(prev => {
      return {
        ...prev,
        params: {
          id: prev.params.id + 1,
        },
      }
    })
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

此外，还可以使用 `useQuery.get('/user').toFetch` 进行调用。该方法在任意地方调用后，可以刷新对应的 useQuery 的数据状态

下面 demo 演示提交数据后，刷新列表数据。

```tsx
// 渲染 user 列表
const Users = () => {
  const { response, loading, error, toFetch } = useQuery('/users')
  const users = response?.users || []

  return (
    <div>
      {users.map(user => (
        <div>{user.name}</div>
      ))}
    </div>
  )
}

const SubmitForm = () => {
  async function onSubmit() {
    const { response } = await request.post('/user', { data: { user: { name: 'xdoer' } } })

    if (response.success) {
      // 新建用户成功后，刷新 user 列表
      useQuery.get('/users').toFetch()
    }
  }

  return <div onClick={onSubmit}>提交</div>
}
```

### 循环请求

传参 `loop` 即可开启循环请求

```tsx
const User = ({}) => {
  const { response, loading, error, stopLoop } = useQuery('/users', {}, { loop: 1000 })

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
  const { response, loading, error } = useQuery(
    '/users',
    {
      params: {
        pageSize: 10,
        pageNo: pageNo,
      },
    },
    {
      deps: [pageNo], // pageNo 变更时，重新请求
      onUpdate(cur, prev = []) {
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

### 自定义 key

当同一路径的多个 useQuery 调用时，HTTP 请求实际只会发起一次。第一个有效请求的 response 会响应到所有同一路径的 useQuery 中

```tsx
const User1 = ({}) => {
  const { response } = useQuery('/user', { params: { id: 1 } })

  return <div></div>
}
const User2 = ({}) => {
  const { response } = useQuery('/user', { params: { id: 2 } })

  return <div></div>
}
const User3 = ({}) => {
  const { response } = useQuery('/user', { params: { id: 3 } })

  return <div></div>
}

const App = () => {
  return (
    <User1 />
    <User2 />
    <User3 />
  )
}
```

上面示例中，User1、User2 与 User3 三个组件对同一路径的 useQuery 调用了三次，实际只会发起一次 HTTP 请求。三个组件中的 response 值都相等。

你可以传入一个自定义 key 来解决这个问题，传入不同的 key，会认为是不同的请求。

```ts
const { response } = useQuery('/user', { params: { id: 1 } }, { key: 'user-1' })
const { response } = useQuery('/user', { params: { id: 2 } }, { key: 'user-2' })
const { response } = useQuery('/user', { params: { id: 3 } }, { key: 'user-3' })
```

上面示例会发起三个 HTTP 请求。
