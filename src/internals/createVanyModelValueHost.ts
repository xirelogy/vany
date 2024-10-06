import {
  XwEventBroker,
  XwReleasable,
} from '@xirelogy/xwts';

import { VanyModelValueHostable } from './interfaces/VanyModelValueHostable';
import { VanyModelValue } from '../components/supports/VanyModelValue';
import { VanyValueForwardFunction } from '../types/VanyValueForwardFunction';


/**
 * Options to createVanyModelValueHost
 */
interface CreateVanyModelValueHostOptions<T> {
  /**
   * The current value
   */
  currentValue: T;
  /**
   * Handler function when value updated from UI
   */
  onUpdateValueFn: VanyValueForwardFunction<T>;
}


/**
 * Create a host for VanyModelValue
 * @param options Function options
 * @returns Created host
 */
export default function createVanyModelValueHost<T>(
  options: CreateVanyModelValueHostOptions<T>,
): VanyModelValueHostable<T> {

  // Cache of current value
  let _currentValue = options.currentValue;

  // Create and initialize event broker
  const _broker = new XwEventBroker<T>();
  _broker.expose().subscribe((value: T) => {
    _currentValue = value;
    options.onUpdateValueFn(value);
  });

  // Forwarder function for get value (from data layer to UI display)
  let _onForwardSetValueFn: VanyValueForwardFunction<T> = () => {};

  return {
    /**
     * @inheritdoc
     */
    get currentValue(): T {
      return _currentValue;
    },

    /**
     * @inheritdoc
     */
    notifyMounted(modelValue: T): void {
      _currentValue = modelValue;
      _onForwardSetValueFn(modelValue);
    },

    /**
     * @inheritdoc
     */
    notifyWatch(modelValue: T): void {
      _currentValue = modelValue;
      _onForwardSetValueFn(modelValue);
    },

    /**
     * @inheritdoc
     */
    subscribeModelValueUpdated(fn: (value: T) => void): XwReleasable|null {
      return _broker.expose().subscribe(fn);
    },

    /**
     * @inheritdoc
     */
    export(): VanyModelValue<T> {
      return {
        /**
         * @inheritdoc
         */
        onWatch(fn: (value: T) => void): void {
          _onForwardSetValueFn = fn;
        },

        /**
         * @inheritdoc
         */
        notifyUpdate(value: T): void {
          _broker.publish(value);
        },
      };
    },
  };
}