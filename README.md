# PreQuest

赋能你的请求库。

## 功能

> - 添加拦截器
> - 添加中间件
> - 添加快捷请求

## example

```ts
import { PreQuest } from 'src/preQuest';

// 请求参数，需开发者自己定义。该参数
interface Request {
  baseURL: string;
  path: string;
}

// 响应类型
interface Response {
  data: string;
}

// 包装器
function xhr(opt: Partial<Request>) {
  return PreQuest.createInstance<Request, Response, Error>({
    ...opt,
    // 请求实例
    async adapter(option) {
      const { baseURL, path } = option;
      const url = baseURL + path;
      return { data: await fetch(url).then(res => res.json()) };
    },
  });
}

// 创建实例
const instance = xhr({ baseURL: 'http://localhost:3000' });

// 拦截器
instance.interceptor.request.use(
  // opt 为 Request 类型
  opt => {
    opt.path = '/prefix' + opt.path;
    return opt;
  },
  // e 为 Error 类型
  e => {
    console.log(e);
  }
);

// 中间件
instance.use(async (ctx, next) => {
  // Request 类型
  console.log(ctx.request);

  await next();
  // Response 类型
  console.log(ctx.response);
});

// 请求
instance.get('/api', { baseURL: 'http://localhost: 10000' });
```
