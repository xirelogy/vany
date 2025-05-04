import {
  VanyCodec,
  VanyCodecOptions,
} from './VanyCodec';

import { VanyExceededMinCodecError } from './exceptions/VanyExceededMinCodecError';
import { VanyExceededMaxCodecError } from './exceptions/VanyExceededMaxCodecError';
import { VanyInvalidFormatCodecError } from './exceptions/VanyInvalidFormatCodecError';
import { VanyOverflowCodecError } from './exceptions/VanyOverflowCodecError';

import vanyI18nInit from '../internals/locale-setup';

const _l = vanyI18nInit('vanyMoneyCodec');


/**
 * Codec options for vanyMoneyCodec
 */
export interface VanyMoneyCodecOptions extends VanyCodecOptions {
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
 * Add cents to dollar
 * @param dollar Dollar (value)
 * @param cents Cents (format)
 */
function _addCents(dollar: number, cents: string): number {
  switch (cents.length) {
    case 0:
      return dollar;
    case 1:
      return dollar + (parseInt(cents, 10) * 10);
    case 2:
      return dollar + parseInt(cents, 10);
    default:
      return dollar + parseInt(cents.substring(0, 2), 10);
  }
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
 * @returns
 */
function _onFormat(v: number|null, isGroup: boolean): string|null {
  if (typeof v === 'undefined') return null;
  if (v === null) return null;

  // Sometimes empty string will just come to here, a fallback to just handle it
  if (typeof v === 'string' && (v as string).trim() === '') return null;

  // Support for imperfect floating point numbers
  v = Math.round(v);

  // Convert to corresponding parts
  const sign = v < 0 ? '-' : '';
  const dollar = Math.floor(Math.abs(v) / 100);
  const cents = Math.abs(v) % 100;

  // Suffix is cents, forced to have 2 digits
  let suffix = '' + cents;
  while (suffix.length < 2) {
    suffix = '0' + suffix;
  }

  // Group when necessary
  const dollarText = isGroup ? _groupWithComma(dollar) : ('' + dollar);

  // Compose and return
  return sign + dollarText + '.' + suffix;
}


/**
 * Apply format to given original value (with strict expectations)
 * @param v
 * @param isGroup
 * @returns
 */
function _onStrictFormat(v: number|null, isGroup: boolean): string {
  return _onFormat(v, isGroup) ?? '?';
}


/**
 * Codec for money value, represented in number of cents
 */
class VanyMoneyCodec extends VanyCodec<number, string> {
  /**
   * @inheritdoc
   */
  readonly typeLabel = _l('money');

  /**
   * @inheritdoc
   */
  public parse(v: string|null, options?: VanyMoneyCodecOptions): number|null {
    const _optionsMin = options?.min ?? null;
    const _optionsMax = options?.max ?? null;
    const _optionsIsGroup = options?.isGroup ?? false;

    const ret = this._onParse(v);
    if (ret === null) return null;

    if (_optionsMin !== null && ret < _optionsMin) throw new VanyExceededMinCodecError(_onStrictFormat(_optionsMin, _optionsIsGroup));
    if (_optionsMax !== null && ret > _optionsMax) throw new VanyExceededMaxCodecError(_onStrictFormat(_optionsMax, _optionsIsGroup));

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
      // With decimal: dollar and cents
      const rawDollar = _filterComma(vs.substring(0, dotPos));
      const rawCents = vs.substring(dotPos + 1);

      const dollar = rawDollar !== '' ? rawDollar : '0';
      const cents = rawCents !== '' ? rawCents : '0';

      if (!_isNumeric(dollar)) throw new VanyInvalidFormatCodecError(_errorData);
      if (!_isNumeric(cents)) throw new VanyInvalidFormatCodecError(_errorData);

      if (dollar.length > 13) throw new VanyOverflowCodecError();
      const dollarNum = parseInt(dollar, 10) * 100;

      return sign * _addCents(dollarNum, cents);
    } else {
      // Without decimal, handle as simple dollar
      const dollar = _filterComma(vs);

      if (!_isNumeric(dollar)) throw new VanyInvalidFormatCodecError(_errorData);

      const _floored = Math.floor(parseFloat(dollar) * 100);
      if (_floored > 999999999999999) throw new VanyOverflowCodecError();

      return sign * parseInt(dollar, 10) * 100;
    }
  }


  /**
   * @inheritdoc
   */
  public format(v: number|null, options?: VanyMoneyCodecOptions): string|null {
    const _optionsIsGroup = options?.isGroup ?? false;
    return _onFormat(v, _optionsIsGroup);
  }


  /**
   * @inheritdoc
   */
  public using(options?: VanyMoneyCodecOptions): VanyCodec<number, string> {
    return super.using(options);
  }
}


/**
 * Codec instance for money value, represented in number of cents
 */
const vanyMoneyCodec = new VanyMoneyCodec();
export default vanyMoneyCodec;