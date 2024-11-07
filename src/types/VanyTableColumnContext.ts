import {
  type VanyTableColumnInstance,
} from './VanyTableColumnInstance';


/**
 * Context to a VanyTableColumn
 */
export interface VanyTableColumnContext {
  /**
   * Current row index
   */
  rowIndex: number;
  /**
   * Current column index
   */
  columnIndex: number;
  /**
   * Current row data
   */
  row: any;
  /**
   * Current column instance
   */
  column: VanyTableColumnInstance;
  /**
   * Corresponding prefixed name (considering prefix and row index)
   * @param name
   * @returns
   */
  prefixed(name: string): string;
}