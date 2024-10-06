import VanyRenderRequest from '../../setup/VanyRenderRequest';
import { VanyTagType } from '../../types/VanyTagType';
import VanyTagRenderService from '../services/VanyTagRenderService';


/**
 * Render request for VanyTag
 */
export default interface VanyTagRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'tag';
  /**
   * Tag type
   */
  type: VanyTagType;
  /**
   * If light
   */
  light: boolean;
  /**
   * If close button available
   */
  closable: boolean;
  /**
   * Rendering service
   */
  _render: VanyTagRenderService;
}
