import VanyRenderRequest from '../../setup/VanyRenderRequest';
import { type VanyDropdownMenuTriggerType } from '../../types/VanyDropdownMenuTriggerType';
import { type VanyDropdownMenuPlacementType } from '../../types/VanyDropdownMenuPlacementType';
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
   * The dropdown menu placement
   */
  placement: VanyDropdownMenuPlacementType;
  /**
   * Rendering service
   */
  _render: VanyDropdownMenuRenderService;
}
