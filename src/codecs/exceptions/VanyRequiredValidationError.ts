import {
  xw,
  Stringable,
} from '@xirelogy/xwts';

import { VanyValidationError } from './VanyValidationError';

import { VanyCodecMessageContextSetup } from '../supports/VanyCodecMessageContextSetup';
import VanyFormCodecMessageContext from '../../features/VanyFormCodecMessageContext';
import { VanyFormControlNature } from '../../types/VanyFormControlNature';

import vanyI18nInit from '../../internals/locale-setup';

const _l = vanyI18nInit('VanyRequiredValidationError');

const CONTEXT_KEY = 'VanyRequiredValidationError';


/**
 * Validation failure due to missing required input
 */
export class VanyRequiredValidationError extends VanyValidationError {
  /**
   * @constructor
   */
  public constructor() {
    super(VanyCodecMessageContextSetup.usingContext(
      CONTEXT_KEY,
      { },
      () => _l('input is required'),
    ));
  }
}


export const initVanyRequiredValidationErrorFormContext = {
  key: CONTEXT_KEY,
  handle: (subjectLabel: string|Stringable|undefined, controlNature: VanyFormControlNature|undefined) => {
    const verb = VanyFormCodecMessageContext.getControlNatureVerb(controlNature);
    const passive = VanyFormCodecMessageContext.getControlNaturePassive(controlNature);
    if (subjectLabel !== undefined) {
      return xw.format(_l('{2} must be {1}'), verb, passive, subjectLabel)
    } else {
      return xw.format(_l('must be {1}'), verb, passive);
    }
  },
};