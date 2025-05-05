import { useVanyBusyQueue } from './useVanyBusyQueue';

import {
  computed,
  ref,
} from 'vue';

import {
  ComputedRef as MinComputedRef,
} from '@xirelogy/vue-minimal';


/**
 * Create a reactive cache
 * @param refreshFn The refresh function
 * @param defaultValue Default value to populate cache
 */
export function useVanyCache<T>(refreshFn: () => Promise<T>, defaultValue: T) {
  const busyQueue = useVanyBusyQueue();
  const cache = ref(defaultValue);

  let isLoaded = false;

  return {
    /**
     * Target cache
     */
    cache: computed(() => {
      return cache.value;
    }) as MinComputedRef<T>,

    /**
     * Wait until cache is available
     * @returns Cached item
     */
    async wait(): Promise<T> {
      if (!isLoaded) {
        await busyQueue.queue(async () => {
          if (isLoaded) return;
          cache.value = await refreshFn();
          isLoaded = true;
        });
      }

      return cache.value;
    },

    /**
     * Forcefully refresh cache
     * @returns Cached item
     */
    async refresh(): Promise<T> {
      await busyQueue.queue(async () => {
        cache.value = await refreshFn();
        isLoaded = true;
      });

      return cache.value;
    },
  };
}