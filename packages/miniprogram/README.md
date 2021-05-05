# @prequest/miniprogram

A Modern MiniProgram Request Library.

## Example

### Native Request

First, let us see the demo which call a request by native api.

```ts
const requestInstance = wx.request({
  url: 'http://localhost:3000/api',
  method: 'post',
  data: {
    x: '',
  },
  header: {
    'content-type': 'application/json',
  },
  success(res) {
    console.log(res.data);
  },
});

requestInstance.abort();
```

### Basic Usage

How to use this library ?

```ts
import { createPreQuest, PreQuest } from '@prequest/miniprogram';

// global config
PreQuest.defaults.baseURL = 'http://localhost:3000';

// global middleware
PreQuest.use(async (ctx, next) => {
  // modify request params
  console.log(ctx.request);
  await next();
  // handle response error or modify response data
  console.log(ctx.response);
});

// instance config options
const opt = { baseURL: 'http://localhost:3001' };

// pass in native request core, so you can use this library in different miniprogram platform.
const instance = createPreQuest(wx.request, opt);

// instance middleware
instance.use(async (ctx, next) => {
  ctx.request.path = '/prefix' + ctx.request.path;
  await next();
  ctx.response = JSON.parse(ctx.response);
});

// request
instance.request({ path: '/api' });

// request by alias
instance.get('/api');
```

### Interceptor

If you want to use interceptor like axios, you may need this, or middleware can meet you demand.

```ts
import { PreQuest, createPreQuest } from '@prequest/miniprogram';
import { interceptorMiddleware } from '@prequest/interceptor';

// create Interceptor instance
const interceptor = new Interceptor();

// use
interceptor.request.use(
  requestOpt => modify(requestOpt),
  err => handleErr(err)
);

// mount global interceptor middleware
PreQuest.use(interceptor.run);

// or you can mount it to prequest instance
const instance = createPreQuest(wx.request);
instance.use(interceptor.run);
```

### Request Instance

How to get native request instance so you can do something like abort ?

```ts
import { PreQuest, createPreQuest } from '@prequest/miniprogram';

const instance = createPreQuest(wx.request);

let requestInstance;

instance.request({
  path: '/api',
  getRequestInstance(nativeRequestInstance) {
    requestInstance = nativeRequestInstance;
  },
});

// must call requestInstance in next event loop
setTimeout(() => {
  requestInstance.abort();
});
```
