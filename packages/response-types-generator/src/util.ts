export const getDefaultRootInterfaceName = (reqPath: string) => {
  return reqPath.replace(/.*\/(\w+)/, (_, __) => __)
}
