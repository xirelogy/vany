import {
  xw,
  XwReleasableCollection,
} from '@xirelogy/xwts';

import {
  nextTick,
} from 'vue';

import VanyServiceNegotiable from './VanyServiceNegotiable';
import {
  KEY as VanyModalRemoteServiceKey,
  VanyModalRemoteService,
} from '../internals/services/VanyModalRemoteService';

import vanyI18nInit from '../internals/locale-setup';
const _l = vanyI18nInit('VanyModalRunner');


type SimpleSyncFunction = () => void;
type SimpleAsyncFunction = () => Promise<void>;


/**
 * Hosting options
 */
interface HostOptions {
  /**
   * Execution before showing
   */
  onBeforeShow?: SimpleSyncFunction;
  /**
   * Start-up while showing
   */
  onStartShow?: SimpleSyncFunction|SimpleAsyncFunction;
  /**
   * Start-up while showing (with content available)
   */
  onStartShowContent?: SimpleSyncFunction|SimpleAsyncFunction;
  /**
   * Execution after shown
   */
  onAfterShown?: SimpleSyncFunction|SimpleAsyncFunction;
}


/**
 * Vany modal's runner
 */
export default class VanyModalRunner<T> {
  /**
   * Service interface
   */
  private _service: VanyModalRemoteService|null = null;
  /**
   * Default return value when dismissed without result
   */
  private _defaultReturn: T;
  /**
   * Closure to return from running
   */
  private _closure: ((ret: T) => void)|null = null;


  /**
   * @constructor
   * @param getNegotiatorFn Resolver for negotiator function
   * @param defaultReturn Default return value when dismissed without result
   */
  constructor(getNegotiatorFn: () => VanyServiceNegotiable|null|undefined, defaultReturn: T) {
    this._defaultReturn = defaultReturn;

    nextTick(() => {
      this._service = getNegotiatorFn()?.negotiate<VanyModalRemoteService>(VanyModalRemoteServiceKey) ?? null;
      if (this._service === null) {
        console.warn('Cannot access to service in VanyModalRunner');
        return;
      }

      this._service.subscribeModelValueUpdated((isShowModal: boolean) => {
        if (isShowModal) return;

        // Send the default return value from closed modal
        nextTick(() => {
          this._completeDismissClosure(this._defaultReturn);
        });
      })
    });
  }


  /**
   * If the modal runnable
   */
  public get isRunnable(): boolean {
    if (this._service === null) return false;

    if (this._service.currentModelValue) return false; // May not show modal again
    if (this._closure !== null) return false; // Prevent conflict host
    return true;
  }


  /**
   * Host the modal
   * @param options
   * @returns
   */
  public async host(options?: HostOptions): Promise<T> {
    const resources = new XwReleasableCollection();
    return new Promise((resolve, reject) => {
      if (!this._service) {
        reject(new Error(xw.normalizeString(_l('Missing service for VanyModalRunner'))));
        return;
      }

      if (!this.isRunnable) {
        resources.release();
        reject(new Error(xw.normalizeString(xw.format(_l('{0} already running'), this._service!.name))));
        return;
      }

      // Before showing
      if (options?.onBeforeShow) {
        options!.onBeforeShow!();
      }

      // Register showing / showing with content
      if (options?.onStartShow || options?.onStartShowContent) {
        if (this._service) {
          resources.safePush(this._service.subscribeModalEvent('show', async () => {
            if (options!.onStartShow) await xw.asAsyncFn(options!.onStartShow!);
            if (options!.onStartShowContent) nextTick(async () => {
              await xw.asAsyncFn(options!.onStartShowContent!);
            });
          }));
        } else {
          nextTick(async () => {
            if (options!.onStartShow) await xw.asAsyncFn(options!.onStartShow!);
            if (options!.onStartShowContent) nextTick(async () => {
              await xw.asAsyncFn(options!.onStartShowContent!);
            });
          });
        }
      }

      // Register after showing
      if (options?.onAfterShown) {
        if (this._service) {
          resources.safePush(this._service.subscribeModalEvent('shown', async () => {
            await xw.asAsyncFn(options!.onAfterShown!);
          }));
        } else {
          nextTick(async () => {
            nextTick(async () => {
              await xw.sleep(100); // Special sleep to mimic incomplete shown
              await xw.asAsyncFn(options!.onAfterShown!);
            });
          });
        }
      }

      // Associate closure and show modal
      this._closure = (ret: T) => {
        resources.release();
        resolve(ret);
      };

      this._service?.setShowModelValue(true);
    });
  }


  /**
   * Complete the dismiss closure
   * @param ret
   */
  private _completeDismissClosure(ret: T): void {
    const closure = this._closure;
    this._closure = null;
    if (closure !== null) closure(ret);
  }


  /**
   * Dismiss the modal
   * @param ret Return value to be returned
   */
  public dismiss(ret?: T): void {
    this._service?.setShowModelValue(false); // Force closing
    const _ret = typeof ret !== 'undefined' ? ret : this._defaultReturn;
    this._completeDismissClosure(_ret);
  }
}