import { ref, watch, type Ref, type WatchOptions } from 'vue';
export interface DebounceOptions {
 wait?: number;
 leading?: boolean;
 trailing?: boolean;
}
export function useDebounce<T>(value: Ref<T>, options?: DebounceOptions): Ref<T> {
 const { wait = 300, leading = false, trailing = true } = options || {};
 const debouncedValue = ref<T>(value.value) as Ref<T>;
 let timer: ReturnType<typeof setTimeout> | null = null;
 let leadingValue: T | null = null;
 const debounceFn = (newValue: T) => {
 if (timer) {
 clearTimeout(timer);
 timer = null;
 }
 if (leading && !timer) {
 debouncedValue.value = newValue;
 leadingValue = newValue;
 }
 timer = setTimeout(() => {
 if (trailing && (!leading || leadingValue !== newValue)) {
 debouncedValue.value = newValue;
 }
 timer = null;
 leadingValue = null;
 }, wait);
 };
 watch(value, (newValue) => {
 debounceFn(newValue);
 }, { immediate: true } as WatchOptions);
 return debouncedValue;
}
export function useDebounceFn<T extends (...args: any[]) => any>(fn: T, wait = 300) {
 let timer: ReturnType<typeof setTimeout> | null = null;
 const debouncedFn = (...args: Parameters<T>) => {
 if (timer) {
 clearTimeout(timer);
 }
 timer = setTimeout(() => {
 fn(...args);
 timer = null;
 }, wait);
 };
 const cancel = () => {
 if (timer) {
 clearTimeout(timer);
 timer = null;
 }
 };
 const flush = (...args: Parameters<T>) => {
 cancel();
 fn(...args);
 };
 return {
 run: debouncedFn,
 cancel,
 flush
 };
}

