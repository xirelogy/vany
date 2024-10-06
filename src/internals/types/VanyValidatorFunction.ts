/**
 * Validator implementation function (asynchronous)
 * @returns true for success, false for empty and Error for failure
 */
export type VanyValidatorFunction = () => Promise<boolean|Error>;