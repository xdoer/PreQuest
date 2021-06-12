export async function parseResponse(ctx, next) {
  await next()
  const { data, statusCode } = ctx.response
  if (statusCode !== 200) throw new Error(data as string || '响应数据有误')
  ctx.response = data as any
}
