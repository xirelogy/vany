import {
  Stringable,
} from '@xirelogy/xwts';

import VanyRenderRequest from '../../setup/VanyRenderRequest';


/**
 * Render request for VanyTableColumn
 * @template T Table column data type
 */
export default interface VanyTableColumnRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'table-column';
  /**
   * Column key
   */
  columnKey?: string;
  /**
   * Associated label (alternative shorthand in absence of slot)
   */
  label?: Stringable|string;
}