import VanyRenderRequest from '../../setup/VanyRenderRequest';
import VanyFormControlRenderService from '../services/VanyFormControlRenderService';

import {
  type VanyRadioValue,
} from '../../types/VanyRadioValue';


/**
 * Render request for VanyRadioGroup
 */
export default interface VanyRadioGroupRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'radio-group';
  /**
   * Name attribute
   */
  name: string|null;
  /**
   * If items are rendered inline
   */
  inline: boolean;
  /**
   * If disabled
   */
  disabled: boolean;
  /**
   * Rendering service
   */
  _render: VanyFormControlRenderService<VanyRadioValue|null>|null;
}