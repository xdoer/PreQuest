# PreQuest

赋能你的请求库。

该库可以很方便的为各个平台(Node, Web, React Native, 小程序)等的请求库添加中间件，拦截器，快捷请求等功能。同时提供了大量 helper 函数来处理请求库中常用功能，比如合并请求参数，添加请求头，格式化输出等。

库内部没有实现具体的请求过程，因为不同平台，不同请求工具支持的参数和响应不同，所以开发者需要根据想要实现的请求过程，定义`Request` 和 `Response` 接口，根据需要，还可以传入自定义 `Error` 类，用于处理拦截器中的错误。

## Example

```ts
import { PreQuest } from 'src/core';

// 请求参数，需开发者自己定义。该参数
interface Request {
  baseURL: string;
  path: string;
  params: Record<string, string>
}

// 响应类型
interface Response {
  data: string;
}

// 包装器
function createFetchInstance(opt: Partial<Request>) {
  return PreQuest.createInstance<Request, Response, Error>(
    // 请求实例
    async adapter(option) {
      const { baseURL, path } = option;
      const url = baseURL + path;
      return { data: await fetch(url).then(res => res.json()) };
    },
    opt
  );
}

// 创建实例
const instance = createFetchInstance({ baseURL: 'http://localhost:3000' });

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
instance.get('/api', { params: { a: 1 } });
```
