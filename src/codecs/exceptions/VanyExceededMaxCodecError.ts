import { xw, Stringable } from '@xirelogy/xwts';
import { VanyCodecError } from './VanyCodecError';

import { VanyCodecMessageContextSetup } from '../supports/VanyCodecMessageContextSetup';
import { VanyFormControlNature } from '../../types/VanyFormControlNature';

import vanyI18nInit from '../../internals/locale-setup';

const _l = vanyI18nInit('VanyExceededMaxCodecError');

const CONTEXT_KEY = 'VanyExceededMaxCodecError';


/**
 * Related data
 */
interface ErrorData {
  /**
   * Maximum value
   */
  value: string|Stringable|number;
  /**
   * Optional suffix to the value
   */
  suffix?: string|Stringable;
}


/**
 * Format the error message
 * @param errorData
 * @returns
 */
function formatMessage(errorData: ErrorData): string|Stringable {
  const _v = ('' + errorData.value) + xw.normalizeString(errorData.suffix ?? '');
  return xw.format(_l('must not be more than {0}'), _v);
}


/**
 * Exceeded maximum (in codec)
 */
export class VanyExceededMaxCodecError extends VanyCodecError {
  /**
   * Related error data
   */
  readonly errorData: ErrorData;


  /**
   * @constructor
   * @param v Maximum
   * @param suffix Suffix to value
   */
  public constructor(v: string|Stringable|number, suffix?: string|Stringable) {
    const _errorData: ErrorData = { value: v, suffix };
    super(VanyCodecMessageContextSetup.usingContext(
      CONTEXT_KEY,
      _errorData,
      () => formatMessage(_errorData),
    ));
    this.errorData = _errorData;
  }
}


export const initVanyExceededMaxCodecErrorFormContext = {
  key: CONTEXT_KEY,
  handle: (subjectLabel: string|Stringable|undefined, _controlNature: VanyFormControlNature|undefined, payload: any) => {
    const _payload = payload as ErrorData;
    const _v = ('' + _payload.value) + xw.normalizeString(_payload.suffix ?? '');
    if (subjectLabel !== undefined) {
      return xw.format(_l('{0} must not be more than {1}'), subjectLabel, _v);
    } else {
      return xw.format(_l('must not be more than {0}'), _v);
    }
  },
};