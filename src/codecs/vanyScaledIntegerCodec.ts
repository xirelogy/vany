import {
  XwError,
  type Stringable,
} from '@xirelogy/xwts';

import {
  VanyCodec,
  VanyCodecOptions,
} from './VanyCodec';

import { VanyExceededMinCodecError } from './exceptions/VanyExceededMinCodecError';
import { VanyExceededMaxCodecError } from './exceptions/VanyExceededMaxCodecError';
import { VanyInvalidFormatCodecError } from './exceptions/VanyInvalidFormatCodecError';
import { VanyOverflowCodecError } from './exceptions/VanyOverflowCodecError';

import vanyI18nInit from '../internals/locale-setup';

const _l = vanyI18nInit('vanyScaledIntegerCodec');


/**
 * Codec options for vanyScaledIntegerCodec
 */
export interface VanyScaledIntegerCodecOptions extends VanyCodecOptions {
  /**
   * If grouping (of thousands) is used during formatting
   * @defaultValue false
   */
  isGroup?: boolean;
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
 * Remove all commas from string
 * @param s
 * @returns
 */
function _filterComma(s: string): string {
  return s.replace(/,/g, '');
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
 * Add fraction to integer
 * @param intPart Integer part (value)
 * @param fracPart Fraction part (format)
 * @param decimals Number of digits expected after decimal point
 */
function _addFraction(intPart: number, fracPart: string, decimals: number): number {
  const fullFracPart = (fracPart + '0'.repeat(decimals)).slice(0, decimals);
  return intPart + parseInt(fullFracPart.padEnd(decimals, '0'), 10);
}


/**
 * Group value in thousands using comma
 * @param v
 * @returns
 */
function _groupWithComma(v: number): string {
  return v.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}


/**
 * Apply format to given original value
 * @param v
 * @param isGroup
 * @param unitFactor
 * @param decimals
 * @returns
 */
function _onFormat(v: number|null, isGroup: boolean, unitFactor: number, decimals: number): string|null {
  if (typeof v === 'undefined') return null;
  if (v === null) return null;

  // Sometimes empty string will just come to here, a fallback to just handle it
  if (typeof v === 'string' && (v as string).trim() === '') return null;

  // Support for imperfect floating point numbers
  v = Math.round(v);

  // Convert to corresponding parts
  const sign = v < 0 ? '-' : '';
  const intPart = Math.floor(Math.abs(v) / unitFactor);
  const fracPart = Math.abs(v) % unitFactor;

  // Check and pad suffix
  let suffix = '' + fracPart;
  while (suffix.length < decimals) {
    suffix = '0' + suffix;
  }

  // Group when necessary
  const intPartText = isGroup ? _groupWithComma(intPart) : ('' + intPart);

  // Compose and return
  return decimals > 0 ?
    sign + intPartText + '.' + suffix :
    sign + intPartText;
}


/**
 * Apply format to given original value (with strict expectations)
 * @param v
 * @param isGroup
 * @param unitFactor
 * @param decimals
 * @returns
 */
function _onStrictFormat(v: number|null, isGroup: boolean, unitFactor: number, decimals: number): string {
  return _onFormat(v, isGroup, unitFactor, decimals) ?? '?';
}


/**
 * Codec for scaled-integer value, represented in integer of
 * the number scaled-up using given factor
 */
class VanyScaledIntegerCodec extends VanyCodec<number, string> {
  /**
   * Corresponding unit factor
   */
  private readonly _unitFactor: number;
  /**
   * Number of decimals
   */
  private readonly _decimals: number;


  /**
   * @constructor
   * @param unitFactor
   * @param typeLabel
   */
  constructor(unitFactor: number, typeLabel?: string|Stringable) {
    super();

    if (unitFactor <= 0 || !Number.isInteger(Math.log10(unitFactor))) {
      throw new XwError(_l('unitFactor must be a positive power of 10'));
    }

    this.typeLabel = typeLabel ?? _l('number');
    this._unitFactor = unitFactor;
    this._decimals = Math.log10(unitFactor);
  }


  /**
   * @inheritdoc
   */
  readonly typeLabel;

  /**
   * @inheritdoc
   */
  public parse(v: string|null, options?: VanyScaledIntegerCodecOptions): number|null {
    const _optionsMin = options?.min ?? null;
    const _optionsMax = options?.max ?? null;
    const _optionsIsGroup = options?.isGroup ?? false;

    const ret = this._onParse(v);
    if (ret === null) return null;

    if (_optionsMin !== null && ret < _optionsMin) throw new VanyExceededMinCodecError(_onStrictFormat(_optionsMin, _optionsIsGroup, this._unitFactor, this._decimals));
    if (_optionsMax !== null && ret > _optionsMax) throw new VanyExceededMaxCodecError(_onStrictFormat(_optionsMax, _optionsIsGroup, this._unitFactor, this._decimals));

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

    // Check sign
    let sign = 1;
    if (vs[0] === '-') {
      sign = -1;
      vs = vs.substring(1);
    }

    const _errorData = {
      value: v,
      formatType: this.typeLabel,
    };

    const dotPos = vs.indexOf('.');
    if (dotPos >= 0) {
      // With decimal: integer and fraction
      const rawInt = _filterComma(vs.substring(0, dotPos));
      const rawFrac = vs.substring(dotPos + 1);

      const finalInt = rawInt !== '' ? rawInt : '0';
      const cents = rawFrac !== '' ? rawFrac : '0';

      if (!_isNumeric(finalInt)) throw new VanyInvalidFormatCodecError(_errorData);
      if (!_isNumeric(cents)) throw new VanyInvalidFormatCodecError(_errorData);

      if (finalInt.length > 13) throw new VanyOverflowCodecError();
      const dollarNum = parseInt(finalInt, 10) * this._unitFactor;

      return sign * _addFraction(dollarNum, cents, this._decimals);
    } else {
      // Without decimal, handle as simple dollar
      const finalInt = _filterComma(vs);

      if (!_isNumeric(finalInt)) throw new VanyInvalidFormatCodecError(_errorData);

      const _floored = Math.floor(parseFloat(finalInt) * this._unitFactor);
      if (_floored > 999999999999999) throw new VanyOverflowCodecError();

      return sign * parseInt(finalInt, 10) * this._unitFactor;
    }
  }


  /**
   * @inheritdoc
   */
  public format(v: number|null, options?: VanyScaledIntegerCodecOptions): string|null {
    const _optionsIsGroup = options?.isGroup ?? false;
    return _onFormat(v, _optionsIsGroup, this._unitFactor, this._decimals);
  }


  /**
   * @inheritdoc
   */
  public using(options?: VanyScaledIntegerCodecOptions): VanyCodec<number, string> {
    return super.using(options);
  }
}


/**
 * Create codec instance for scaled-integer value, represented in integer of
 * the number scaled-up using given factor
 */
export default function vanyScaledIntegerCodec(unitFactor: number, typeLabel?: string|Stringable): VanyCodec<number, string> {
  return new VanyScaledIntegerCodec(unitFactor, typeLabel);
}