import VanyRenderRequest from '../../setup/VanyRenderRequest';
import { VanyListMoreFunction } from '../../types/VanyListMoreFunction';


/**
 * Render request for VanyList
 */
export default interface VanyListRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'list';
  /**
   * List more function
   */
  listMore: VanyListMoreFunction|null;
}