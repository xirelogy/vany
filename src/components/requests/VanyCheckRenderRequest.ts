import VanyRenderRequest from '../../setup/VanyRenderRequest';


/**
 * Render request for VanyCheck
 */
export default interface VanyCheckRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'check';
  /**
   * Model value
   */
  modelValue: boolean|'indeterminate'|null;
  /**
   * If disabled
   */
  disabled: boolean;
}