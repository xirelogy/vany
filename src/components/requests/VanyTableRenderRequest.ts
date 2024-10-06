import VanyRenderRequest from '../../setup/VanyRenderRequest';

import { type VanyTableRowKeyFunction } from '../../types/VanyTableRowKeyFunction';


/**
 * Render request for VanyTable
 */
export default interface VanyTableRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'table';
  /**
   * Table data
   */
  data: any[];
  /**
   * If table is bordered
   */
  bordered: boolean;
  /**
   * Specific row key function
   */
  rowKey?: VanyTableRowKeyFunction;
}