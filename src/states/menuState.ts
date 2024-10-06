import {
  inject,
} from 'vue';

import VanyMenuRenderService from '../components/services/VanyMenuRenderService';


/**
 * Injection key
 */
export const KEY = Symbol();


/**
 * State class
 */
export class MenuState {
  /**
   * Render service
   */
  renderService: VanyMenuRenderService|null;


  /**
   * @constructor
   * @param renderService
   */
  constructor(renderService: VanyMenuRenderService|null) {
    this.renderService = renderService;
  }
}


/**
 * Create a new form state
 * @param renderService
 * @returns
 */
export function createMenuState(renderService: VanyMenuRenderService|null): MenuState {
  return new MenuState(renderService);
}


/**
 * Use menu state's rendering service
 * @returns
 */
export function useMenuStateRenderService(): VanyMenuRenderService|null {
  const injected = inject<MenuState|null>(KEY, null);
  if (injected === null) return null;

  return injected.renderService;
}