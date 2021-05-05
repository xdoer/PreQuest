# @prequest/xhr

A Modern Request Library Based On XMLHttpRequest.

## Introduction

This library

## Example

### Native Usage

First, let us see how to use native XMLHttpRequest.

```ts
const xhr = new XMLHttpRequest();
xhr.open('GET', 'http://localhost:3000');
xhr.responseType = 'json';
xhr.onload = () => {
  if (xhr.readyState === 4 && xhr.status === 200) {
    resolve(xhr.response);
  } else {
    reject(xhr);
  }
};
xhr.send();
```

### Basic Usage

How to use this library ?

```ts
import { createPreQuest, PreQuest } from '@prequest/fetch';

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
const instance = createPreQuest(opt);

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
import { PreQuest, createPreQuest } from '@prequest/xhr';
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
const instance = createPreQuest();
instance.use(interceptor.run);
```

### Abort

How to abort a request?

```ts
import { createPreQuest } from '@prequest/xhr';

const instance = createPreQuest();

let nativeRequestInstance;
instance.post('/api', {
  getRequestInstance(instance) {
    nativeRequestInstance = instance;
  },
});

setTimeout(() => {
  nativeRequestInstance.abort();
});
```
