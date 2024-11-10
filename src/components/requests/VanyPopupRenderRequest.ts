import VanyRenderRequest from '../../setup/VanyRenderRequest';
import { type VanyPopupTriggerType } from '../../types/VanyPopupTriggerType';
import { type VanyPopupPlacementType } from '../../types/VanyPopupPlacementType';
import { type default as VanyPopupRenderService } from '../services/VanyPopupRenderService';


/**
 * Render request for VanyPopup
 */
export default interface VanyPopupRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'popup';
  /**
   * How the popup is triggered
   */
  trigger: VanyPopupTriggerType;
  /**
   * Popup placement
   */
  placement: VanyPopupPlacementType;
  /**
   * Popup width
   */
  width: number|string;
  /**
   * Class to be assigned to the popup
   */
  popupClass: string|undefined;
  /**
   * Rendering service
   */
  _render: VanyPopupRenderService|null;
}
