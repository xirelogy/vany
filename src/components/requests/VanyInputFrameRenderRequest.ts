import VanyRenderRequest from '../../setup/VanyRenderRequest';
import VanyInputFrameRenderService from '../services/VanyInputFrameRenderService';


/**
 * Render request for VanyInputFrame
 */
export default interface VanyInputFrameRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'input-frame';
  /**
   * If disabled
   */
  disabled: boolean;
  /**
   * Rendering service
   */
  _render: VanyInputFrameRenderService;
}
