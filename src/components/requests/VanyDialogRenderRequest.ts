import VanyRenderRequest from '../../setup/VanyRenderRequest';
import VanyDialogRenderService from '../services/VanyDialogRenderService';


/**
 * Render request for VanyDialog
 */
export default interface VanyDialogRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'dialog';
  /**
   * Model value
   */
  modelValue: boolean|null;
  /**
   * Rendering service
   */
  _render: VanyDialogRenderService|null;
}