/**
 * Change event to be raised by inputs
 */
export type VanyInputChangeEventFunction<BT, DT> = (value: BT|Error|null, rawValue?: DT|null, context?: any) => void;