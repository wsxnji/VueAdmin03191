import { ref, watch, type Ref, type WatchOptions } from 'vue';

export interface ThrottleOptions {
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
}

export function useThrottle<T>(value: Ref<T>, options?: ThrottleOptions): Ref<T> {
  const { wait = 300, leading = true, trailing = true } = options || {};

  const throttledValue = ref<T>(value.value) as Ref<T>;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastValue: T = value.value;

  const throttleFn = (newValue: T) => {
    lastValue = newValue;

    if (!timer) {
      if (leading) {
        throttledValue.value = newValue;
      }

      timer = setTimeout(() => {
        if (trailing && lastValue !== throttledValue.value) {
          throttledValue.value = lastValue;
        }
        timer = null;
      }, wait);
    }
  };

  watch(value, (newValue) => {
    throttleFn(newValue);
  }, { immediate: true } as WatchOptions);

  return throttledValue;
}

export function useThrottleFn<T extends (...args: any[]) => any>(fn: T, wait = 300) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastExecTime = 0;

  const throttledFn = (...args: Parameters<T>) => {
    const currentTime = Date.now();
    const remainingTime = wait - (currentTime - lastExecTime);

    if (remainingTime <= 0 || remainingTime > wait) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastExecTime = currentTime;
      fn(...args);
    } else if (!timer) {
      timer = setTimeout(() => {
        lastExecTime = Date.now();
        timer = null;
        fn(...args);
      }, remainingTime);
    }
  };

  const cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return {
    run: throttledFn,
    cancel
  };
}
