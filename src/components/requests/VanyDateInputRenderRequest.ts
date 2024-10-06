import VanyRenderRequest from '../../setup/VanyRenderRequest';
import VanyFormControlRenderService from '../services/VanyFormControlRenderService';
import { VanyStableDateValue } from '../../types/VanyStableDateValue';


/**
 * Render request for VanyDateInput
 */
export default interface VanyDateInputRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'date-input';
  /**
   * Name attribute (if available)
   */
  name: string|null;
  /**
   * If disabled
   */
  disabled: boolean;
  /**
   * Rendering service
   */
  _render: VanyFormControlRenderService<VanyStableDateValue|null>|null;
}