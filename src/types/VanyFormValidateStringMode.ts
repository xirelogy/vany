/**
 * String handling mode in form validation
 * @value rejectEmpty - Reject empty strings
 * @value rejectTrimEmpty - Reject empty strings (after trimming)
 * @value accept - Accept any strings that are non-null
 */
export type VanyFormValidateStringMode = 'rejectEmpty'|'rejectTrimEmpty'|'accept';