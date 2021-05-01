import { Config } from "./types"

export const METHODS = ['get', 'post', 'delete', 'put', 'patch', 'head', 'options', 'rpc'];

export const defaultConfig: Config = { method: 'get', headers: { Accept: 'application/json' }, requestType: 'json' }
