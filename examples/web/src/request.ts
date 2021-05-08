import axios from 'axios'
import request from 'umi-request'
import { create } from '@prequest/xhr'
import { prequest } from '@prequest/fetch'
import { graphql } from '@prequest/graphql'

export function createAxios() {
  const instance = axios.create({
    baseURL: 'http://localhost:10000',
    timeout: 1000,
    responseType: 'json',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    }
  });
  return instance.post('/api', { a: 1, b: 2 }).then(res => { console.log('----axios', res) }).catch(e => console.log('----axios---error', e))
}


export async function createFetchPreQuest() {
  prequest('http://localhost:10000/api', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    }
  }).then(res => {
    console.log('哈哈哈', res)
  })
}

export function createUmiRequest() {
  return request
    .post('http://localhost:10000/api', {
      data: {
        name: 'Mike',
      },
      requestType: 'json',
      responseType: 'json',
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

export async function createXMLPreQuest() {
  const adapter = create({})
  let request: XMLHttpRequest
  const xxx = adapter.post('/api', {
    data: { a: '1' },
    requestType: 'json',
    getRequestInstance(instance) {
      request = instance
    }
  })
  console.log('查看响应值')
  setTimeout(() => request.abort())
  return xxx
}

export function createGraphqlPreQuest() {
  const query = `
    {
      me {
        name
      }
    }
  `
  const instance = create({})
  const request = graphql(instance as any)
  return request(query, { name: 'ha' }, { path: '/api' })
}
