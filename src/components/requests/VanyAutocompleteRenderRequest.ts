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
   * Forwarder for notifyControlKeyDown()
   */
  fwdNotifyControlKeyDown: VanyForwardHandler<KeyboardEvent, void>;
  /**
   * Forwarder for notifyControlKeyUp()
   */
  fwdNotifyControlKeyUp: VanyForwardHandler<KeyboardEvent, void>;
  /**
   * Forwarder for notifyControlBlur()
   */
  fwdNotifyControlBlur: VanyForwardHandler<void, void>;
  /**
   * Debounce timer
   */
  debounceMs: number;
  /**
   * If to automatically select first item when candidate available
   */
  autoSelect: boolean;
  /**
   * Maximum height before scroll
   */
  scrollHeight?: number|string;
}
