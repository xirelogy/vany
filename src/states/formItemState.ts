import {
  inject,
} from 'vue';

import VanyFormItemRenderService from '../components/services/VanyFormItemRenderService';


/**
 * Injection key
 */
export const KEY = Symbol();


/**
 * State class
 */
export class FormItemState {
  /**
   * Associated handle
   */
  renderService: VanyFormItemRenderService|null;


  /**
   * @constructor
   * @param renderService
   */
  constructor(renderService: VanyFormItemRenderService|null) {
    this.renderService = renderService;
  }
}


/**
 * Create a form item state
 * @param handle
 * @returns
 */
export function createFormItemState(handle: VanyFormItemRenderService|null): FormItemState {
  return new FormItemState(handle);
}



/**
 * Use form item state's render service
 * @returns
 */
export function useFormItemStateRenderService(): VanyFormItemRenderService|null {
  const injected = inject<FormItemState|null>(KEY, null);
  if (injected === null) return null;

  return injected.renderService;
}