import axios from 'axios'
import request from 'umi-request'
// import { PreQuest } from '../../../src'
// import { xmlAdapter, fetchAdapter } from '../../../src/adapter'
import { xhrAdapter } from '../../../src/adapter/xhr'

const baseURL = 'http://localhost:10000'

export function createAxios() {
  const instance = axios.create({
    baseURL: baseURL,
    timeout: 1000,
    responseType: 'json',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    }
  });
  return instance.post('/api', { a: 1, b: 2 }).then(res => { console.log('----axios', res) }).catch(e => console.log('----axios---error', e))
}

export function createUmiRequest() {
  return request
    .post('http://localhost:10000/api', {
      data: {
        name: 'Mike',
      },
      responseType: 'json',
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

export function createXMLPreQuest() {
  const adapter = xhrAdapter({
    baseURL: 'http://localhost:10000'
  })

  adapter.use
}

// export function createXMLPreQuest() {
//   const axis = new PreQuest({
//     adapter: xmlAdapter({ withCredentials: false, responseType: 'json' }),
//     baseURL: 'http://localhost:10000',
//     requestType: 'json',
//     injectAdapterInstance() {
//       return Promise.resolve(new XMLHttpRequest())
//     }
//   })

//   return axis.post('/api', { data: { a: '1' } }).then(res => { console.log('----preQuest', res) }).catch(e => console.log('----preQuest', e))
// }

// export function createFetchPreQuest() {
//   const axis = new PreQuest({
//     adapter: fetchAdapter({
//       parseBody(ctx) {
//         return ctx.json()
//       }
//     }),
//     timeout: 1000,
//     baseURL: 'http://localhost:10000',
//     requestType: 'json',
//     injectAdapterInstance(url, config) {
//       const { method, headers, data } = config

//       const options = {
//         body: data,
//         headers,
//         method,
//       }

//       return fetch(url, options)
//     }
//   })

//   return axis.post('/api', { data: { a: '1' } }).then(res => { console.log('----preQuest', res) }).catch(e => console.log('----preQuest', e))
// }
