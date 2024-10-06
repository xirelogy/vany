import VanyRenderRequest from '../../setup/VanyRenderRequest';


/**
 * Render request for VanyOption
 */
export default interface VanyOptionRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'option';
  /**
   * Associated value
   */
  value: string;
  /**
   * If disabled
   */
  disabled: boolean;
}