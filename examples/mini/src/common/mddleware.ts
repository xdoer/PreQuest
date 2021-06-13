export async function parseResponse(ctx, next) {
  await next()

  // 用户服务器返回 401, 微信不会抛出异常、需要用户自己处理
  // 这里抛出异常，会被错误重试中间件捕获
  const { data, statusCode } = ctx.response
  if (statusCode !== 200) throw new Error(data as string || '响应数据有误')
  ctx.response = data as any
}
