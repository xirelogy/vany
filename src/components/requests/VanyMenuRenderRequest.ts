import VanyRenderRequest from '../../setup/VanyRenderRequest';

import { type VanyMenuTemplateType } from '../../types/VanyMenuTemplateType';
import VanyMenuRenderService from '../services/VanyMenuRenderService';


/**
 * Render request for VanyMenu
 */
export default interface VanyMenuRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'menu';
  /**
   * Menu template type
   */
  template: VanyMenuTemplateType;
  /**
   * If menu is shown compact
   */
  compact: boolean;
  /**
   * Rendering service
   */
  _render: VanyMenuRenderService;
}