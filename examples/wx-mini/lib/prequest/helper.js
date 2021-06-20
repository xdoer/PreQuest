export function createRequestUrl(ctx) {
  const {
    baseURL,
    path,
    params
  } = ctx;
  let url = ctx.url || '';

  if (isAbsoluteURL(path)) {
    url += path;
  } else {
    if (baseURL) url += baseURL;
    if (path) url += path;
  }

  if (params && !isEmpty(params)) url += `?${covertObjToSearchParams(params)}`;
  return url;
}

export function isAbsoluteURL(url) {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

export const covertObjToSearchParams = (searchObj) => {
  let searchParams = ''
  for (let i in searchObj) {
    searchParams = searchParams + `${i}=${encodeURI(searchObj[i])}&`
  }
  return searchParams.slice(0, -1)
}

export function isEmpty(value) {
  const type = elementType(value);

  switch (type) {
    case 'object':
      return !Object.keys(type).length;

    case 'array':
      return !type.length;

    default:
      return !type;
  }
} 
