import { AdapterConfig } from "./types";

export const adapterDefaultConfig: AdapterConfig = {
  method: 'get',
  url: 'http://localhost:8000',
  timeout: 5000,
  withCredentials: false,
  headers: {},
  responseType: 'json'
}
