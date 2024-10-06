import {
  Stringable,
} from '@xirelogy/xwts';

import VanyRenderRequest from '../../setup/VanyRenderRequest';

import {
  type VanyTabKeyValue,
} from '../../types/VanyTabKeyValue';


/**
 * Render request for VanyTabPane
 */
export default interface VanyTabPaneRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'tab-pane';
  /**
   * Associated value (when selected)
   */
  value: VanyTabKeyValue;
  /**
   * Associated label (alternative shorthand in absence of slot)
   */
  label?: Stringable|string;
  /**
   * If disabled
   */
  disabled: boolean;
}