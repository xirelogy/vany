import {
  ref,
} from 'vue';

import {
  PrimitiveType,
  useVanySnapshotEqual,
} from './useVanySnapshotEqual';


/**
 * Function signature
 */
type SnapshotFunction<T> = (value: T) => PrimitiveType;


/**
 * Service interface
 */
interface VanySnapshotChangedService<T> {
  /**
   * Detect if value changed
   * @param value
   */
  isChanged(value: T|undefined): boolean;
}


/**
 * Create a monitor for value changed
 * @param fn
 * @returns
 */
export function useVanySnapshotChanged<T>(fn: SnapshotFunction<T>): VanySnapshotChangedService<T> {

  const lastSnapshot = ref<PrimitiveType>();

  return {
    /**
     * @inheritdoc
     */
    isChanged(value: T|undefined): boolean {
      const thisSnapshot = value ? fn(value) : undefined;
      const isEqual = useVanySnapshotEqual(lastSnapshot.value, thisSnapshot);

      lastSnapshot.value = thisSnapshot;
      return !isEqual;
    },
  };
}