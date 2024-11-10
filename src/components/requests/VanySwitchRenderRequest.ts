import VanyRenderRequest from '../../setup/VanyRenderRequest';
import VanyFormControlRenderService from '../services/VanyFormControlRenderService';


/**
 * Render request for VanySwitch
 */
export default interface VanySwitchRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'switch';
  /**
   * If disabled
   */
  disabled: boolean;
  /**
   * Rendering service
   */
  _render: VanyFormControlRenderService<boolean|null>|null;
}