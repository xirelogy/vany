import {
  inject,
} from 'vue';

import { VanyTableRowKeyFunction } from '../types/VanyTableRowKeyFunction';


/**
 * Injection key
 */
export const KEY = Symbol();


/**
 * State class
 */
export class TableRowKeyState {
  /**
   * Row key function
   */
  rowKey: VanyTableRowKeyFunction|undefined;


  /**
   * @constructor
   * @param rowKey
   */
  constructor(rowKey?: VanyTableRowKeyFunction) {
    this.rowKey = rowKey;
  }
}


/**
 * Create a new table row key state
 * @param rowKey
 * @returns
 */
export function createTableRowKeyState(rowKey?: VanyTableRowKeyFunction): TableRowKeyState {
  return new TableRowKeyState(rowKey);
}


/**
 * Use the table row key function
 * @returns
 */
export function useTableRowKeyFunctionState(): VanyTableRowKeyFunction|undefined {
  const injected = inject<TableRowKeyState|null>(KEY, null);
  if (injected === null) return undefined;

  return injected.rowKey;
}
