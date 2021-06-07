import { PreQuestInstance } from '@prequest/core';
import {
  setTimeoutInterval,
  clearTimeoutInterval,
} from '@xdoer/timeout-interval';
import { useEffect, useRef, useState } from 'react';
import { Res, Config } from './types';
import { parseOptions, defaultUpdate } from './utils';

export class RequestHook<T, N> {
  constructor(private prequest: PreQuestInstance<T, N>) {}

  useRequest<Q>(opt: T | (() => T), config?: Config<Q>) {
    const ctx = this;
    const [res, setRes] = useState<Res<Q>>({
      data: null,
      error: null,
      loading: false,
    });
    const loadingRef = useRef(false);
    const calledRef = useRef(false);
    const variables = useRef<T | null>(null);
    const { lazy, loop, onUpdate = defaultUpdate } = config || {};
    const timer = useRef<any>(null);

    // 首次发请求调用
    useEffect(() => {
      if (calledRef.current) return;

      // lazy 状态，虽然不马上请求，但要保存参数
      const options = parseOptions(opt, variables.current);
      if (!options) return;
      variables.current = options;

      if (lazy) return;

      if (!loop) {
        fetchData(options);
        return;
      }

      // 这里 options 参数在循环请求接口的过程中是不变的，避免其他 hook 变更引起参数变化
      timer.current = setTimeoutInterval(() => {
        fetchData(options);
      }, loop);
    }, [opt, lazy, loop]);

    useEffect(() => {
      return () => {
        clearTimeoutInterval(timer.current);
      };
    }, []);

    // 获取数据
    async function fetchData(opt: T) {
      loadingRef.current = true;
      try {
        calledRef.current = true;
        setRes(prev => ({ ...prev, loading: true }));
        const res = await ctx.prequest(opt);
        setRes(prev => {
          const { data } = prev;
          return {
            loading: false,
            data: onUpdate(data!, res as any),
            error: null,
          };
        });
      } catch (e) {
        setRes({ loading: false, error: e, data: null });
      }
      loadingRef.current = false;
    }

    // 刷新数据
    async function request(opt: T | ((v: T) => T)) {
      const options = parseOptions(opt, variables.current);
      // request 场景是在事件触发中，所以 options 参数应当是一定有的
      variables.current = options!;
      fetchData(options!);
    }

    // 清除循环
    function clearLoop() {
      clearTimeoutInterval(timer.current);
    }

    return {
      loadingRef,
      request,
      clearLoop,
      ...res,
    };
  }
}
