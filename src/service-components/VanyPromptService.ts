import {
  Stringable,
} from '@xirelogy/xwts';

import VanyInRegistry from '../internals/VanyInRegistry';
import { VanyButtonType } from '../types/VanyButtonType';
import { VanyPromptType } from '../types/VanyPromptType';
import { VanyRenderFunction } from '../types/VanyRenderFunction';
import VanyPromptServiceRequest from './requests/VanyPromptServiceRequest';

import vanyI18nInit from '../internals/locale-setup';

const _l = vanyI18nInit('VanyPromptService');


/**
 * Defaults for VanyPrompt
 */
export class VanyPromptOptionsDefault {
  /**
   * Default return value for default button
   */
  static readonly defaultReturn: any|null = null;
  /**
   * Default label for the default button
   */
  static readonly defaultButtonLabel: string|Stringable = _l('Ok');
}


/**
 * Options to VanyButton under VanyPrompt
 */
export interface VanyPromptButtonOption<T> {
  /**
   * Button type
   */
  type?: VanyButtonType;
  /**
   * Value represented by current button
   */
  value: T|null;
  /**
   * Button content
   */
  content: string|VanyRenderFunction;
  /**
   * If light
   */
  light?: boolean;
}


/**
 * Options to VanyPrompt
 */
export interface VanyPromptOptions<T> {
  /**
   * Prompt type
   * @defaultValue undefined
   */
  type?: VanyPromptType;
  /**
   * Title
   * @defaultValue undefined
   */
  title?: string|VanyRenderFunction;
  /**
   * Main content
   */
  content: string|VanyRenderFunction;
  /**
   * Prompt buttons
   */
  buttons?: VanyPromptButtonOption<T>[];
  /**
   * Default return value for button clicked (for the default button)
   */
  defaultReturn?: T|null;
}


/**
 * Vany prompt global service component
 */
export default class VanyPromptService {
  /**
   * Show and run a prompt
   * @param options Related options
   * @returns Prompt result
   */
  static show<T = string>(options: VanyPromptOptions<T>): Promise<T|null> {
    const request: VanyPromptServiceRequest<T> = {
      vanyClass: 'prompt',
      options: options,
    };

    return VanyInRegistry.service(request);
  }
}
