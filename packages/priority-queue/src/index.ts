import { MiddlewareCallback } from '@prequest/types'

export interface PriorityQueueOpt<T> {
  getWeight?(opt: T): number // 获取当前请求权重
  threshold?: number // 并发请求阈值
  maxWaitingTime?: number // 最长等待时间
}

function getDefaultOptions<T>(): Required<PriorityQueueOpt<T>> {
  return {
    getWeight: () => 1,
    threshold: 5,
    maxWaitingTime: 5000,
  }
}

export default function priorityQueueMiddleware<T, N>(
  opt?: PriorityQueueOpt<T>
): MiddlewareCallback<T, N> {
  const { getWeight, threshold, maxWaitingTime } = Object.assign({}, getDefaultOptions<T>(), opt)

  // 请求中的队列
  const pendingQueue = []

  // 等待队列
  // key 为权重，value 为权重下的任务队列
  const waitQueueMap = new Map<number, (() => Promise<any>)[]>()

  return async function(ctx, next) {
    // 获取当前请求权重
    const weight = getWeight(ctx.request)

    // 当前任务队列已满，存入等待队列
    if (pendingQueue.length > threshold) {
      const queue = waitQueueMap.get(weight) || []
      queue.push(next)
      waitQueueMap.set(weight, queue)
    }
  }
}
