import VanyRenderRequest from '../../setup/VanyRenderRequest';
import VanyDrawerRenderService from '../services/VanyDrawerRenderService';

import { type VanyDrawerDockType } from '../../types/VanyDrawerDockType';


/**
 * Render request for VanyDrawer
 */
export default interface VanyDrawerRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'drawer';
  /**
   * Model value
   */
  modelValue: boolean|null;
  /**
   * If close button shown
   */
  closeButton: boolean,
  /**
   * If clicking outside closes the drawer
   */
  closeOutside: boolean,
  /**
   * If escape key closes the drawer
   */
  closeEscape: boolean,
  /**
   * If drawer shown with modal
   */
  modal: boolean,
  /**
   * Dock type
   */
  dock: VanyDrawerDockType,
  /**
   * Style specification of the drawer size
   */
  size?: number|string;
  /**
   * Rendering service
   */
  _render: VanyDrawerRenderService|null;
}
