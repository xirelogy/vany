import VanyRenderRequest from '../../setup/VanyRenderRequest';


/**
 * Render request for VanyTabs
 */
export default interface VanyTabsRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'tabs';
}