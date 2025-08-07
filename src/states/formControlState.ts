import {
  inject,
} from 'vue';

import VanyRegisteredFormItemRenderService from '../components/services/VanyRegisteredFormItemRenderService';


/**
 * Injection key
 */
export const KEY = Symbol();


/**
 * State class
 */
export class FormControlState {
  /**
   * Associated handle
   */
  renderService: VanyRegisteredFormItemRenderService|null;


  /**
   * @constructor
   * @param renderService
   */
  constructor(renderService: VanyRegisteredFormItemRenderService|null) {
    this.renderService = renderService;
  }
}


/**
 * Create a form item state
 * @param handle
 * @returns
 */
export function createFormControlState(handle: VanyRegisteredFormItemRenderService|null): FormControlState {
  return new FormControlState(handle);
}


/**
 * Use form item state's render service
 * @returns
 */
export function useFormControlStateRenderService(): VanyRegisteredFormItemRenderService|null {
  const injected = inject<FormControlState|null>(KEY, null);
  if (injected === null) return null;

  return injected.renderService;
}