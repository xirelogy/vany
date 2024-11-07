import VanyRenderRequest from '../../setup/VanyRenderRequest';

import { VanyCheckValueType } from '../../types/VanyCheckValueType';
import VanyFormControlRenderService from '../services/VanyFormControlRenderService';


/**
 * Render request for VanyCheck
 */
export default interface VanyCheckRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'check';
  /**
   * If disabled
   */
  disabled: boolean;
  /**
   * Rendering service
   */
  _render: VanyFormControlRenderService<VanyCheckValueType|null>|null;
}