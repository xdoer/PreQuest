import { merge } from './utils';

class Middleware {
  constructor() {
    this.cbs = [];
  }

  exec(ctx, next, injectOpt = {}) {
    let times = -1;
    const cbs = [...Middleware.globalCbs, ...this.cbs];

    const dispatch = (pointer = 0) => {
      if (cbs.length < pointer) return Promise.resolve();
      const fn = cbs[pointer] || next;
      if (pointer <= times) throw new Error('next function only can be called once');
      times = pointer;
      return fn(ctx, () => dispatch(++pointer), injectOpt);
    };

    return dispatch();
  }

  use(cb) {
    this.cbs.push(cb);
    return this;
  }

  static use(cb) {
    Middleware.globalCbs.push(cb);
    return Middleware;
  }

}
Middleware.globalCbs = [];

const METHODS = ['get', 'post', 'delete', 'put', 'patch', 'head', 'options'];

class PreQuest extends Middleware {
  constructor(adapter, config) {
    super();
    this.adapter = adapter;
    this.config = config;
    this.mount();
  }

  mount() {
    const preQuest = this;
    METHODS.forEach(method => {
      preQuest[method] = (path, config) => {
        const request = merge(PreQuest.defaults, this.config, {
          path,
          method
        }, config);
        const response = {};
        return this.controller({
          request,
          response,
          context: this
        });
      };
    });
  }

  request(path, config) {
    const request = merge(PreQuest.defaults, this.config, typeof path === 'string' ? {
      path,
      ...config
    } : path);
    const response = {};
    return this.controller({
      request,
      response,
      context: this
    });
  }

  async controller(ctx, opt = {}) {
    await this.exec(ctx, async ctx => {
      ctx.response = await this.adapter(ctx.request);
    }, opt);
    return ctx.response;
  }

  static create(adapter, config) {
    const instance = new PreQuest(adapter, config);
    return new Proxy(adapter, {
      get(_, name) {
        return Reflect.get(instance, name) || Reflect.get(adapter, name);
      },

      apply(_, __, args) {
        return Reflect.apply(instance.request, instance, args);
      }

    });
  }

}
PreQuest.defaults = {};

export { PreQuest };
//# sourceMappingURL=core.esm.js.map
