import {
  Stringable,
} from '@xirelogy/xwts';

import VanyRenderRequest from '../../setup/VanyRenderRequest';
import VanyFormControlRenderService from '../services/VanyFormControlRenderService';
import VanySelectRenderService from '../services/VanySelectRenderService';


/**
 * Render request for VanySelect
 */
export default interface VanySelectRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'select';
  /**
   * Name attribute (if available)
   */
  name: string|null;
  /**
   * Placeholder
   */
  placeholder: Stringable|string|null;
  /**
   * If clearable
   */
  clearable: boolean;
  /**
   * If disabled
   */
  disabled: boolean;
  /**
   * Rendering service
   */
  _render: VanyFormControlRenderService<string|null>|null;
  /**
   * Rendering service (for managed select options)
   */
  _renderManaged: VanySelectRenderService|null;
}