import {
  Stringable,
} from '@xirelogy/xwts';

import VanyRenderRequest from '../../setup/VanyRenderRequest';
import VanyFormItemRenderService from '../services/VanyFormItemRenderService';


/**
 * Render request for VanyFormItem
 */
export default interface VanyFormItemRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'form-item';
  /**
   * Associated label (alternative shorthand in absence of slot)
   */
  label?: Stringable|string;
  /**
   * Associated subject label (to be used for messages, fallback to label / label slot in absense)
   */
  subjectLabel?: Stringable|string;
  /**
   * If required
   */
  required: boolean;
  /**
   * Rendering service
   */
  _render: VanyFormItemRenderService|null;
}