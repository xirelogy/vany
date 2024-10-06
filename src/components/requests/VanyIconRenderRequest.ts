import VanyRenderRequest from '../../setup/VanyRenderRequest';

import { VanyIconColorType } from '../../types/VanyIconColorType';


/**
 * Render request for VanyIcon
 */
export default interface VanyIconRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'icon';
  /**
   * Specific color type style (overrides 'color')
   */
  colorType: VanyIconColorType|null;
  /**
   * Specific color style
   */
  color: string|null;
  /**
   * Icon size
   */
  size: number|null;
}
