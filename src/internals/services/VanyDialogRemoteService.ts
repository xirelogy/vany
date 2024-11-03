import {
  XwReleasable,
} from '@xirelogy/xwts';

import VanyServiceable from '../../features/VanyServiceable';
import { VanyModalEvent } from '../../types/VanyModalEvent';

/**
 * Internal key
 */
export const KEY = Symbol();


/**
 * Remote service interface for VanyDialog
 */
export interface VanyDialogRemoteService extends VanyServiceable {
  /**
   * Current specific service class
   */
  vanyServiceClass: 'VanyDialogRemoteService';

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
   * Subscribe to dialog events
   * @param eventType Event to subscribe to
   * @param fn Receiver function
   * @returns Subscription handle
   */
  subscribeModalEvent(eventType: VanyModalEvent, fn: () => void): XwReleasable|null;
}