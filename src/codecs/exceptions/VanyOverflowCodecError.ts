import { VanyCodecError } from './VanyCodecError';

import vanyI18nInit from '../../internals/locale-setup';

const _l = vanyI18nInit('VanyOverflowCodecError');


/**
 * Overflow (in codec)
 */
export class VanyOverflowCodecError extends VanyCodecError {
  /**
   * @constructor
   */
  public constructor() {
    super(_l('overflow'));
  }
}