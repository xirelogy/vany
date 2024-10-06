import { VanyValidationError } from './VanyValidationError';

import vanyI18nInit from '../../internals/locale-setup';

const _l = vanyI18nInit('VanyValidationFailedError');


/**
 * General validation failure
 */
export class VanyValidationFailedError extends VanyValidationError {
  /**
   * @constructor
   */
  public constructor() {
    super(_l('validation failed'));
  }
}