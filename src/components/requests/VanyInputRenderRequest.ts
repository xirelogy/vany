import {
  Stringable,
} from '@xirelogy/xwts';

import VanyRenderRequest from '../../setup/VanyRenderRequest';
import VanyFormControlRenderService from '../services/VanyFormControlRenderService';

/**
 * Render request for VanyInput
 */
export default interface VanyInputRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'input';
  /**
   * Name attribute (if available)
   */
  name: string|null;
  /**
    * Placeholder
    */
  placeholder: Stringable|string|null;
  /**
   * If current input shall be masked (for password)
   */
  password: boolean;
  /**
   * If disabled
   */
  disabled: boolean;
  /**
   * Rendering service
   */
  _render: VanyFormControlRenderService<string|null>|null;
}