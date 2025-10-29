//#region Imports
import {
  xw,
  _used,
  Stringable,
} from '@xirelogy/xwts';

import {
  computed,
  nextTick,
  ref,
} from 'vue';

import VanyCallable from '../features/VanyCallable';
import VanyFormRunner from '../features/VanyFormRunner';
import { VanyFormValidateStringMode } from '../types/VanyFormValidateStringMode';
import { VanyFormValidateArrayMode } from '../types/VanyFormValidateArrayMode';
import { VanyFormValidateTrigger } from '../types/VanyFormValidateTrigger';
import { VanyValidatedResultFunction } from '../types/VanyValidatedResultFunction';
import vanyCodecMessages from '../codecs/vanyCodecMessages';
import { VanyRequiredValidationError } from '../codecs/exceptions/VanyRequiredValidationError';
import VanyFormRenderService from '../components/services/VanyFormRenderService';
import VanyFormItemRenderService from '../components/services/VanyFormItemRenderService';
import VanyRegisteredFormItemRenderService from '../components/services/VanyRegisteredFormItemRenderService';

import VanyServiceable from '../features/VanyServiceable';
import VanyServiceProvider from './VanyServiceProvider';

import {
  KEY as VanyRegisteredFormItemRemoteServiceKey,
  VanyRegisteredFormItemRemoteService,
} from './services/VanyRegisteredFormItemRemoteService';
//#endregion


const debug = xw.debugLog.defineLazy('Vany.[VanyFormRunner]');

/**
 * Default value for isForeground
 */
const DEFAULT_ISFOREGROUND = true;


/**
 * Validator function with auto notification
 */
type NotifyingVanyValidatorFunction = (isForeground?: boolean) => Promise<boolean|Error>;


//#region Form field support
/**
 * Representation of a field in the form
 */
class FormField {
  /**
   * Instance ID of parent
   */
  public readonly instanceId: string;
  /**
   * Name (as in form control)
   */
  public readonly formName: string;
  /**
   * If current field is required
   */
  public isRequired: boolean;
  /**
   * Parent control, for multi-level
   */
  public readonly parent: VanyRegisteredFormItemRenderService|undefined;
  /**
   * String handling mode during validation
   */
  public readonly stringMode: VanyFormValidateStringMode;
  /**
   * Array handling mode during validation
   */
  public readonly arrayMode: VanyFormValidateArrayMode;
  /**
   * The trigger to validate current form item
   */
  public readonly trigger: VanyFormValidateTrigger|undefined;
  /**
   * Associated subject label
   */
  public readonly subjectLabel: string|Stringable|undefined;
  /**
   * Focus forwarder
   */
  private _fwdFocus: VanyCallable<void, Promise<boolean>>|null;
  /**
   * Validator function (with notification)
   */
  private _notifyingValidatorFn: NotifyingVanyValidatorFunction;
  /**
   * Validation result functions
   */
  private _onValidateResultFns: VanyValidatedResultFunction[] = [];
  /**
   * Last validation state
   */
  private _lastValidation: boolean|Error = false;
  /**
   * If current control is usable
   */
  private _isUsable: boolean = true;


  /**
   * @constructor
   * @param instanceId
   * @param formName
   * @param isRequired
   * @param parent
   * @param stringMode
   * @param arrayMode
   * @param trigger
   * @param subjectLabel
   * @param fwdFocus
   */
  public constructor(instanceId: string, formName: string, isRequired: boolean, parent: VanyRegisteredFormItemRenderService|undefined, stringMode: VanyFormValidateStringMode, arrayMode: VanyFormValidateArrayMode, trigger: VanyFormValidateTrigger|undefined, subjectLabel: string|Stringable|undefined, fwdFocus: VanyCallable<void, Promise<boolean>>|undefined) {
    this.instanceId = instanceId;
    this.formName = formName;
    this.isRequired = isRequired;
    this.parent = parent;
    this.stringMode = stringMode;
    this.arrayMode = arrayMode;
    this.trigger = trigger;
    this.subjectLabel = subjectLabel;
    this._fwdFocus = fwdFocus ?? null;
    this._notifyingValidatorFn = async (isForeground?: boolean): Promise<boolean|Error> => {
      const result = false;
      this.notifyValidated(result, isForeground ?? DEFAULT_ISFOREGROUND);
      return result;
    };
  }


  /**
   * If current instance is usable
   */
  public get isUsable(): boolean {
    return this._isUsable;
  }


  /**
   * Update field with validation result
   * @param result Validation result
   * @param isForeground If the validation is caused by foreground activity
   */
  public notifyValidated(result: boolean|Error, isForeground: boolean): void {
    // Save as last validation
    this._lastValidation = result;

    // Invalid/error messages in background will be supressed
    if (result !== true && !isForeground) return;

    // Determine how to forward
    if (result === true) {
      // Has value and validated, success
      this._forwardNotifyValidated(true, xw.normalizeString(vanyCodecMessages.ok));
    } else if (result instanceof Error) {
      // Validation error, fail
      this._forwardNotifyValidated(false, result.message);
    } else {
      // No value, depends on the requirements flag
      if (this.isRequired) {
        this._forwardNotifyValidated(false, new VanyRequiredValidationError());
      } else {
        this._forwardNotifyValidated(true, xw.normalizeString(vanyCodecMessages.ok));
      }
    }
  }


  /**
   * Clear validation
   */
  public clearValidate(): void {
    this._forwardNotifyValidated(null, '');
  }


  /**
   * Forward validation message
   * @param success
   * @param message
   */
  private _forwardNotifyValidated(success: boolean|null, message: string|Error): void {
    for (const fn of this._onValidateResultFns) {
      fn(success, message);
    }
  }


  /**
   * Evaluate the last validity according to field property
   * @returns
   */
  public evaluateLastValidity(): boolean {
    // When parent defined, only fail when last validation is an error
    if (this.parent) {
      if (this._lastValidation instanceof Error) return false;
      return true;
    }

    // No value available and field is required, fail
    if (this._lastValidation === false && this.isRequired) return false;

    // Validation error exist, fail
    if (this._lastValidation instanceof Error) return false;

    // Otherwise, pass
    return true;
  }


  /**
   * Try to get focus
   * @returns
   */
  public async focus(): Promise<boolean> {
    if (this._fwdFocus === null) return false;
    return await this._fwdFocus.call();
  }


  /**
   * Subscribe to validation result
   * @param fn
   */
  public subscribeValidationResult(fn: VanyValidatedResultFunction): void {
    this._onValidateResultFns.push(fn);
  }


  /**
   * Register validator (with notifier) function
   * @param fn
   */
  public registerNotifyingValidator(fn: NotifyingVanyValidatorFunction): void {
    this._notifyingValidatorFn = fn;
  }


  /**
   * Perform validation on current field
   * @param isForeground If the validation is caused by foreground activity
   * @returns
   */
  public async validate(isForeground: boolean): Promise<boolean> {
    await this._notifyingValidatorFn(isForeground);
    const evaluation = this.evaluateLastValidity();

    debug.r.debug(`[${this.instanceId}] FormField.validate('${this.formName}')`, {
      lastValidation: this._lastValidation,
      evaluation: evaluation,
    });

    return evaluation;
  }


  /**
   * Destroy the current field
   */
  public destroy(): void {
    this._isUsable = false;
  }
}
//#endregion


/**
 * Form field deregistration function
 */
type DeregisterFunction = (source: string) => void;
/**
 * Service interface extractor signature
 */
export type GetVanyFormRenderServiceFunction = (service: VanyFormRenderService) => void;


//#region Main function
/**
 * Options to createVanyFormRunner
 */
interface CreateVanyFormRunnerOptions {
  /**
   * Service interface extractor
   */
  getServiceFn: GetVanyFormRenderServiceFunction;
  /**
   * Associated model value
   */
  modelValue: Record<string, any>|null;
}


/**
 * Create a VanyFormRunner instance
 * @param options Function options
 */
export default function createVanyFormRunner(
  options: CreateVanyFormRunnerOptions,
): VanyFormRunner {
  //#region Initialization
  const _instanceId = xw.random.lowerAlphanumString(8);
  const _isSubmittable = ref(false);
  const _isDirty = ref(false);
  const _fields = new Map<string, FormField>();

  // Supporting flags
  let _isRevalidate = false;

  _used(options.modelValue);
  //#endregion

  //#region Internal functions
  /**
   * Register a form item along with its control (as a field)
   * @param name
   * @param required
   * @param stringMode
   * @param arrayMode
   * @param trigger
   * @param subjectLabel
   * @param fwdFocus
   * @param parentState
   * @returns
   */
  function _registerFormItemControl(name: string, required: boolean, stringMode: VanyFormValidateStringMode, arrayMode: VanyFormValidateArrayMode, trigger: VanyFormValidateTrigger|undefined, subjectLabel: string|Stringable|undefined, fwdFocus: VanyCallable<void, Promise<boolean>>|undefined, parentState: VanyRegisteredFormItemRenderService|undefined): FormField|null {
    // Prevent duplication
    const existingField = _fields.get(name) ?? null;
    if (existingField !== null) {
      debug.r.warn(`Duplicate field name: '${name}'`)
      return null;
    }

    // Register
    const control = new FormField(_instanceId, name, required, parentState, stringMode, arrayMode, trigger, subjectLabel, fwdFocus);
    _fields.set(name, control);

    // Always re-evaluate
    _isSubmittable.value = _evaluateLastValidity();
    debug.r.debug(`isSubmittable evaluated as: ${_isSubmittable.value}`);

    return control;
  }


  /**
   * Create handle for given registered form item control
   * @param control
   * @param onDeregister
   * @returns
   */
  function _createFormItemControlHandle(control: FormField, onDeregister: DeregisterFunction): VanyRegisteredFormItemRenderService {
    // Register internal services
    const _services = new VanyServiceProvider();
    const service: VanyRegisteredFormItemRemoteService = {
      /**
       * @inheritdoc
       */
      vanyServiceClass: 'VanyRegisteredFormItemRemoteService',

      /**
       * @inheritdoc
       */
      get subjectLabel(): string|Stringable|undefined {
        return control.subjectLabel;
      },

      /**
       * @inheritdoc
       */
      get validateStringMode(): VanyFormValidateStringMode {
        return control.stringMode;
      },

      /**
       * @inheritdoc
       */
      get validateArrayMode(): VanyFormValidateArrayMode {
        return control.arrayMode;
      },

      /**
       * @inheritdoc
       */
      get validateTrigger(): VanyFormValidateTrigger|undefined {
        return control.trigger;
      },

      /**
       * @inheritdoc
       */
      registerNotifyingValidator(fn: NotifyingVanyValidatorFunction): void {
        control.registerNotifyingValidator(fn);
      },

      /**
       * @inheritdoc
       */
      notifyChange(): void {
        debug.r.debug(`[${_instanceId}] Marking dirty because of '${control.formName}'`)
        _isDirty.value = true;
      },

      /**
       * @inheritdoc
       */
      notifyValidated(result: boolean|Error, isForeground?: boolean): void {
        const _isForeground = isForeground ?? DEFAULT_ISFOREGROUND;
        debug.r.debug(`[${_instanceId}] ${_isForeground ? 'FG' : 'BG'}-validation result for '${control.formName}': ${result instanceof Error ? result.message : result}`);
        control.notifyValidated(result, _isForeground);

        // Re-evaluate
        _isSubmittable.value = _evaluateLastValidity();
        debug.r.debug(`isSubmittable re-evaluated as: ${_isSubmittable.value}`);
      },
    };
    _services.registerService(VanyRegisteredFormItemRemoteServiceKey, service);

    return {
      /**
       * @inheritdoc
       */
      name: control.formName,

      /**
       * @inheritdoc
       */
      negotiate<T extends VanyServiceable = VanyServiceable>(ident: Symbol): T|null {
        return _services.negotiator.negotiate<T>(ident);
      },

      /**
       * @inheritdoc
       */
      onValidated(fn: VanyValidatedResultFunction): void {
        control.subscribeValidationResult(fn);
      },

      /**
       * @inheritdoc
       */
      notifyBeforeUnmount(): void {
        onDeregister('control-handle');
      },
    };
  }


  /**
   * Deregister a form item
   * @param control
   */
  function _deregisterFormItemControl(control: FormField): void {
    if (!control.isUsable) return;
    control.destroy();
    _fields.delete(control.formName);

    // Always re-evaluate
    _isSubmittable.value = _evaluateLastValidity();
  }


  /**
   * Queue for revalidation
   */
  function _queueRevalidate() {
    _isRevalidate = true;
    nextTick(async () => {
      if (!_isRevalidate) return; // Deduplication
      _isRevalidate = false;
      await _validate(false);
    });
  }


  /**
   * Validate the fields
   * @param isForeground
   * @returns
   */
  async function _validate(isForeground: boolean): Promise<boolean> {
    debug.r.debug(`[${_instanceId}] validate() triggered, foreground = ${isForeground}`);

    let ret = true;

    const invalidFieldNames: string[] = [];

    for (const [name, field] of _fields) {
      _used(name);
      const isValidated = await field.validate(isForeground);
      if (!isValidated) {
        invalidFieldNames.push(name);
        ret = false;
      }
    }

    // Trigger autofocus to (first) invalid field
    if (isForeground) {
      nextTick(async () => {
        for (const invalidFieldName of invalidFieldNames) {
          const invalidField = _fields.get(invalidFieldName);
          if (!invalidField) continue;

          if (await invalidField.focus()) return;
        }
      });
    }

    // Save and return
    _isSubmittable.value = ret;
    return ret;
  }


  /**
   * Evaluate last validity of entire form
   * @returns
   */
  function _evaluateLastValidity(): boolean {
    let ret = true;

    for (const [name, field] of _fields) {
      _used(name);
      if (!field.evaluateLastValidity()) {
        debug.r.log(`_evaluateLastValidity will be false due to: ${name}`);
        ret = false;
        break; // Save CPU cycles
      }
    }

    return ret;
  }
  //#endregion

  //#region Create service interface
  options.getServiceFn({
    /**
     * @inheritdoc
     */
    registerFormItem(required: boolean, stringMode: VanyFormValidateStringMode, arrayMode: VanyFormValidateArrayMode, trigger: VanyFormValidateTrigger|undefined, subjectLabel: string|Stringable|undefined): VanyFormItemRenderService {
        // Current registration
        let _registeredField: FormField|null = null;

        // Last validation handle
        let _lastValidationResultFn: VanyValidatedResultFunction|null = null;

        // Standardize deregistration function
        const onDeregister: DeregisterFunction = (source: string) => {
          if (_registeredField === null) return;
          debug.r.debug(`[${_instanceId}] Deregistering '${_registeredField.formName}' initialized from ${source}`);
          _deregisterFormItemControl(_registeredField);
          _registeredField = null;
        };

        // Expose interface
        return {
          /**
           * @inheritdoc
           */
          registerControl(name: string, fwdFocus?: VanyCallable<void, Promise<boolean>>, parentState?: VanyRegisteredFormItemRenderService): VanyRegisteredFormItemRenderService|null {
            if (_registeredField !== null) return null;

            _registeredField = _registerFormItemControl(name, required, stringMode, arrayMode, trigger, subjectLabel, fwdFocus, parentState);
            if (_registeredField === null) return null;

            // Post registration if needed
            if (_lastValidationResultFn !== null) _registeredField.subscribeValidationResult(_lastValidationResultFn);

            // Wrap the control into a handle and return
            debug.r.debug(`[${_instanceId}] Registered '${_registeredField.formName}'${ parentState ? ' with parent' : ''}`);
            return _createFormItemControlHandle(_registeredField, onDeregister);
          },

          /**
           * @inheritdoc
           */
          onValidated(fn: VanyValidatedResultFunction): void {
            _lastValidationResultFn = fn;
            _registeredField?.subscribeValidationResult(fn);
          },

          /**
           * @inheritdoc
           */
          notifyRequired(required: boolean): void {
            if (!_registeredField) {
              debug.r.warn(`[${_instanceId}] notifyRequired() called without registeredField, ignored`);
              return;
            }

            // Update flags
            debug.r.log(`[${_instanceId}] Updating '${_registeredField.formName}' required`, required);
            const oldRequired = _registeredField.isRequired;
            _registeredField.isRequired = required;

            // Revalidate when actually changed
            if (oldRequired != _registeredField.isRequired) _queueRevalidate();
          },

          /**
           * @inheritdoc
           */
          notifyBeforeUnmount(): void {
            onDeregister('item-handle');
          },
        }
    },
  });
  //#endregion

  //#region First run
  nextTick(async () => {
    debug.r.log(`[${_instanceId}] initial nextTick()`, {
      modelValue: options.modelValue,
      fields: _fields,
    });

    // Re-evaluate
    _isSubmittable.value = _evaluateLastValidity();
  });
  //#endregion

  //#region Create and return instance
  return {
    /**
     * @inheritdoc
     */
    isSubmitDisabled: computed(() => {
      return !_isSubmittable.value;
    }),

    /**
     * @inheritdoc
     */
    isDirty: computed(() => {
      return _isDirty.value;
    }),

    /**
     * @inheritdoc
     */
    async reset(): Promise<void> {
      debug.r.debug(`[${_instanceId}] reset()`);

      for (const [name, field] of _fields) {
        _used(name);
        field.clearValidate();
      }

      _isDirty.value = false;
    },

    /**
     * @inheritdoc
     */
    async autoFocus(): Promise<boolean> {
      for (const [name, field] of _fields) {
        _used(name);
        if (await field.focus()) return true;
      }

      return false;
    },

    /**
     * @inheritdoc
     */
    async validate(isForeground?: boolean): Promise<boolean> {
      const _isForeground = isForeground ?? DEFAULT_ISFOREGROUND;
      return await _validate(_isForeground);
    }
  };
  //#endregion
}
//#endregion