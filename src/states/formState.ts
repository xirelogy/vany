import {
  inject,
} from 'vue';

import VanyFormRenderService from '../components/services/VanyFormRenderService';


/**
 * Injection key
 */
export const KEY = Symbol();


/**
 * State class
 */
export class FormState {
  /**
   * Render service
   */
  renderService: VanyFormRenderService|null;


  /**
   * @constructor
   * @param renderService
   */
  constructor(renderService: VanyFormRenderService|null) {
    this.renderService = renderService;
  }
}


/**
 * Create a new form state
 * @param renderService
 * @returns
 */
export function createFormState(renderService: VanyFormRenderService|null): FormState {
  return new FormState(renderService);
}


/**
 * Use form state's rendering service
 * @returns
 */
export function useFormStateRenderService(): VanyFormRenderService|null {
  const injected = inject<FormState|null>(KEY, null);
  if (injected === null) return null;

  return injected.renderService;
}