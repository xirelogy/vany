import VanyRenderRequest from '../../setup/VanyRenderRequest';
import VanyFormControlRenderService from '../services/VanyFormControlRenderService';

/**
 * Render request for VanyTextAreaInput
 */
export default interface VanyTextAreaInputRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'text-area-input';
  /**
   * Name attribute (if available)
   */
  name: string|null;
  /**
   * If disabled
   */
  disabled: boolean;
  /**
   * Rows
   */
  rows: number|null;
  /**
   * Rendering service
   */
  _render: VanyFormControlRenderService<string|null>|null;
}