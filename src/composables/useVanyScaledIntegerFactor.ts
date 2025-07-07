/**
 * Convert number precision (number of decimal points) into scaling factor
 * @param precision
 * @returns
 */
export function useVanyScaledIntegerFactor(precision: number) {
  return Math.pow(10, precision);
}