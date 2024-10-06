type Year = `${number}${number}${number}${number}`;
type Month = `${number}${number}`;
type Day = `${number}${number}`;

/**
 * A stable date value
 * This is a special alias mark to indicate date string explicitly using the YYYY-MM-DD format.
 */
export type VanyStableDateValue = `${Year}-${Month}-${Day}`;