import { Stringable } from '@xirelogy/xwts';
import { VanyValidationError } from './VanyValidationError';


/**
 * Error related to VanyCodec
 */
export class VanyCodecError extends VanyValidationError {
  /**
   * @constructor
   * @param message
   */
  public constructor(message?: string|Stringable) {
    super(message);
  }
}