import {
  useTableRowKeyFunctionState,
} from '../../states/tableRowKeyState';

import { VanyTableRowKeyFunction } from '../../types/VanyTableRowKeyFunction';


/**
 * Access to current table row key state
 */
export class VanyTableRowKeyState {
  /**
   * Current name prefix
   * @returns
   */
  static get fn(): VanyTableRowKeyFunction|undefined {
    return useTableRowKeyFunctionState();
  }
}