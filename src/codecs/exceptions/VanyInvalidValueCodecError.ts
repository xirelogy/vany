import {
  xw,
  Stringable,
} from '@xirelogy/xwts';

import { VanyCodecError } from './VanyCodecError';

import { VanyCodecMessageContextSetup } from '../supports/VanyCodecMessageContextSetup';
import VanyFormCodecMessageContext from '../../features/VanyFormCodecMessageContext';
import { VanyFormControlNature } from '../../types/VanyFormControlNature';

import vanyI18nInit from '../../internals/locale-setup';

const _l = vanyI18nInit('VanyInvalidValueCodecError');

const CONTEXT_KEY = 'VanyInvalidValueCodecError';



/**
 * Invalid value (in codec)
 */
export class VanyInvalidValueCodecError extends VanyCodecError {
  /**
   * @constructor
   */
  public constructor() {
    super(VanyCodecMessageContextSetup.usingContext(
      CONTEXT_KEY,
      { },
      () => _l('invalid value'),
    ));
  }
}


export const initVanyInvalidValueCodecErrorFormContext = {
  key: CONTEXT_KEY,
  handle: (subjectLabel: string|Stringable|undefined, controlNature: VanyFormControlNature|undefined) => {
    const verb = VanyFormCodecMessageContext.getControlNatureVerb(controlNature);
    const passive = VanyFormCodecMessageContext.getControlNaturePassive(controlNature);
    if (subjectLabel !== undefined) {
      return xw.format(_l('{2} {1} is invalid'), verb, passive, subjectLabel)
    } else {
      return xw.format(_l('value {1} is invalid'), verb, passive);
    }
  },
};