import { wrapper } from '@prequest/wrapper'

export function adapter({ method, url, data = {}, timeout = 5000 }: any) {
  let body: any = null;
  let query = "";
  if (method === "GET") {
    // 解析对象传参
    for (const key in data) {
      query += `&${key}=${data[key]}`;
    }
    if (query) {
      query = "?" + query.slice(1);
    }
  } else {
    // 若后台没设置接收 JSON 则不行 需要跟 GET 一样的解析对象传参
    body = JSON.stringify(data);
  }
  return new Promise((resolve, reject) => {
    fetch(url + query, {
      // credentials: "include",  // 携带cookie配合后台用
      // mode: "cors",            // 貌似也是配合后台设置用的跨域模式
      method: method,
      headers: {
        "Content-Type": "application/json"
        // "Content-Type": "application/x-www-form-urlencoded"
      },
      body: body
    }).then(response => {
      // 把响应的信息转为`json`
      return response.json();
    }).then(res => {
      resolve(res);
    }).catch(error => {
      reject(error);
    });
    setTimeout(reject.bind(this, "fetch is timeout"), timeout);
  });
}

export const fetchRe = wrapper(adapter)
