import {
  xw,
  XwReleasableCollection,
} from '@xirelogy/xwts';

import {
  nextTick,
} from 'vue';

import VanyServiceNegotiable from './VanyServiceNegotiable';
import { KEY as VanyDialogRemoteServiceKey, VanyDialogRemoteService } from '../internals/services/VanyDialogRemoteService';

import vanyI18nInit from '../internals/locale-setup';
const _l = vanyI18nInit('VanyDialogRunner');


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
 * VanyDialog's runner
 */
export default class VanyDialogRunner<T> {
  /**
   * Service interface
   */
  private _service: VanyDialogRemoteService|null = null;
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
      this._service = getNegotiatorFn()?.negotiate<VanyDialogRemoteService>(VanyDialogRemoteServiceKey) ?? null;
      if (this._service === null) {
        console.warn('Cannot access to service in VanyDialogRunner');
        return;
      }

      this._service.subscribeModelValueUpdated((isShowDialog: boolean) => {
        if (isShowDialog) return;

        // Send the default return value from closed dialog
        nextTick(() => {
          this._completeDismissClosure(this._defaultReturn);
        });
      })
    });
  }


  /**
   * If the dialog runnable
   */
  public get isRunnable(): boolean {
    if (this._service === null) return false;

    if (this._service.currentModelValue) return false; // May not show dialog again
    if (this._closure !== null) return false; // Prevent conflict host
    return true;
  }


  /**
   * Host the dialog
   * @param options
   * @returns
   */
  public async host(options?: HostOptions): Promise<T> {
    const resources = new XwReleasableCollection();
    return new Promise((resolve, reject) => {
      if (!this.isRunnable) {
        resources.release();
        reject(new Error(xw.normalizeString(_l('Dialog already running'))));
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

      // Associate closure and show dialog
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
   * Dismiss the dialog
   * @param ret Return value to be returned
   */
  public dismiss(ret?: T): void {
    this._service?.setShowModelValue(false); // Force closing
    const _ret = typeof ret !== 'undefined' ? ret : this._defaultReturn;
    this._completeDismissClosure(_ret);
  }
}