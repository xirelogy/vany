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
export class InlineState {
  /**
   * If contained items shall be inlined
   */
  isInline: boolean;


  /**
   * @constructor
   * @param isInline
   */
  constructor(isInline: boolean) {
    this.isInline = isInline;
  }
}


/**
 * Create a new inline state
 * @param isInline
 * @returns
 */
export function createInlineState(isInline: boolean): InlineState {
  return new InlineState(isInline);
}


/**
 * Use current inline state
 * @param defaultIsInline
 * @returns
 */
export function useInlineState(defaultIsInline: boolean): boolean {
  const injected = inject<InlineState|null>(KEY, null);
  if (injected === null) return defaultIsInline;

  return injected.isInline;
}