import { stringify } from 'qs';
import { CommonObject, Request, Config, AdapterRequest } from './types'
import { elementType } from './utils'

export function mergeConfig(...args: Config[]): Config {
  return args.reduce((t, c) => ({ ...t, ...c }), {} as Config)
}

export function createReqUrl(baseURL: string, path: string, params: CommonObject = {}) {
  const paramArr = Object.entries(params).map(([key, value]) => `${key}=${encodeURI(value)}`)
  const paramStr = paramArr.join('&')
  return `${baseURL}${path}${paramStr ? '?' + paramStr : ''}`
}

export function formatBody(config: Request) {
  const { headers, data, requestType } = config
  const bodyType = elementType(data)

  // 参考: https://github.com/umijs/umi-request/blob/master/src/middleware/simplePost.js
  if (bodyType === 'object' || bodyType === 'array') {
    if (requestType === 'json') {
      config.headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        ...headers,
      }
      config.data = JSON.stringify(data);
    } else {
      config.headers = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        ...headers,
      };
      config.data = stringify(data, { arrayFormat: 'repeat', strictNullHandling: true });
    }
  }

  return config
}

export function handleReqOptions(config: Request) {
  const { baseURL, path, params, ...options } = formatBody(config)
  return { url: createReqUrl(baseURL!, path!, params), options: options as AdapterRequest }
}
