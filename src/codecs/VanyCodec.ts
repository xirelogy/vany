import {
  xw,
  Stringable,
} from '@xirelogy/xwts';

import {
  VanyParseable,
} from './VanyParseable';

import {
  VanyFormattable,
} from './VanyFormattable';


/**
 * Codec options
 */
export interface VanyCodecOptions {

}


/**
 * Codec: controls how data is parsed (accepted) and formatted
 * @template BT Base type: how data is internally understood and stored
 * @template DT Display type: how data is presented to the end user
 */
export abstract class VanyCodec<BT, DT> implements VanyParseable<BT, DT>, VanyFormattable<BT, DT> {
  /**
   * Type label for given codec
   */
  readonly typeLabel?: string|Stringable;

  /**
   * @inheritdoc
   */
  public abstract parse(v: DT|null, options?: VanyCodecOptions): Promise<BT|null>|BT|null;

  /**
   * @inheritdoc
   */
  public abstract format(v: BT|null, options?: VanyCodecOptions): DT|null;

  /**
   * Create a specific instance of codec using specific options
   * @param options Specific options to be used (binded)
   * @returns Created instance
   */
  public using(options?: VanyCodecOptions): VanyCodec<BT, DT> {
    const _that = this;
    const _usingOptions = options ?? {};

    return new class extends VanyCodec<BT, DT> {
      /**
       * @inheritdoc
       */
      public parse(v: DT|null, options?: VanyCodecOptions): Promise<BT|null>|BT|null {
        const _options = options ?? {};
        return _that.parse(v, {..._usingOptions, _options});
      }

      /**
       * @inheritdoc
       */
      public format(v: BT|null, options?: VanyCodecOptions): DT|null {
        const _options = options ?? {};
        return _that.format(v, {..._usingOptions, _options});
      }
    };
  }
}


/**
 * Create a codec whereby its actual codec instance is evaluated during execution
 * @param fn A function to create the actual codec instance
 * @returns The deferring codec
 * @template BT Correspond to VanyCodec's BT template
 * @template DT Correspond to VanyCodec's DT template
 */
export function deferCodec<BT, DT>(fn: () => VanyCodec<BT, DT>): VanyCodec<BT, DT> {
  return new class extends VanyCodec<BT, DT> {
      /**
       * @inheritdoc
       */
      public parse(v: DT|null, options?: VanyCodecOptions): Promise<BT|null>|BT|null {
        const _codec = fn();
        return _codec.parse(v, options);
      }

      /**
       * @inheritdoc
       */
      public format(v: BT|null, options?: VanyCodecOptions): DT|null {
        const _codec = fn();
        return _codec.format(v, options);
      }
  };
}


/**
 * Create a codec consist of multiple codecs joint together
 * @param codec First item in the list of codecs, whereby parsing is evaluated in forward order and formating is evaluated in reverse order
 * @param codecs The rest items in the list of codecs
 * @returns The corresponding codec
 * @template BT Correspond to VanyCodec's BT template
 * @template DT Correspond to VanyCodec's DT template
 */
export function chainCodecs<BT, DT>(codec: VanyCodec<any, DT>, ...codecs: VanyCodec<any, any>[]): VanyCodec<BT, DT> {
  const fwdCodecs = [codec, ...codecs];
  const revCodecs = [...fwdCodecs].reverse();

  return new class extends VanyCodec<BT, DT> {
    /**
     * @inheritdoc
     */
    public async parse(v: DT|null, options?: VanyCodecOptions): Promise<BT|null> {
      let r: any = v;
      for (const codec of codecs) {
        r = await xw.asAsyncTarget(codec.parse(r, options));
      }

      return r as BT|null;
    }

    /**
     * @inheritdoc
     */
    public format(v: BT|null, options?: VanyCodecOptions): DT|null {
      let r: any = v;
      for (const codec of revCodecs) {
        r = codec.format(r, options);
      }

      return r as DT|null;
    }
  };
}