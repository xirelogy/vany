import {
  xw,
  Stringable,
} from '@xirelogy/xwts';


/**
 * Vany validation related error
 */
export class VanyValidationError extends Error {
  public constructor(message?: string|Stringable) {
    super(typeof message !== 'undefined'
      ? xw.normalizeString(message)
      : undefined
    );
  }
}
