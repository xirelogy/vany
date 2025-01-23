import VanyRenderRequest from '../../setup/VanyRenderRequest';
import VanyInputFrameRenderService from '../services/VanyInputFrameRenderService';


/**
 * Render request for VanyInputGroup
 */
export default interface VanyInputGroupRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'input-group';
  /**
   * Rendering service
   */
  _render: VanyInputFrameRenderService;
}