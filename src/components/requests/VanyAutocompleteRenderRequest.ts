import VanyRenderRequest from '../../setup/VanyRenderRequest';

import { type VanyForwardHandler } from '../../types/VanyForwardHandler';
import { type VanyAutocompleteFilterFunction } from '../../types/VanyAutocompleteFilterFunction';

/**
 * Notification of item selected
 */
type NotifySelectedFunction = (value: any|null, isSelected: boolean) => void;


/**
 * Render request for VanyAutocomplete
 */
export default interface VanyAutocompleteRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'autocomplete';
  /**
   * Filter function
   */
  filter: VanyAutocompleteFilterFunction;
  /**
   * Selection notification function
   */
  notifySelected: NotifySelectedFunction;
  /**
   * Forwarder for notifyKeyword()
   */
  fwdNotifyKeyword: VanyForwardHandler<string, void>;
  /**
   * Debounce timer
   */
  debounceMs: number;
  /**
   * Maximum height before scroll
   */
  scrollHeight?: number|string;
}
