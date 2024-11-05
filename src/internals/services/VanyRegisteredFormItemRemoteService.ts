import {
  Stringable,
} from '@xirelogy/xwts';

import VanyServiceable from '../../features/VanyServiceable';
import { VanyFormValidateStringMode } from '../../types/VanyFormValidateStringMode';
import { VanyFormValidateTrigger } from '../../types/VanyFormValidateTrigger';
import { VanyFormValidateArrayMode } from '../../types';

/**
 * Internal key
 */
export const KEY = Symbol();


/**
 * Validator function with auto notification
 */
type NotifyingVanyValidatorFunction = (isForeground?: boolean) => Promise<boolean|Error>;


/**
 * Remote service interface for VanyFormItem's registered control
 */
export interface VanyRegisteredFormItemRemoteService extends VanyServiceable {
  /**
   * Current specific service class
   */
  vanyServiceClass: 'VanyRegisteredFormItemRemoteService';

  /**
   * Field subject label
   */
  get subjectLabel(): string|Stringable|undefined;

  /**
   * Validation string mode
   */
  get validateStringMode(): VanyFormValidateStringMode;

  /**
   * Validation array mode
   */
  get validateArrayMode(): VanyFormValidateArrayMode;

  /**
   * Specific validation trigger
   */
  get validateTrigger(): VanyFormValidateTrigger|undefined;

  /**
   * Register validator function (with notifying)
   * @param fn
   */
  registerNotifyingValidator(fn: NotifyingVanyValidatorFunction): void;

  /**
   * Notify that change had happened
   */
  notifyChange(): void;

  /**
   * Notify of the validation result
   * @param result Validation result
   * @param isForeground If the validation is caused by foreground activity [true]
   */
  notifyValidated(result: boolean|Error, isForeground?: boolean): void;
}