import VanyRenderRequest from '../../setup/VanyRenderRequest';
import { type VanyMenuContainerType } from '../../types/VanyMenuContainerType';


/**
 * Render request for VanyMenuDivider
 */
export default interface VanyMenuDividerRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'menu-divider';
  /**
   * Associated container type
   */
  containerType: VanyMenuContainerType|null;
}
