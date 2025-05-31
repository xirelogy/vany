import VanyRenderRequest from '../../setup/VanyRenderRequest';
import VanyCloseRenderService from '../services/VanyCloseRenderService';


/**
 * Render request for VanyClose
 */
export default interface VanyCloseRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'close';
  /**
   * Rendering service
   */
  _render: VanyCloseRenderService;
}
