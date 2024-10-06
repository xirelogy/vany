import {
  useInlineState,
} from '../../states/inlineState';


/**
 * Access to current inline state
 */
export class VanyInlineState {
  /**
   * If currently inline
   * @param defaultIsInline
   * @returns
   */
  static isInline(defaultIsInline?: boolean): boolean {
    return useInlineState(defaultIsInline ?? false);
  }
}