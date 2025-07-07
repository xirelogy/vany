import { VanyCodec } from '../codecs/VanyCodec';
import { useVanyScaledIntegerFactor } from './useVanyScaledIntegerFactor';
import { useVanyScaledIntegerFactorCodec } from './useVanyScaledIntegerFactorCodec';

/**
 * Specify multi-precision numeric codec from given precision
 * @param precision
 * @returns
 */
export function useVanyScaledIntegerPrecisionCodec(precision: number): VanyCodec<number, string> {
  const unitFactor = useVanyScaledIntegerFactor(precision);
  return useVanyScaledIntegerFactorCodec(unitFactor);
}