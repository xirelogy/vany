import {
  useNamePrefixState,
} from '../../states/namePrefixState';


/**
 * Access to current name prefix state
 */
export class VanyNamePrefixState {
  /**
   * Current name prefix
   * @returns
   */
  static get name(): string {
    return useNamePrefixState();
  }
}