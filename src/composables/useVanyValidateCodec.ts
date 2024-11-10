import {
  xw,
  _used,
} from '@xirelogy/xwts';

import {
  VanyCodec,
  VanyCodecOptions,
} from '../codecs/VanyCodec';


/**
 * Validation function (sync)
 */
type SyncValidatorFunction<T> = (v: T|null, options?: VanyCodecOptions) => void;
/**
 * Validation function (async)
 */
type AsyncValidatorFunction<T> = (v: T|null, options?: VanyCodecOptions) => Promise<void>;


/**
 * Validation function
 */
type ValidatorFunction<T> = SyncValidatorFunction<T>|AsyncValidatorFunction<T>;


/**
 * Declare validation codec
 */
export function useVanyValidateCodec<T>(fn: ValidatorFunction<T>): VanyCodec<T, T> {
  return new class extends VanyCodec<T, T> {
    /**
     * @inheritdoc
     */
    public async parse(v: T|null, options?: VanyCodecOptions): Promise<T|null> {
      await xw.asAsyncTarget(fn(v, options));
      return v;
    }

    /**
     * @inheritdoc
     */
    public format(v: T|null, options?: VanyCodecOptions): T|null {
      _used(options);
      return v; // Passthru
    }

  };
}