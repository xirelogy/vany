import { xw, Stringable } from '@xirelogy/xwts';
import { VanyCodecError } from './VanyCodecError';

import vanyI18nInit from '../../internals/locale-setup';

const _l = vanyI18nInit('VanyExceededMinCodecError');


/**
 * Exceeded minimum (in codec)
 */
export class VanyExceededMinCodecError extends VanyCodecError {
  /**
   * @constructor
   * @param v Minimum
   * @param suffix Suffix to value
   */
  public constructor(v: string|Stringable|number, suffix?: string|Stringable) {
    const _v = ('' + v) + xw.normalizeString(suffix ?? '');
    super(xw.format(_l('must not be less than {0}'), _v));
  }
}