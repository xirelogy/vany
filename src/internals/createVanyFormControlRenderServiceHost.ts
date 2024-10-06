import {
  xw,
  _cast,
  _used,
} from '@xirelogy/xwts';

import { VanyCodec } from '../codecs/VanyCodec';
import VanyDummyCodec from '../codecs/VanyDummyCodec';
import { VanyCodecMessageContextSetup } from '../codecs/supports/VanyCodecMessageContextSetup';
import { VanyInvalidValueCodecError } from '../codecs/exceptions/VanyInvalidValueCodecError';
import { VanyValidationFailedError } from '../codecs/exceptions/VanyValidationFailedError';
import VanyRegisteredFormItemRenderService from '../components/services/VanyRegisteredFormItemRenderService';
import VanyFormControlRenderService from '../components/services/VanyFormControlRenderService';
import { VanyModelValue } from '../components/supports/VanyModelValue';
import VanyFormCodecMessageContext from '../features/VanyFormCodecMessageContext';
import { VanyFormControlRenderServiceHostable } from './interfaces/VanyFormControlRenderServiceHostable';
import VanyFocusFunctionForwarder from './comps/VanyFocusFunctionForwarder';
import { VanyFormControlNature } from '../types/VanyFormControlNature';
import { VanyFormEvent } from '../types/VanyFormEvent';
import { VanyFormValidateStringMode } from '../types/VanyFormValidateStringMode';
import { VanyFormValidateArrayMode } from '../types/VanyFormValidateArrayMode';
import { VanyFormValidateTrigger } from '../types/VanyFormValidateTrigger';
import { VanyInputChangeEventFunction } from '../types/VanyInputChangeEventFunction';
import { VanyInputInputEventFunction } from '../types/VanyInputInputEventFunction';
import { VanyValueForwardFunction } from '../types/VanyValueForwardFunction';
import { VanyValidatedResultFunction } from '../types/VanyValidatedResultFunction';

import {
  KEY as VanyRegisteredFormItemRemoteServiceKey,
  VanyRegisteredFormItemRemoteService,
} from './services/VanyRegisteredFormItemRemoteService';


/**
 * Handle result string (after parsing) according to string validation rule
 * @param value Incoming value
 * @param stringMode The corresponding string mode (strategy)
 * @returns Processed value
 */
function _handleString(value: string, stringMode: VanyFormValidateStringMode): string|null {
  if (stringMode === 'rejectEmpty' && value === '') return null;
  if (stringMode === 'rejectTrimEmpty' && value.trim() === '') return null;
  return value;
}


/**
 * Handle result array (after parsing) according to array validation rule
 * @param value Incoming value
 * @param arrayMode The corresponding array mode (strategy)
 * @returns Processed value
 */
function _handleArray(value: any[], arrayMode: VanyFormValidateArrayMode): any[]|null {
  if (arrayMode === 'rejectEmpty' && value.length < 1) return null;
  return value;
}


/**
 * Accept the value, expecting an error finally (for validation failure)
 * @param e
 * @returns
 */
function _acceptAsError(e: any): Error {
  if (e instanceof Error) return e;
  if (typeof e === 'string') return new Error(e);
  return new VanyValidationFailedError();
}


/**
 * Pre-parse value when value is updated
 * @param codec Associated codec
 * @param value Value to be parsed
 * @returns Parsed value
 */
function _preParse<BT, DT>(codec: VanyCodec<BT, DT>, value: DT|null): BT|Error|null {
  // Only directly parse when using dummy codec
  if (codec instanceof VanyDummyCodec) return codec.parse(value);

  // Otherwise, use a general error to prevent value being forwarde prematurely
  return new VanyValidationFailedError();
}


/**
 * Options to createVanyFormControlRenderServiceHost
 */
interface CreateVanyFormControlRenderServiceHostOptions<BT, DT> {
  /**
   * The current value for the control
   */
  currentValue: BT|null;
  /**
   * Handler function when value updated from UI
   */
  onUpdateValueFn: VanyValueForwardFunction<BT|null>;
  /**
   * Forwarder for focus()
   */
  fwdFocus: VanyFocusFunctionForwarder;
  /**
   * Associated conversion codec
   */
  codec: VanyCodec<BT, DT>;
  /**
   * Registered upwards control, if available
   */
  registeredControl?: VanyRegisteredFormItemRenderService|null;
  /**
   * Default validation trigger for this control
   */
  defaultValidateTrigger: VanyFormValidateTrigger;
  /**
   * Nature of the control
   */
  controlNature: VanyFormControlNature;
}


/**
 * Create a host for VanyFormControlRenderService
 * @param options Function options
 * @returns Created host
 */
export default function createVanyFormControlRenderServiceHost<BT, DT>(
  options: CreateVanyFormControlRenderServiceHostOptions<BT, DT>
): VanyFormControlRenderServiceHostable<BT, DT> {

  //#region Initialize variables
  // Service reflection
  const _registeredService = options.registeredControl?.negotiate<VanyRegisteredFormItemRemoteService>(VanyRegisteredFormItemRemoteServiceKey);
  // Current value
  let _currentValue: DT|null = options.codec.format(options.currentValue);
  // Current bad value (a value that must cause validation to reject)
  let _currentBadValue: DT|undefined = undefined;
  // Forwarder function for get value (from data layer to UI display)
  let _onForwardSetValueFn: VanyValueForwardFunction<DT|null> = () => {};
  // Forwarder function for change event
  let _onChangeEventFn: VanyInputChangeEventFunction<BT, DT> = () => {};
  // Forwarder function for input event
  let _onInputEventFn: VanyInputInputEventFunction = () => {};
  // String validation mode
  let _validateStringMode: VanyFormValidateStringMode = _registeredService?.validateStringMode ?? 'rejectEmpty';
  // Array validation mode
  let _validateArrayMode: VanyFormValidateArrayMode = _registeredService?.validateArrayMode ?? 'rejectEmpty';
  // Trigger for validation
  let _validateTrigger: VanyFormValidateTrigger = _registeredService?.validateTrigger ?? options.defaultValidateTrigger;
  // Control nature
  let _controlNature: VanyFormControlNature|undefined = options.controlNature;
  //#endregion


  //#region Function
  /**
   * If the given form event will trigger validation
   * @param eventType
   * @returns
   */
  function _isFormEventValidation(eventType: VanyFormEvent): boolean {
    if (_validateTrigger === 'input' && eventType === 'input') return true;
    if (_validateTrigger === 'blur' && eventType === 'blur') return true;
    if (_validateTrigger === 'change' && eventType === 'change') return true;
    return false;
  }


  /**
   * Call validator
   * @param displayValue
   * @returns
   */
  async function _callValidate(displayValue: DT|null): Promise<BT|null> {
    // Check for bad value
    if (_currentBadValue !== undefined && _currentBadValue === displayValue) {
      throw new VanyInvalidValueCodecError();
    }

    // Call parser (validator)
    let parsed = (await xw.asAsyncTarget(options.codec.parse(displayValue))) as BT|null;

    // Handle string
    if (typeof parsed === 'string') {
      parsed = _cast<BT|null>(_handleString(parsed, _validateStringMode));
    }

    // Handle empty arrays
    if (Array.isArray(parsed)) {
      parsed = _cast<BT|null>(_handleArray(parsed, _validateArrayMode));
    }

    return parsed;
  }


  /**
   * Run the validation and send out notification
   * @param isForeground
   */
  async function _runValidateAndNotify(isForeground?: boolean): Promise<boolean|Error> {
    // Setup the message context / environment
    const contextScope = VanyCodecMessageContextSetup.enterContext(
      VanyFormCodecMessageContext.createInstance(_registeredService?.subjectLabel, _controlNature)
    );

    try {
      const result = await _runValidate();
      _registeredService?.notifyValidated(result, isForeground);
      return result;
    } finally {
      contextScope.release();
    }
  }


  /**
   * Run the validation
   * @returns Validation result (true = success, false = empty, Error = failure)
   */
  async function _runValidate(): Promise<boolean|Error> {
    try {
      // Try parsing
      const parsed = await _callValidate(_currentValue);

      // Forward value
      options.onUpdateValueFn(parsed);

      // Evaluate result
      return parsed !== null;
    } catch (e) {
      // Convert into error
      return _acceptAsError(e);
    }
  }


  /**
   * Trigger validation in background
   */
  function _triggerValidateInBackground(): void {
    xw.fork(async () => {
      await _runValidateAndNotify(false);
    });
  }
  //#endregion

  //#region Initialization
  // Register the validator
  _registeredService?.registerNotifyingValidator(_runValidateAndNotify);

  // Trigger first validation
  _triggerValidateInBackground();
  //#endregion

  //#region Create objects
  // Model value service interface
  const _modelValue: VanyModelValue<DT|null> = {
    /**
     * @inheritdoc
     */
    onWatch(fn: (value: DT|null) => void): void {
      _onForwardSetValueFn = fn;
    },

    /**
     * @inheritdoc
     */
    notifyUpdate(value: DT|null): void {
      _currentValue = value;
      const ret = _preParse(options.codec, value);
      if (ret instanceof Error) return; // Do not forward if error
      options.onUpdateValueFn(ret);
    },
  };

  // Control service interface
  const _service: VanyFormControlRenderService<DT|null> = {
    /**
     * @inheritdoc
     */
    get modelValue(): VanyModelValue<DT|null> {
      return _modelValue;
    },

    /**
     * @inheritdoc
     */
    onFocus(fn: () => Promise<boolean>): void {
      options.fwdFocus.handleUsing(fn);
    },

    /**
     * @inheritdoc
     */
    onValidated(fn: VanyValidatedResultFunction): void {
      options.registeredControl?.onValidated(fn);
    },

    /**
     * @inheritdoc
     */
    notifyBadModelValue(modelValue: DT|null): void {
      if (modelValue === null) return;
      _currentBadValue = modelValue;
    },

    /**
     * @inheritdoc
     */
    notifyEvent(eventType: VanyFormEvent, args?: IArguments, payload?: any): void {
      // Trigger validation when condition met
      if (_isFormEventValidation(eventType)) {
        xw.fork(async () => {
          await _runValidateAndNotify();
        });
      }

      // Forward event
      if (eventType === 'change') {
        xw.fork(async () => {
          let tryParsed: BT|Error|null = null;
          try {
            tryParsed = await _callValidate(_currentValue);
          } catch (e) {
            tryParsed = _acceptAsError(e);
          }

          _onChangeEventFn(tryParsed, _currentValue, args);
        });
      }

      if (eventType === 'input') {
        _onInputEventFn(payload ?? '', args);
      }
    },
  };
  //#endregion

  /**
   * Forward the set value to target control
   * @param value
   */
  function _forwardSetValue(value: BT|null): void {
    // Try to format and forward
    const cachedValue = _currentValue;
    _currentValue = options.codec.format(value);
    _onForwardSetValueFn(_currentValue);

    // Allow bad values to become good
    if (_currentBadValue !== undefined && _currentBadValue !== _currentValue) {
      _currentBadValue = undefined;
    }

    // Revalidate when incoming value had changed
    if (cachedValue !== _currentValue) {
      _triggerValidateInBackground();
    }
  }

  return {
    /**
     * @inheritdoc
     */
    notifyMounted(modelValue: BT|null): void {
      _forwardSetValue(modelValue);
    },

    /**
     * @inheritdoc
     */
    notifyWatch(modelValue: BT|null): void {
      _forwardSetValue(modelValue);
    },

    /**
     * @inheritdoc
     */
    notifyBeforeUnmount(): void {
      options.registeredControl?.notifyBeforeUnmount();
    },

    /**
     * @inheritdoc
     */
    onChangeEvent(fn: VanyInputChangeEventFunction<BT, DT>): void {
      _onChangeEventFn = fn;
    },

    /**
     * @inheritdoc
     */
    onInputEvent(fn: VanyInputInputEventFunction): void {
      _onInputEventFn = fn;
    },

    /**
     * @inheritdoc
     */
    export(): VanyFormControlRenderService<DT|null> {
      return _service;
    },
  };
}