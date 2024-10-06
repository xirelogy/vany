import {
  Stringable,
  xw,
} from '@xirelogy/xwts';

import vanyI18nInit from '../../internals/locale-setup';
const _l = vanyI18nInit('VanyCurrentlyBusyError');


/**
 * Currently already busy
 */
export class VanyCurrentlyBusyError extends Error {
  /**
   * @constructor
   * @param message
   */
  public constructor(message?: string|Stringable) {
    super(xw.normalizeString(message ?? _l('Currently busy')));
  }
}