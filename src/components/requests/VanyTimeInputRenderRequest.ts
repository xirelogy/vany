import VanyRenderRequest from '../../setup/VanyRenderRequest';
import VanyFormControlRenderService from '../services/VanyFormControlRenderService';
import { VanyStableTimeValue } from '../../types/VanyStableTimeValue';


/**
 * Render request for VanyTimeInput
 */
export default interface VanyTimeInputRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'time-input';
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
  _render: VanyFormControlRenderService<VanyStableTimeValue|null>|null;
}