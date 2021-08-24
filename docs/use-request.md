# useRequest

一个 Http Request React Hook.

## 安装

```bash
npm install @prequest/use-request
```

## 初始化

```ts
import requestHook from '@prequest/use-request'
import { create, PreQuest, Request, Response } from '@prequest/xhr'

const prequest = create({
  baseURL: 'http://localhost:3001',
})

const useRequest = requestHook<Request, Response>(prequest)
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

// 接口响应的数据类型
interface UserRes {
  id: number
  name: string
  age: number
}

const User: FC<UserProps> = ({ id }) => {
  const { data, loading, error } = useRequest<UserRes>({
    path: '/user',
    params: { id },
  })

  return (
    <div>
      {loading && <div>加载中</div>}
      {data && <div>姓名:{data?.name}</div>}
      {error && <div>{error}</div>}
    </div>
  )
}
```

### 校验参数

当 useRequest 请求参数不确定时，可以传入函数参数，进行请求参数校验

```tsx
interface UserProps {
  id?: number
}

const User: FC<UserProps> = ({ id }) => {
  const { data, loading, error } = useRequest(() => {
    if (!id) throw new Error()
    return {
      path: '/user',
      params: { id },
    }
  })

  return (
    <div>
      {loading && <div>加载中</div>}
      {data && <div>{data}</div>}
      {error && <div>{error}</div>}
    </div>
  )
}
```

### 延迟请求

由事件触发请求。需要配置 `lazy` 为 `true`。进行调用时，使用导出的 `request` 进行调用

```tsx
interface UserProps {
  id: number
}

const User: FC<UserProps> = ({ id }) => {
  const { data, loading, error, request } = useRequest(
    { path: '/user', params: { id } },
    { lazy: true }
  )

  async function onClick() {
    // request 可直接拿到 res, onClick 方法里需要用到 data 数据时，建议从 res 中取，因为 data 经过 setState, 是"异步"的
    const res = await request(prev => {
      // prev 为 useRequest 配置的参数
      const { params } = prev

      return {
        ...prev,
        params: {
          id: 2,
        },
      }
    })
    console.log(res)
  }

  return (
    <div>
      <div onClick={onClick}>点击请求</div>
      {loading && <div>加载中</div>}
      {data && <div>{data}</div>}
      {error && <div>{error}</div>}
    </div>
  )
}
```

### 循环请求

传参 `loop` 即可开启循环请求

```tsx
interface UserProps {
  id: number
}

const User: FC<UserProps> = ({ id }) => {
  const { data, loading, error, clearLoop } = useRequest(
    { path: '/user', params: { id } },
    { loop: 1000 }
  )

  function onClick() {
    clearLoop()
  }

  return (
    <div>
      <div onClick={onClick}>点击停止</div>
      {loading && <div>加载中</div>}
      {data && <div>{data}</div>}
      {error && <div>{error}</div>}
    </div>
  )
}
```

### Loading 状态与分页更新

```tsx
const Users = () => {
  const { data, loading, loadingRef, error, request } = useRequest(
    {
      path: '/users',
      params: { page: 1 },
    },
    {
      onUpdate(prevData, data) {
        if (!prevData) return data
        return prevData.concat(data)
      },
    }
  )

  function onScrollToLower() {
    if (loadingRef.current) return
    request(prev => {
      const { params } = prev
      const { page } = params
      return {
        ...prev,
        params: {
          page: page + 1,
        },
      }
    })
  }

  return (
    <ScrollView onScrollToLower={onScrollToLower}>
      {loading && <div>加载中</div>}
      {data && <div>{data}</div>}
      {error && <div>{error}</div>}
    </ScrollView>
  )
}
```

## 参数列表

useRequest 支持两个对象参数。

在上面 [初始化](#初始化) 一节中，我们从 `@prequest/xhr` 请求库中导出的 `Request` 类型，在 requestHook 中进行了初始化，useRequest 函数的第一个对象参数，即为这里初始化的类型参数。

第二个对象参数，支持设置 `lazy` 与 `loop`
