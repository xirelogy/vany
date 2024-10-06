import { xw, Stringable } from '@xirelogy/xwts';
import { VanyCodecError } from './VanyCodecError';

import vanyI18nInit from '../../internals/locale-setup';

const _l = vanyI18nInit('VanyExceededMaxCodecError');


/**
 * Exceeded maximum (in codec)
 */
export class VanyExceededMaxCodecError extends VanyCodecError {
  /**
   * @constructor
   * @param v Maximum
   * @param suffix Suffix to value
   */
  public constructor(v: string|Stringable|number, suffix?: string|Stringable) {
    const _v = ('' + v) + xw.normalizeString(suffix ?? '');
    super(xw.format(_l('must not be more than {0}'), _v));
  }
}