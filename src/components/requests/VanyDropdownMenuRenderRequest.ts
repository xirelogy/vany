import VanyRenderRequest from '../../setup/VanyRenderRequest';
import { type VanyDropdownMenuTriggerType } from '../../types/VanyDropdownMenuTriggerType';
import VanyDropdownMenuRenderService from '../services/VanyDropdownMenuRenderService';


/**
 * Render request for VanyDropdownMenu
 */
export default interface VanyDropdownMenuRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'dropdown-menu';
  /**
   * How the dropdown menu is triggered
   */
  trigger: VanyDropdownMenuTriggerType;
  /**
   * Rendering service
   */
  _render: VanyDropdownMenuRenderService;
}
