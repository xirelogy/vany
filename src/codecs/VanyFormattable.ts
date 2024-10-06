import {
  VanyCodecOptions,
} from './VanyCodec';


/**
 * Compatible signature for format support
 */
export interface VanyFormattable<BT, DT> {
  /**
   * Format a value
   * @param v Base value as stored
   * @param options Options while formatting
   * @returns Formatted (display) value
   */
  format(v: BT|null, options?: VanyCodecOptions): DT|null;
}