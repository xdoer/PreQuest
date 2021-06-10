# CancelToken

取消请求，代码移植自 [axios](https://github.com/axios/axios/tree/master/lib/cancel)

## 安装

```bash
npm install @prequest/cancel-token
```

## 使用

对于业务开发者来说，如何利用 cancelToken 打断请求？

方式一:

```ts
import { PreQuest, prequest } from '@prequest/xhr'
import { CancelToken } from '@prequest/cancel-token'

const source = CancelToken.source()

prequest.request({
  path: '/api',
  cancelToken: source.token,
})

source.cancel()
```

方式二:

```ts
import { prequest } from '@prequest/xhr'
import { CancelToken } from '@prequest/cancel-token'

let cancel

prequest.request({
  path: '/api',
  cancelToken: new CancelToken(c => (cancel = c)),
})

cancel()
```

## 集成到请求库

对于库开发者，如何将 CancelToken 集成到请求库中?

首先需要设计将 `cancelToken` 作为可选参数

```ts
import { CancelToken } from '@prequest/cancel-token'

interface Request {
  cancelToken?: CancelToken
}
```

其次在 `adapter` 函数中，处理 cancelToken

```ts
function adapter(opt) {
  const { cancelToken } = opt

  if (cancelToken) {
    cancelToken.promise.then(() => {
      // 调用原生请求的方法，打断请求
      nativeRequest.abort()
    })
  }

  // ...some code
}
```

您可以[查阅](https://github.com/xdoer/PreQuest/blob/main/packages/miniprogram/src/adapter.ts)这里，获得完整的示例。
