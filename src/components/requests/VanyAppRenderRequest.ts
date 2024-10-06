import VanyRenderRequest from '../../setup/VanyRenderRequest';


/**
 * Render request for VanyApp
 */
export default interface VanyAppRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'app';
}
