import {
  _used,
  Stringable,
  XwReleasable,
  XwOneTimeRelease,
} from '@xirelogy/xwts';

import { VanyFormControlNature } from '../types/VanyFormControlNature';
import { VanyCodecMessageContext } from '../codecs/supports/VanyCodecMessageContext';

import { initVanyInvalidFormatCodecErrorFormContext } from '../codecs/exceptions/VanyInvalidFormatCodecError';
import { initVanyInvalidValueCodecErrorFormContext } from '../codecs/exceptions/VanyInvalidValueCodecError';
import { initVanyRequiredValidationErrorFormContext } from '../codecs/exceptions/VanyRequiredValidationError';
import { initVanyExceededMinCodecErrorFormContext } from '../codecs/exceptions/VanyExceededMinCodecError';
import { initVanyExceededMaxCodecErrorFormContext } from '../codecs/exceptions/VanyExceededMaxCodecError';

import vanyI18nInit from '../internals/locale-setup';

const _l = vanyI18nInit('VanyFormCodecMessageContext');


/**
 * Signature for a handle function
 */
type HandleFunction = () => string|Stringable;

/**
 * Signature for a runnning handle function
 */
type RunningHandleFunction = (subjectLabel: string|Stringable|undefined, controlNature: VanyFormControlNature|undefined, payload: any) => string|Stringable;


/**
 * Handler map
 */
const _map = new Map<string, RunningHandleFunction>();


/**
 * Default implementation of form based VanyCodecMessageContext
 */
export default class VanyFormCodecMessageContext {
  /**
   * Create instance of form related VanyCodecMessageContext
   * @param subjectLabel
   * @param controlNature
   * @returns Created context
   */
  static createInstance(subjectLabel: string|Stringable|undefined, controlNature: VanyFormControlNature|undefined): VanyCodecMessageContext {
    return {
      /**
       * @inheritdoc
       */
      findMessageHandler(typeClass: string, payload: any): HandleFunction|null {
        const _handle = _map.get(typeClass);
        if (!_handle) return null;

        // Post-processing of subject label
        let _subjectLabel = subjectLabel;
        if (_subjectLabel === '' || _subjectLabel === '-') _subjectLabel = undefined;

        // Adapt to the actual handler
        return () => {
          return _handle(_subjectLabel, controlNature, payload);
        };
      },
    };
  }


  /**
   * Register a handler for given message type class
   * @param typeClass Message type class
   * @param handleFn Corresponding handling function
   * @returns Restore handle
   */
  static registerHandle(typeClass: string, handleFn: RunningHandleFunction): XwReleasable {
    const _existingHandleFn = _map.get(typeClass);
    _map.set(typeClass, handleFn);

    return new XwOneTimeRelease(() => {
      if (_existingHandleFn) {
        _map.set(typeClass, _existingHandleFn);
      } else {
        _map.delete(typeClass);
      }
    });
  }


  /**
   * The verb form of control nature
   * @param controlNature
   * @returns
   */
  static getControlNatureVerb(controlNature?: VanyFormControlNature): string|Stringable {
    switch (controlNature) {
      case 'input':
        return _l('provide');
      case 'select':
        return _l('select');
      default:
        return _l('provide');
    }
  }


  /**
   * The passive form of control nature
   * @param controlNature
   * @returns
   */
  static getControlNaturePassive(controlNature?: VanyFormControlNature): string|Stringable {
    switch (controlNature) {
      case 'input':
        return _l('provided');
      case 'select':
        return _l('selected');
      default:
        return _l('provided');
    }
  }
}


interface InitContext {
  key: string;
  handle: RunningHandleFunction,
}


/**
 * Initialize the VanyFormCodecMessageContext
 */
export function initVanyFormCodecMessageContext(): void {
  const inits: InitContext[] = [
    initVanyInvalidFormatCodecErrorFormContext,
    initVanyInvalidValueCodecErrorFormContext,
    initVanyRequiredValidationErrorFormContext,
    initVanyExceededMinCodecErrorFormContext,
    initVanyExceededMaxCodecErrorFormContext,
  ];

  for (const init of inits) {
    _map.set(init.key, init.handle);
  }
}