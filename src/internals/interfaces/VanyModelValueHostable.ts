import {
  XwReleasable,
} from '@xirelogy/xwts';

import { VanyModelValue } from '../../components/supports/VanyModelValue';


/**
 * Hosting interface for VanyModelValue
 */
export interface VanyModelValueHostable<T> {
  /**
   * Current value
   */
  get currentValue(): T;

  /**
   * Hook on to vue's onMounted accept value for Vany actuators
   * @param modelValue Model value in component properties
   */
  notifyMounted(modelValue: T): void;

  /**
   * Hook on to vue's modelValue watch for Vany actuators
   * @param modelValue Model value watched
   */
  notifyWatch(modelValue: T): void;

  /**
   * Subscribe to model value update
   * @param fn Receiver function
   * @returns Subscription handle
   */
  subscribeModelValueUpdated(fn: (value: T) => void): XwReleasable|null;

  /**
   * Export representation instance for Vany actuators
   * @returns The exported interface
   */
  export(): VanyModelValue<T>;
}