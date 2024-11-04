import {
  Stringable,
  XwReleasable,
} from '@xirelogy/xwts';

import VanyServiceable from '../../features/VanyServiceable';
import { VanyModalEvent } from '../../types/VanyModalEvent';

/**
 * Internal key
 */
export const KEY = Symbol();


/**
 * Remote service interface for modal iteractions
 */
export interface VanyModalRemoteService extends VanyServiceable {
  /**
   * Current specific service class
   */
  vanyServiceClass: 'VanyModalRemoteService';

  /**
   * Current name
   */
  get name(): string|Stringable;

  /**
   * Current model value
   */
  get currentModelValue(): boolean;

  /**
   * Set if the dialog is shown/hidden
   * @param value If shown/hidden
   */
  setShowModelValue(value: boolean): void;

  /**
   * Subscribe to model value updates
   * @param fn Receiver function
   * @returns Subscription handle
   */
  subscribeModelValueUpdated(fn: (value: boolean) => void): XwReleasable|null;

  /**
   * Subscribe to modal events
   * @param eventType Event to subscribe to
   * @param fn Receiver function
   * @returns Subscription handle
   */
  subscribeModalEvent(eventType: VanyModalEvent, fn: () => void): XwReleasable|null;
}