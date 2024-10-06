import VanyRenderRequest from '../../setup/VanyRenderRequest';

import {
  type VanyRadioValue,
} from '../../types/VanyRadioValue';


/**
 * Render request for VanyRadio
 */
export default interface VanyRadioRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'radio';
  /**
   * Associated value (when selected)
   */
  value: VanyRadioValue;
  /**
   * If disabled
   */
  disabled: boolean;
}