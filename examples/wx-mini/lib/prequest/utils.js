export const elementType = ele => {
  const typeStr = Object.prototype.toString.call(ele);
  const reg = /^\[object\s([A-Za-z]+)\]$/;
  reg.test(typeStr);
  return RegExp.$1.toLowerCase();
};

export const merge = (...args) => {
  return args.reduce((t, c) => {
    if (!c) return t;
    const data = Object.entries(c);
    const length = data.length;

    for (let i = 0; i < length; i++) {
      const [key, value] = data[i];

      if (elementType(value) === 'object') {
        t[key] = merge(t[key], value);
      } else {
        Object.assign(t, {
          [key]: value
        });
      }
    }

    return t;
  }, {});
};
