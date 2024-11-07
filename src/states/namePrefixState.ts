import {
  inject,
} from 'vue';


/**
 * Injection key
 */
export const KEY = Symbol();


/**
 * State class
 */
export class NamePrefixState {
  /**
   * Prefixed name
   */
  name: string;


  /**
   * @constructor
   * @param name
   */
  constructor(name: string) {
    this.name = name;
  }
}


/**
 * Create a new name prefix state
 * @param name
 * @returns
 */
export function createNamePrefixState(name?: string): NamePrefixState {
  return new NamePrefixState(name ?? '');
}


/**
 * Use the registered name prefix
 * @returns
 */
export function useNamePrefixState(): string {
  const injected = inject<NamePrefixState|null>(KEY, null);
  if (injected === null) return '';

  return injected.name;
}
