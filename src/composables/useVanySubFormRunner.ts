import {
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  provide,
} from 'vue';

import {
  type Ref as MinRef,
} from '@xirelogy/vue-minimal';

import {
  type Stringable,
  xw,
} from '@xirelogy/xwts';

const debug = xw.debugLog.defineLazy('Vany.[useVanySubFormRunner]');

import vanyI18nInit from '../internals/locale-setup';
const _l = vanyI18nInit('useVanySubFormRunner');

import { VanyCodec, VanyCodecOptions } from '../codecs/VanyCodec';
import { VanyFormControlNature } from '../types/VanyFormControlNature';
import { VanyFormValidateTrigger } from '../types/VanyFormValidateTrigger';
import { VanyFormValidateStringMode } from '../types/VanyFormValidateStringMode';
import { VanyFormValidateArrayMode } from '../types/VanyFormValidateArrayMode';
import { VanyValidatedResultFunction } from '../types/VanyValidatedResultFunction';
import { VanyInputChangeEventFunction } from '../types/VanyInputChangeEventFunction';
import { VanyInputInputEventFunction } from '../types/VanyInputInputEventFunction';
import { useVanyFormControlServiceHost } from './useVanyFormControlServiceHost';
import { useVanySnapshotEqual, type PrimitiveType } from './useVanySnapshotEqual';
import { useVanyInputFrameService } from './useVanyInputFrameService';
import VanySubFormRunner from '../features/VanySubFormRunner';
import VanyFormItemRenderService from '../components/services/VanyFormItemRenderService';
import VanyRegisteredFormItemRenderService from '../components/services/VanyRegisteredFormItemRenderService';
import VanyCallable from '../features/VanyCallable';
import VanyServiceable from '../features/VanyServiceable';
import VanyServiceProvider from '../internals/VanyServiceProvider';
import {
  KEY as VanyRegisteredFormItemRemoteServiceKey,
  VanyRegisteredFormItemRemoteService,
} from '../internals/services/VanyRegisteredFormItemRemoteService';
import {
  KEY as formItemStateKey,
  createFormItemState,
} from '../states/formItemState';


/**
 * Configuration for individual sub-controls
 */
export interface VanySubControlConfig {
  /**
   * Subject label for the control
   * Used in validation error messages
   */
  subjectLabel?: string | Stringable;

  /**
   * Validation mode for string values
   * @defaultValue 'rejectEmpty'
   */
  validateStringMode?: VanyFormValidateStringMode;

  /**
   * Validation mode for array values
   * @defaultValue 'rejectEmpty'
   */
  validateArrayMode?: VanyFormValidateArrayMode;

  /**
   * Validation trigger for this control
   * If not specified, uses defaultValidateTrigger from options
   */
  validateTrigger?: VanyFormValidateTrigger;
}

/**
 * Options for useVanySubFormRunner
 * @template BT Business type (parent model value)
 * @template DT Display type (form data for sub-controls)
 */
export interface UseVanySubFormRunnerOptions<BT, DT extends Record<string, any>> {
  /**
   * Codec to transform between business type and display type
   * Supports both DT and DT|null
   */
  codec: VanyCodec<BT, DT | null>;

  /**
   * Initial form data (display type)
   * Used when currentValue is null or for reset
   */
  initialFormData: DT;

  /**
   * Default validation trigger
   * @defaultValue 'change'
   */
  defaultValidateTrigger?: VanyFormValidateTrigger;

  /**
   * Control nature
   * @defaultValue 'input'
   */
  controlNature?: VanyFormControlNature;

  /**
   * Optional function to normalize model value to PrimitiveType for comparison
   * This ensures type-safe comparison when checking for redundant value updates
   * @param value The model value to normalize
   * @returns Normalized value as PrimitiveType
   * @defaultValue Uses xw.flatten and forceful cast to PrimitiveType
   */
  modelValueNormalizer?: (value: BT) => PrimitiveType;

  /**
   * Optional ref to the control element (e.g., VanyInputGroup)
   * If provided, useVanySubFormRunner will automatically setup input frame service
   * to display validation errors on the control
   */
  controlRef?: any;

  /**
   * Optional configuration map for sub-controls
   * Key is the control name (field name in DT)
   * Value is the configuration for that specific control
   */
  subControlsConfig?: Partial<Record<keyof DT, VanySubControlConfig>>;
}


/**
 * Create a sub-form runner for composite controls
 *
 * This hook:
 * 1. Creates a form control service and registers with parent form
 * 2. Automatically handles upstream lifecycle (mount, watch, unmount)
 * 3. Automatically handles downstream binding (syncs DT to formData)
 * 4. Provides reactive formData for sub-controls
 * 5. Routes messages between parent form and sub-controls
 *
 * @template BT Business type (parent model value)
 * @template DT Display type (form data for sub-controls)
 * @param props Component props containing modelValue
 * @param options Configuration options
 * @returns Sub-form runner interface
 */
export function useVanySubFormRunner<BT, DT extends Record<string, any>>(
  props: { modelValue: BT; name?: string | null },
  options: UseVanySubFormRunnerOptions<BT, DT>
): VanySubFormRunner<BT, DT> {

  const _instanceId = xw.random.lowerAlphanumString(8);

  //#region Model value normalizer
  const normalizeModelValue = options.modelValueNormalizer ?? ((value: BT): PrimitiveType => {
    // Default: flatten and forcefully cast to PrimitiveType
    return xw.flatten(value) as PrimitiveType;
  });
  //#endregion


  //#region State tracking
  const formData = ref<DT>(structuredClone(options.initialFormData));

  // Track last synced value to prevent circular updates
  let _lastSyncedDisplayValue: DT | null = null;

  // Track last emitted business value to prevent redundant event forwarding (as PrimitiveType)
  let _lastEmittedBusinessValue: PrimitiveType | null = null;

  // Map to track registered sub-controls
  const _registeredControls = new Map<string, {
    name: string;
    required: boolean;
    lastValidation: boolean | Error | null;
  }>();

  // Placeholder for evaluation function (will be defined after downstream is available)
  let _evaluateAndNotifyValidation: () => void;

  // Store pending validation error from sub-controls (to be thrown by codec)
  let _pendingValidationError: Error | null = null;
  //#endregion


  //#region Virtual form item service

  // Create a virtual form item service that sub-controls can register with directly
  // This bypasses the need for VanyFormItem wrapper
  const virtualFormItemService: VanyFormItemRenderService = {
    registerControl(
      name: string,
      _fwdFocus?: VanyCallable<void, Promise<boolean>>,
      _parentState?: VanyRegisteredFormItemRenderService
    ): VanyRegisteredFormItemRenderService | null {
      debug.r.debug(`[${_instanceId}] Sub-control registered: ${name}`);

      // Track the registered control
      _registeredControls.set(name, {
        name,
        required: false, // Default to not required
        lastValidation: null,
      });

      // Create service provider for negotiation
      const _services = new VanyServiceProvider();

      // Get configuration for this specific control
      const controlConfig = options.subControlsConfig?.[name as keyof DT];

      // Create VanyRegisteredFormItemRemoteService for this control
      const remoteService: VanyRegisteredFormItemRemoteService = {
        vanyServiceClass: 'VanyRegisteredFormItemRemoteService',

        get subjectLabel(): string | Stringable | undefined {
          return controlConfig?.subjectLabel ?? name; // Use configured label or control name
        },

        get validateStringMode(): VanyFormValidateStringMode {
          return controlConfig?.validateStringMode ?? 'rejectEmpty'; // Use configured or default
        },

        get validateArrayMode(): VanyFormValidateArrayMode {
          return controlConfig?.validateArrayMode ?? 'rejectEmpty'; // Use configured or default
        },

        get validateTrigger(): VanyFormValidateTrigger | undefined {
          return controlConfig?.validateTrigger ?? options.defaultValidateTrigger ?? 'change';
        },

        registerNotifyingValidator(_fn): void {
          debug.r.debug(`[${_instanceId}] Sub-control '${name}' registered notifying validator`);
          // Validator registered - validation will happen through notifyValidated
        },

        notifyChange(): void {
          debug.r.debug(`[${_instanceId}] Sub-control '${name}' notified change`);
        },

        notifyValidated(result: boolean | Error, isForeground?: boolean): void {
          debug.r.debug(`[${_instanceId}] Sub-control '${name}' validation result:`, {
            result: result instanceof Error ? result.message : result,
            isForeground: isForeground ?? true,
          });

          const control = _registeredControls.get(name);
          if (control) {
            control.lastValidation = result;

            // Re-evaluate all sub-controls and notify upwards
            _evaluateAndNotifyValidation();
          }
        },
      };

      _services.registerService(VanyRegisteredFormItemRemoteServiceKey, remoteService);

      // Return a virtual registered control handle
      return {
        name,

        negotiate<T extends VanyServiceable = VanyServiceable>(ident: Symbol): T | null {
          return _services.negotiator.negotiate<T>(ident);
        },

        onValidated(fn: VanyValidatedResultFunction): void {
          debug.r.debug(`[${_instanceId}] Sub-control '${name}' registered validation callback`);
          // Store the callback - it will be called by the control's validation
          fn(null, ''); // Initialize with null state
        },

        notifyBeforeUnmount(): void {
          debug.r.debug(`[${_instanceId}] Sub-control '${name}' unmounting`);
          _registeredControls.delete(name);
        },
      };
    },

    onValidated(_fn: VanyValidatedResultFunction): void {
      debug.r.debug(`[${_instanceId}] Form item registered validation callback`);
    },

    notifyRequired(required: boolean): void {
      debug.r.debug(`[${_instanceId}] Form item required changed: ${required}`);
    },

    notifyBeforeUnmount(): void {
      debug.r.debug(`[${_instanceId}] Form item unmounting`);
    },
  };

  // Provide virtual form item service directly via formItemStateKey
  // This allows sub-controls to register without VanyFormItem wrapper
  provide(formItemStateKey, createFormItemState(virtualFormItemService));
  debug.r.debug(`[${_instanceId}] Virtual form item context provided`);
  //#endregion


  //#region Parent form service host

  // Wrap the codec to inject sub-control validation errors
  const wrappedCodec = new class extends VanyCodec<BT, DT | null> {
    async parse(value: DT | null, codecOptions?: VanyCodecOptions): Promise<BT | null> {
      // Check if there's a pending validation error from sub-controls
      // Don't clear it here - it persists until sub-controls become valid
      if (_pendingValidationError !== null) {
        throw _pendingValidationError;
      }
      // Otherwise, use the original codec
      const result = options.codec.parse(value, codecOptions);
      return result instanceof Promise ? await result : result;
    }

    format(value: BT | null, codecOptions?: VanyCodecOptions): DT | null {
      // If parent sends null while we have pending error, clear error and reset formData
      if (value === null && _pendingValidationError !== null) {
        _pendingValidationError = null;
        // Reset formData to initial values
        Object.assign(formData.value, structuredClone(options.initialFormData));
        _lastSyncedDisplayValue = null;
      }
      return options.codec.format(value, codecOptions);
    }
  };

  const formControlService = useVanyFormControlServiceHost<BT, DT | null>({
    nameAttr: props.name,
    currentValue: props.modelValue,
    codec: wrappedCodec,
    defaultValidateTrigger: options.defaultValidateTrigger ?? 'change',
    controlNature: options.controlNature ?? 'input',
  });
  //#endregion


  //#region Upstream connection (lifecycle hooks)
  const upstream = formControlService.upstream;

  onMounted(() => {
    upstream.notifyMounted(props.modelValue);
  });

  watch(() => props.modelValue, (newValue) => {
    // Special case: if parent sends null and we have pending validation error,
    // clear the error and reset formData (e.g., "Set empty" button clicked)
    if (newValue === null && _pendingValidationError !== null) {
      _pendingValidationError = null;
      Object.assign(formData.value, structuredClone(options.initialFormData));
      _lastSyncedDisplayValue = null;
      // Trigger validation to clear the error from UI
      downstream.notifyEvent('change');
    }
    upstream.notifyWatch(newValue);
  });

  onBeforeUnmount(() => {
    upstream.notifyBeforeUnmount();
  });
  //#endregion


  //#region Downstream binding and validation
  const downstream = formControlService.downstream;

  // Setup input frame service if controlRef is provided
  if (options.controlRef) {
    const inputFrameService = useVanyInputFrameService(options.controlRef);
    downstream.onValidated(inputFrameService.notifyValidated);
  }

  // Define validation evaluation function (needs downstream to be available)
  _evaluateAndNotifyValidation = () => {
    const controls = Array.from(_registeredControls.values());

    if (controls.length === 0) {
      // No sub-controls registered yet
      return;
    }

    const errors: string[] = [];
    let allValid = true;
    let hasError = false;

    for (const control of controls) {
      if (control.lastValidation === null || control.lastValidation === false) {
        // Validation not run yet or empty value
        allValid = false;
      } else if (control.lastValidation instanceof Error) {
        // Validation error
        allValid = false;
        hasError = true;
        errors.push(control.lastValidation.message);
      }
      // else lastValidation === true, control is valid
    }

    debug.r.debug(`[${_instanceId}] Validation evaluation:`, {
      allValid,
      hasError,
      errors,
      controlsCount: controls.length,
    });

    // Notify upwards via downstream service
    if (allValid) {
      // All sub-controls are valid, trigger change event to validate composite upwards
      debug.r.debug(`[${_instanceId}] All sub-controls valid, triggering change event upwards`);
      // Clear any pending error
      _pendingValidationError = null;
      downstream.notifyEvent('change');
    } else if (hasError) {
      // Has validation errors, combine and notify
      const combinedError = errors.join(String(_l('; ')));
      debug.r.debug(`[${_instanceId}] Sub-controls have errors, notifying upwards:`, combinedError);
      // Store the combined error so the wrapped codec can throw it
      _pendingValidationError = new Error(combinedError);
      // Trigger change event so composite control validates
      // The wrapped codec will throw the pending error
      downstream.notifyEvent('change');
    } else {
      // No errors from sub-controls, but not all validated yet (e.g., all empty)
      // Clear pending error and trigger validation to let composite codec decide
      debug.r.debug(`[${_instanceId}] Sub-controls incomplete/empty, clearing error and re-validating`);
      _pendingValidationError = null;
      downstream.notifyEvent('change');
    }
  };

  downstream.modelValue.onWatch((displayValue: DT | null) => {
    // Check if this is the same value we just sent - prevent circular update
    // Exception: Allow null-to-null transitions for validation state changes
    if (displayValue !== null && _lastSyncedDisplayValue !== null) {
      if (useVanySnapshotEqual(displayValue, _lastSyncedDisplayValue)) {
        debug.r.debug(`[${_instanceId}] Downstream value matches last synced, skipping update to prevent loop`);
        return;
      }
    }

    debug.r.debug(`[${_instanceId}] Downstream value changed, syncing to formData:`, displayValue);

    if (displayValue !== null) {
      // Sync display value to formData
      // Use xw.flatten to convert to plain object before storing (handles reactive proxies)
      _lastSyncedDisplayValue = xw.flatten(displayValue) as DT;
      Object.assign(formData.value, displayValue);
    } else {
      // Reset to initial data
      _lastSyncedDisplayValue = null;
      Object.assign(formData.value, structuredClone(options.initialFormData));
    }
  });
  //#endregion


  //#region FormData change watcher
  watch(formData, (newFormData) => {
    // Flatten reactive proxy to plain object for comparison
    const plainFormData = xw.flatten(newFormData) as DT;

    // Check if formData matches what we just synced from downstream - prevent circular update
    if (_lastSyncedDisplayValue !== null && useVanySnapshotEqual(plainFormData, _lastSyncedDisplayValue)) {
      debug.r.debug(`[${_instanceId}] formData matches last synced value, skipping update to prevent loop`);
      return;
    }

    debug.r.debug(`[${_instanceId}] formData changed by user, notifying downstream:`, plainFormData);

    // Update tracking before notifying to prevent echo
    // Store flattened version (non-reactive)
    _lastSyncedDisplayValue = plainFormData;

    // Notify downstream that value was updated
    // This triggers codec.parse() and validation
    downstream.modelValue.notifyUpdate(newFormData);
  }, { deep: true });
  //#endregion


  //#region Upstream wrapper (with event pre-handling)
  const upstreamWrapper = {
    notifyBeforeUnmount: () => upstream.notifyBeforeUnmount(),
    notifyMounted: (modelValue: BT | null) => upstream.notifyMounted(modelValue),
    notifyWatch: (modelValue: BT | null) => upstream.notifyWatch(modelValue),
    notifyFocus: () => upstream.notifyFocus(),

    onUpdateModelValueEvent: (fn: (value: BT | null) => void) => {
      // Wrap the callback to check before forwarding
      upstream.onUpdateModelValueEvent((value: BT | null) => {
        // Normalize model value for comparison using provided or default normalizer
        const normalizedValue = value !== null ? normalizeModelValue(value) : null;

        // Check if this is the same value we last emitted (only when both are non-null)
        // Exception: Allow null-to-null transitions for validation state changes
        if (_lastEmittedBusinessValue !== null && normalizedValue !== null) {
          // Use useVanySnapshotEqual for type-safe comparison of PrimitiveType
          if (useVanySnapshotEqual(normalizedValue, _lastEmittedBusinessValue)) {
            debug.r.debug(`[${_instanceId}] Business value unchanged, skipping onUpdateModelValueEvent forwarding`);
            return; // Skip forwarding
          }
        }

        debug.r.debug(`[${_instanceId}] Business value changed, forwarding onUpdateModelValueEvent:`, normalizedValue);

        // Update tracking with normalized value
        _lastEmittedBusinessValue = normalizedValue;

        // Forward to user callback
        fn(value);
      });
    },

    onChangeEvent: (fn: VanyInputChangeEventFunction<BT, DT | null>) => upstream.onChangeEvent(fn),
    onInputEvent: (fn: VanyInputInputEventFunction) => upstream.onInputEvent(fn),
  };
  //#endregion


  //#region Return interface
  return {
    formData: formData as MinRef<DT>,
    upstream: upstreamWrapper,

    subName(fieldName: keyof DT): string {
      // Return local name (not prefixed)
      // Sub-controls can use this for their name attribute
      return String(fieldName);
    },
  };
  //#endregion
}
