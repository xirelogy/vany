type Hour = `${number}${number}`;
type Minute = `${number}${number}`;
type Second = `${number}${number}`;

/**
 * A stable time value
 * This is a special alias mark to indicate time string explicitly using the hh:mm:ss format.
 */
export type VanyStableTimeValue = `${Hour}:${Minute}:${Second}`;