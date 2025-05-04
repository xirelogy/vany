import {
  VanyCodec,
  VanyCodecOptions,
} from './VanyCodec';

import {
  _used,
} from '@xirelogy/xwts';

import { VanyExceededMinCodecError } from './exceptions/VanyExceededMinCodecError';
import { VanyExceededMaxCodecError } from './exceptions/VanyExceededMaxCodecError';
import { VanyInvalidFormatCodecError } from './exceptions/VanyInvalidFormatCodecError';

import vanyI18nInit from '../internals/locale-setup';

const _l = vanyI18nInit('vanyIntegerCodec');


/**
 * Codec options for vanyIntegerCodec
 */
export interface VanyIntegerCodecOptions extends VanyCodecOptions {
  /**
   * Check for minimum value when defined
   * @defaultValue undefined
   */
  min?: number;
  /**
   * Check for maximum value when defined
   * @defaultValue undefined
   */
  max?: number;
}


/**
 * Check if given string value is numeric
 * @param s
 * @returns
 */
function _isNumeric(s: string): boolean {
  return /^\d+$/.test(s);
}


/**
 * Codec for integer value
 */
class VanyIntegerCodec extends VanyCodec<number, string> {
  /**
   * @inheritdoc
   */
  readonly typeLabel = _l('integer');


  /**
   * @inheritdoc
   */
  public parse(v: string|null, options?: VanyIntegerCodecOptions): number|null {
    const _optionsMin = options?.min ?? null;
    const _optionsMax = options?.max ?? null;

    const ret = this._onParse(v);
    if (ret === null) return null;

    if (_optionsMin !== null && ret < _optionsMin) throw new VanyExceededMinCodecError(_optionsMin);
    if (_optionsMax !== null && ret > _optionsMax) throw new VanyExceededMaxCodecError(_optionsMax);

    return ret;
  }


  /**
   * Parse and accept (internally)
   * @param v Display text
   * @returns Parsed (accepted) value
   */
  private _onParse(v: string|null): number|null {
    if (typeof v === 'undefined') return null;
    if (v === null) return null;

    // Always try to convert to string and check
    let vs = ('' + v).trim();
    if (vs === '') return null;

    const _errorData = {
      value: v,
      formatType: this.typeLabel,
    };

    const dotPos = vs.indexOf('.');
    if (dotPos >= 0) {
      vs = vs.substring(0, dotPos);
    }

    if (!_isNumeric(vs)) throw new VanyInvalidFormatCodecError(_errorData);
    return parseInt(vs);
  }


  /**
   * @inheritdoc
   */
  public format(v: number|null, options?: VanyIntegerCodecOptions): string|null {
    if (v === null) return null;
    _used(options);
    return `${Math.round(v)}`;
  }


  /**
   * @inheritdoc
   */
  public using(options?: VanyIntegerCodecOptions): VanyCodec<number, string> {
    return super.using(options);
  }
}


/**
 * Codec for integer value
 */
const vanyIntegerCodec = new VanyIntegerCodec();
export default vanyIntegerCodec;