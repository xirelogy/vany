import {
  VanyCodecOptions,
} from './VanyCodec';


/**
 * Compatible signature for parser support
 */
export interface VanyParseable<BT, DT> {
  /**
   * Parse (accept) a value
   * @param v Incoming value as displayed
   * @param options Options while parsing
   * @returns Parsed (accepted) value
   */
  parse(v: DT|null, options?: VanyCodecOptions): Promise<BT|null>|BT|null;
}