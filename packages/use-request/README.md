# useRequest

一个 Http Request React Hook.

## 初始化

首先安装任意一个基于 PreQuest Core 的 HTTP 客户端，比如: `@prequest/xhr`、`@prequest/fetch`、`@prequest/node`、`@prequest/miniprogram`...

```bash
yarn add @prequest/xhr
```

初始化 `useRequest`

```tsx
import { RequestHook } from '@prequest/use-request';
import { prequest, PreQuest, Request, Response } from '@prequest/xhr';

const queryHook = new RequestHook<Request, Response>(prequest);
const useRequest = queryHook.useRequest.bind(queryHook);
```

你也可以不受影响的使用 PreQuest 的能力。

```tsx
import { create } from '@prequest/xhr';

const prequest = create({
  baseURL: 'http://localhost:3000',
});

prequest.use(async (ctx, next) => {
  console.log('---request log', ctx.request);
  await next();
  console.log('---response log', ctx.response);
});

// ... 初始化 useRequest
```

## 使用

### 基本使用

```tsx
interface UserProps {
  id: number;
}

const User: FC<UserProps> = ({ id }) => {
  const { data, loading, error } = useRequest({
    path: '/user',
    params: { id },
  });

  return (
    <div>
      {loading && <div>加载中</div>}
      {data && <div>{data}</div>}
      {error && <div>{error}</div>}
    </div>
  );
};
```

### 校验参数

当 useRequest 请求参数不确定时，可以传入函数参数，进行请求参数校验

```tsx
interface UserProps {
  id?: number;
}

const User: FC<UserProps> = ({ id }) => {
  const { data, loading, error } = useRequest(() => {
    if (!id) throw new Error();
    return {
      path: '/user',
      params: { id },
    };
  });

  return (
    <div>
      {loading && <div>加载中</div>}
      {data && <div>{data}</div>}
      {error && <div>{error}</div>}
    </div>
  );
};
```

### 延迟请求

由事件触发请求

```tsx
interface UserProps {
  id: number;
}

const User: FC<UserProps> = ({ id }) => {
  const { data, loading, error, request } = useRequest(
    { path: '/user', params: { id } },
    { lazy: true }
  );

  function onClick() {
    request(prev => {
      const { params } = prev;

      return {
        ...prev,
        params: {
          id: 2,
        },
      };
    });
  }

  return (
    <div>
      <div onClick={onClick}>点击请求</div>
      {loading && <div>加载中</div>}
      {data && <div>{data}</div>}
      {error && <div>{error}</div>}
    </div>
  );
};
```

### 循环请求

```tsx
interface UserProps {
  id: number;
}

const User: FC<UserProps> = ({ id }) => {
  const { data, loading, error, clearLoop } = useRequest(
    { path: '/user', params: { id } },
    { loop: 1000 }
  );

  function onClick() {
    clearLoop();
  }

  return (
    <div>
      <div onClick={onClick}>点击请求</div>
      {loading && <div>加载中</div>}
      {data && <div>{data}</div>}
      {error && <div>{error}</div>}
    </div>
  );
};
```

### Loading 状态与分页更新

`useRequest` 中内置了两个 loading: `loading` 与 `loadingRef`。

```tsx
const Users = () => {
  const { data, loading, error, loadingRef, request } = useRequest(
    {
      path: '/users',
      params: { page: 1 },
    },
    {
      onUpdate(prevData, data) {
        if (!prevData) return data;
        return prevData.concat(data);
      },
    }
  );

  function onScrollToLower() {
    if (loadingRef.current) return;
    request(prev => {
      const { params } = prev;
      const { page } = params;
      return {
        ...prev,
        params: {
          page: page + 1,
        },
      };
    });
  }

  return (
    <ScrollView onScrollToLower={onScrollToLower}>
      {loading && <div>加载中</div>}
      {data && <div>{data}</div>}
      {error && <div>{error}</div>}
    </ScrollView>
  );
};
```

`loading` 状态用于页面渲染，`loadingRef` 是实际请求接口的 loading 状态。

**_设计原因: loading 状态保存在 useState 中，useState 是异步更新视图，loading 不能有效表明接口请求的状态，尤其在上面的 demo 中，将 `loadingRef` 改为 `loading` 会造成重复请求相同页码的接口。_**
