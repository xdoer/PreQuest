# 使用

## 开箱即用

> - [@prequest/xhr](/xhr ':target=_self'): 一个基于 XMLHttpRequest 的请求库
> - [@prequest/fetch](/fetch ':target=_self'): 一个基于 Fetch API 的请求库
> - [@prequest/node](/node ':target=_self'): 一个 nodejs 端的请求库
> - [@prequest/miniprogram](/miniprogram ':target=_self'): 一个小程序端的请求库
> - [@prequest/miniprogram-addon](/miniprogram-addon ':target=_self'): 小程序端的上传下载包

## 应用扩展

> - [@prequest/cache](/cache ':target=_self'): 接口缓存中间件
> - [@prequest/error-retry](/error-retry ':target=_self'): 接口请求错误重试中间件
> - [@prequest/lock](/lock ':target=_self'): 请求锁，token 处理的解决的方案
> - [@prequest/interceptor](/interceptor ':target=_self'): 拦截器中间件
> - [@prequest/use-request](/use-request ':target=_self'): React 请求 Hook
> - [@prequest/graphql](/graphql ':target=_self'): GraphQL 请求语法糖

## 项目迁移

> - [@prequest/wrapper](/wrapper ':target=_self'): 一个包裹器
> - [集成 axios](/work-with-axios ':target=_self'): 与 axios 一起工作

## 定制化

> - [@prequest/core](/core ':target=_self'): PreQuest 核心能力
> - [@prequest/cancel-token](/cancel-token ':target=_self'): 取消请求解决方案
> - [@prequest/helper](https://github.com/xdoer/PreQuest/tree/main/packages/helper ':target=_blank'): 一些有用的参数处理、响应处理的工具包
> - [@prequest/utils](https://github.com/xdoer/PreQuest/tree/main/packages/utils ':target=_blank'): 常规函数工具包

## 兼容性

整个项目默认全部都打包成了包含 ES6+ 代码的 ESM 模块。

如果您的项目中出现兼容性问题，请考虑使用 [babel](https://www.babeljs.cn/docs/options#include) 将代码编译成低版本的代码。

对于 Node 端，推荐使用 ESM 模块进行代码编写。[示例](https://github.com/xdoer/PreQuest/tree/main/examples/server)
