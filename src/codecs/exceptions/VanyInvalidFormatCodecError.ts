import {
  xw,
  Stringable,
} from '@xirelogy/xwts';

import { VanyCodecError } from './VanyCodecError';

import { VanyCodecMessageContextSetup } from '../supports/VanyCodecMessageContextSetup';
import VanyFormCodecMessageContext from '../../features/VanyFormCodecMessageContext';
import { VanyFormControlNature } from '../../types/VanyFormControlNature';

import vanyI18nInit from '../../internals/locale-setup';

const _l = vanyI18nInit('VanyInvalidFormatCodecError');

const CONTEXT_KEY = 'VanyInvalidFormatCodecError';


/**
 * Related data
 */
interface ErrorData {
  /**
   * Value that causes the invalid format
   */
  value?: string|Stringable|number;
  /**
   * Format type
   */
  formatType?: string|Stringable;
}


/**
 * Format the error message
 * @param errorData
 * @returns
 */
function formatMessage(errorData: ErrorData): string|Stringable {
  if (errorData.formatType) {
    return xw.format(_l('invalid {0} format'), errorData.formatType);
  }

  return _l('invalid format');
}


/**
 * Invalid format (in codec)
 */
export class VanyInvalidFormatCodecError extends VanyCodecError {
  /**
   * Related error data
   */
  readonly errorData: ErrorData;


  /**
   * @constructor
   * @param errorData Related error data
   */
  public constructor(errorData?: ErrorData) {
    const _errorData = errorData ?? {};
    super (VanyCodecMessageContextSetup.usingContext(
      CONTEXT_KEY,
      _errorData,
      () => formatMessage(_errorData),
    ));
    this.errorData = _errorData;
  }
}


export const initVanyInvalidFormatCodecErrorFormContext = {
  key: CONTEXT_KEY,
  handle: (subjectLabel: string|Stringable|undefined, controlNature: VanyFormControlNature|undefined, payload: any) => {
    const _payload = payload as ErrorData;
    const verb = VanyFormCodecMessageContext.getControlNatureVerb(controlNature);
    const passive = VanyFormCodecMessageContext.getControlNaturePassive(controlNature);
    if (subjectLabel !== undefined) {
      if (_payload.formatType !== undefined) {
        return xw.format(_l('{2} must be {1} in correct {3} format'), verb, passive, subjectLabel, _payload.formatType);
      } else {
        return xw.format(_l('{2} must be {1} in correct format'), verb, passive, subjectLabel);
      }
    } else {
      if (_payload.formatType !== undefined) {
        return xw.format(_l('must be {1} in correct {2} format'), verb, passive, _payload.formatType);
      } else {
        return xw.format(_l('must be {1} in correct format'), verb, passive);
      }
    }
  },
};
