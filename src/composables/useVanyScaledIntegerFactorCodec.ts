import { VanyCodec } from '../codecs/VanyCodec';
import vanyIntegerCodec from '../codecs/vanyIntegerCodec';
import vanyScaledIntegerCodec from '../codecs/vanyScaledIntegerCodec';

/**
 * Specify multi-precision numeric codec from given factor
 * @param unitFactor
 * @returns
 */
export function useVanyScaledIntegerFactorCodec(unitFactor: number): VanyCodec<number, string> {
  if (unitFactor === 1) {
    return vanyIntegerCodec.using({});
  } else {
    return vanyScaledIntegerCodec(unitFactor);
  }
}