import VanyRenderRequest from '../../setup/VanyRenderRequest';
import { type VanyCardDockValue } from '../../types/VanyCardDockValue';
import { type VueClassAttribute } from '../../internals/compat-vue';


/**
 * Render request for VanyCard
 */
export default interface VanyCardRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'card';
  /**
   * Dock direction of the dock slot (when available)
   */
  dock?: VanyCardDockValue;
  /**
   * Dock class to be applied to the dock slot (when available)
   */
  dockClass?: VueClassAttribute;
}
