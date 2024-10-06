import {
  _used,
} from '@xirelogy/xwts';

import VanySelectRenderService from '../components/services/VanySelectRenderService';
import {
  type VanySelectOptionSourceFunction,
  default as VanySelectOptionManageable,
} from '../features/VanySelectOptionManageable';
import { VanySelectRenderServiceHostable } from './interfaces/VanySelectRenderServiceHostable';


type AsyncLoaderFunction = (source: VanySelectOptionSourceFunction) => Promise<void>;
type SimpleFunction = () => void;


/**
 * Options to createVanySelectRenderServiceHost
 */
interface CreateVanySelectRenderServiceHostOptions {
  /**
   * Manager instance
   */
  manager: VanySelectOptionManageable;
}


/**
 * Create a host for VanySelectRenderService
 * @param options Function options
 * @return Created host
 */
export default function createVanySelectRenderServiceHost(
  options: CreateVanySelectRenderServiceHostOptions,
): VanySelectRenderServiceHostable {
  /**
   * Handle refresh options
   */
  let _onRefreshOptionsFn: AsyncLoaderFunction = async () => { };
  /**
   * Handle ensure select
   */
  let _onEnsureSelectFn: SimpleFunction = () => { };


  const _service: VanySelectRenderService = {
    /**
     * @inheritdoc
     */
    onRefreshOptions(fn: AsyncLoaderFunction) {
      _onRefreshOptionsFn = fn;
    },

    /**
     * @inheritdoc
     */
    onEnsureSelect(fn: SimpleFunction) {
      _onEnsureSelectFn = fn;
    },
  };

  return {
    /**
     * @inheritdoc
     */
    triggerRefreshOptions() {
      return _onRefreshOptionsFn(options.manager.source);
    },

    /**
     * @inheritdoc
     */
    triggerEnsureSelect() {
      _onEnsureSelectFn();
    },

    /**
     * @inheritdoc
     */
    export() {
      return _service;
    },
  };
}