import http from 'http'
import https from 'https'
import { URL } from 'url'
import { http as redirectHttp, https as redirectHttps } from 'follow-redirects'
import { Request, Response, Proxy } from './types'
import { createRequestUrl } from '@prequest/helper'
import { stripBOM, getRequestBody, isStream } from './helper'

function setProxy(options: any, proxy: Proxy, location: string) {
  options.hostname = proxy.host
  options.host = proxy.host
  options.port = proxy.port
  options.path = location

  if (proxy.auth) {
    const base64 = Buffer.from(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString(
      'base64'
    )
    options.headers['Proxy-Authorization'] = 'Basic ' + base64
  }

  options.beforeRedirect = (redirection: any) => {
    redirection.headers.host = redirection.host
    setProxy(redirection, proxy, redirection.href)
  }
}

const isHttpsReg = /^https:?/

export function adapter(config: Request): Promise<Response> {
  const finalOptions = config as Required<Request>
  const url = createRequestUrl(finalOptions)
  const parsedURL = new URL(url)
  const {
    responseType,
    responseEncoding = 'utf8',
    timeout,
    headers = {},
    data,
    maxBodyLength,
  } = finalOptions
  const {
    method = 'get',
    auth,
    socketPath,
    proxy: optionProxy,
    httpAgent,
    httpsAgent,
    maxRedirects,
  } = finalOptions
  const body = getRequestBody(data)

  // 设置 ContentLength 请求头
  if (body) {
    headers['Content-Length'] = body.length
  }

  // 设置 userAgent 请求头
  const userAgent = headers['User-Agent'] || headers['user-agent'] || 'PreQuest'
  delete headers['User-Agent']
  delete headers['user-agent']
  headers['User-Agent'] = userAgent

  // 设置 HTTP 简单校验
  const username = auth?.username || parsedURL.username || ''
  const password = auth?.password || parsedURL.password || ''
  const authStr = username && password ? username + ':' + password : ''

  if (authStr) {
    delete headers.Authorization
  }

  const options: any = {
    path: url,
    method,
    headers,
    auth: authStr,
    agent: isHttpsReg.test(parsedURL.protocol) ? httpsAgent : httpAgent,
    agents: { http: httpAgent, https: httpsAgent },
  }

  if (socketPath) {
    options.socketPath = socketPath
  } else {
    options.hostname = parsedURL.hostname
    options.port = parsedURL.port
  }

  let proxy: any = optionProxy
  if (!proxy && proxy !== false) {
    const proxyEnv = (parsedURL.protocol || 'http:').slice(0, -1) + '_proxy'
    const proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()]
    if (proxyUrl) {
      const parsedProxyUrl = new URL(proxyUrl)
      const noProxyEnv = process.env.no_proxy || process.env.NO_PROXY
      let shouldProxy = true

      if (noProxyEnv) {
        var noProxy = noProxyEnv.split(',').map(function trim(s) {
          return s.trim()
        })

        shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
          if (!proxyElement) {
            return false
          }
          if (proxyElement === '*') {
            return true
          }
          if (
            proxyElement[0] === '.' &&
            parsedURL.hostname.substr(parsedURL.hostname.length - proxyElement.length) ===
              proxyElement
          ) {
            return true
          }

          return parsedURL.hostname === proxyElement
        })
      }

      if (shouldProxy) {
        proxy = {
          host: parsedProxyUrl.hostname,
          port: parsedProxyUrl.port,
          protocol: parsedProxyUrl.protocol,
        }

        if (parsedProxyUrl.password && parsedProxyUrl.username) {
          proxy.auth = {
            username: parsedProxyUrl.username,
            password: parsedProxyUrl.password,
          }
        }
      }
    }
  }

  if (proxy) {
    const { hostname, port, protocol } = parsedURL
    options.headers.host = hostname + (port ? ':' + port : '')
    setProxy(options, proxy, protocol + '//' + hostname + (port ? ':' + port : '') + options.path)
  }

  let transport: any
  var isHttpsProxy =
    isHttpsReg.test(parsedURL.protocol) && (proxy ? isHttpsReg.test(proxy.protocol) : true)

  if (maxRedirects === 0) {
    transport = isHttpsProxy ? https : http
  } else {
    if (maxRedirects) {
      options.maxRedirects = maxRedirects
    }
    transport = isHttpsProxy ? redirectHttps : redirectHttp
  }

  if (maxBodyLength > -1) {
    options.maxBodyLength = maxBodyLength
  }

  return new Promise((resolve, reject) => {
    const req = transport.request(options, (res: any) => {
      if (req.aborted) return

      const { statusCode, headers } = res

      let responseBuffer: Buffer[] = []

      res.on('data', (chunk: any) => {
        responseBuffer.push(chunk)
      })

      res.on('end', () => {
        const bufferData = Buffer.concat(responseBuffer)
        let resData: any = null
        switch (responseType) {
          case 'arraybuffer': {
            resData = bufferData
            break
          }
          default:
            resData = bufferData.toString(responseEncoding)
            if (['utf8', 'utf-8'].includes(responseEncoding)) {
              resData = stripBOM(resData)
            }
        }

        resolve({ data: resData, status: statusCode!, headers })
      })

      res.on('error', reject)
    })

    if (timeout) {
      req.setTimeout(timeout, () => {
        req.destroy()
        reject('timeout')
      })
    }

    if (isStream(data)) {
      data
        .on('error', (err: any) => {
          reject(err)
        })
        .pipe(req)
    } else {
      req.end()
    }
  })
}
