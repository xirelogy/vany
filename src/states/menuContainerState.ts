import {
  inject,
} from 'vue';

import { VanyMenuContainerType } from '../types/VanyMenuContainerType';


/**
 * Injection key
 */
export const KEY = Symbol();


/**
 * State class
 */
export class MenuContainerState {
  /**
   * Associated type
   */
  type: VanyMenuContainerType;


  /**
   * @constructor
   * @param type
   */
  constructor(type: VanyMenuContainerType) {
    this.type = type;
  }
}


/**
 * Create a new menu container state
 * @param type
 * @returns
 */
export function createMenuContainerState(type: VanyMenuContainerType): MenuContainerState {
  return new MenuContainerState(type);
}


/**
 * Use menu container state's type
 * @returns
 */
export function useMenuContainerStateType(): VanyMenuContainerType|null {
  const injected = inject<MenuContainerState|null>(KEY, null);
  if (injected === null) return null;

  return injected.type;
}