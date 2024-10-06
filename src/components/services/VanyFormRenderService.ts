import {
  Stringable,
} from '@xirelogy/xwts';

import { VanyFormValidateStringMode } from '../../types/VanyFormValidateStringMode';
import { VanyFormValidateArrayMode } from '../../types/VanyFormValidateArrayMode';
import { VanyFormValidateTrigger } from '../../types/VanyFormValidateTrigger';
import VanyFormItemRenderService from './VanyFormItemRenderService';

/**
 * Render service for VanyForm
 */
export default interface VanyFormRenderService {
  /**
   * Register a form item
   * @param required If required
   * @param stringMode String handling mode
   * @param arrayMode Array handling mode
   * @param trigger Specific trigger to validate the current form item
   * @param subjectLabel Specific subject label to be used for messaging
   */
  registerFormItem(required: boolean, stringMode: VanyFormValidateStringMode, arrayMode: VanyFormValidateArrayMode, trigger: VanyFormValidateTrigger|undefined, subjectLabel: string|Stringable|undefined): VanyFormItemRenderService;
}