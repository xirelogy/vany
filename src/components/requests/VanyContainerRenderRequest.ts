import VanyRenderRequest from '../../setup/VanyRenderRequest';


/**
 * Render request for VanyContainer
 */
export default interface VanyContainerRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'container';
}
