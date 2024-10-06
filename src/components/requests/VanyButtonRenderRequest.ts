import VanyRenderRequest from '../../setup/VanyRenderRequest';
import type { VanyButtonType } from '../../types/VanyButtonType';


/**
 * Render request for VanyButton
 */
export default interface VanyButtonRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'button';
  /**
   * Button type
   */
  type?: VanyButtonType;
  /**
   * If light
   */
  light: boolean;
  /**
   * If disabled
   */
  disabled: boolean;
  /**
   * If loading
   */
  loading: boolean;
}