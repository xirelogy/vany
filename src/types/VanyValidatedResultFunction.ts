/**
 * Function signature for validation result
 * @param success If validation success (true/false) or cleared (null)
 * @param message Notification response message
 */
export type VanyValidatedResultFunction = (success: boolean|null, message: string|Error) => void;