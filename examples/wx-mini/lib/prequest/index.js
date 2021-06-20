import { PreQuest } from './core';
import { createRequestUrl } from './helper';

function adapter(request) {
  return opt => {
    const finalOption = opt || {};
    const url = createRequestUrl(finalOption);
    const {
      getNativeRequestInstance,
      cancelToken,
      ...rest
    } = finalOption;
    let resolvePromise;
    getNativeRequestInstance == null ? void 0 : getNativeRequestInstance(new Promise(resolve => resolvePromise = resolve));
    return new Promise((resolve, reject) => {
      let instance;

      if (cancelToken) {
        // 执行请求时被取消
        cancelToken.promise.then(() => {
          // 这里的 instance 在执行时是一定存在的
          instance.abort();
          reject(cancelToken.reason);
        });
      }

      instance = request({
        url,
        ...rest,
        success: resolve,
        fail: reject
      });
      resolvePromise == null ? void 0 : resolvePromise(instance);
    });
  };
}

function create(request, instanceOpt) {
  return PreQuest.create(adapter(request), instanceOpt);
}

export {
  create,
  PreQuest
};
//# sourceMappingURL=miniprogram.esm.js.map
