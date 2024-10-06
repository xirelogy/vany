import { Stringable } from '@xirelogy/xwts';
import vanyI18nInit from '../internals/locale-setup';

const _l = vanyI18nInit('vanyCodecMessages');


type MessageType = string|Stringable;


/**
 * Common validation/codec related messages
 */
const vanyCodecMessages = {
  /**
   * Successful message
   */
  get ok(): MessageType {
    return _l('ok');
  },
};

export default vanyCodecMessages;