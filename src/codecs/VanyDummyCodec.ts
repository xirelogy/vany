import { _used } from '@xirelogy/xwts';
import { VanyCodec, VanyCodecOptions } from './VanyCodec';


/**
 * Dummy codec that does nothing
 */
export default class VanyDummyCodec<T> extends VanyCodec<T, T> {
  /**
   * @inheritdoc
   */
  public parse(v: T|null, options?: VanyCodecOptions): T|null {
    _used(options);
    return v;
  }

  /**
   * @inheritdoc
   */
  public format(v: T|null, options?: VanyCodecOptions): T|null {
    _used(options);
    return v;
  }
}