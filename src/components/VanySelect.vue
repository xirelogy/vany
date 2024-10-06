<script setup lang="ts" generic="T = string">
//#region Imports
import {
  _cast,
  Stringable,
  xw,
  XwError,
} from '@xirelogy/xwts';

import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  watch,
} from 'vue';

import {
  useAppStateRaiseError,
} from '../states/appState';

import VanySelectRenderRequest from './requests/VanySelectRenderRequest';

import { useFormItemStateRenderService } from '../states/formItemState';
import VanySelectOptionManageable from '../features/VanySelectOptionManageable';
import VanyRegisteredFormItemRenderService from './services/VanyRegisteredFormItemRenderService';
import createVanyFormControlRenderServiceHost from '../internals/createVanyFormControlRenderServiceHost';
import createVanySelectRenderServiceHost from '../internals/createVanySelectRenderServiceHost';
import VanyFocusFunctionForwarder from '../internals/comps/VanyFocusFunctionForwarder';
import { VanyCodec } from '../codecs/VanyCodec';
import VanyDummyCodec from '../codecs/VanyDummyCodec';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const props = withDefaults(defineProps<{
  name?: string|null,
  modelValue?: T|null,
  codec?: VanyCodec<T, string>|null,
  disabled?: boolean,
  placeholder?: Stringable|string,
  manager?: VanySelectOptionManageable,
}>(), {
  name: null,
  modelValue: null,
  codec: null,
  disabled: false,
});

const emits = defineEmits<{
  'update:modelValue': [value: T|null],
  'change': [value: T|Error|null, rawValue?: string|null, context?: any],
}>();

const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Select options
   */
  default: () => any,
}>();
//#endregion

//#region Internal setup
// Register functions
const fwdFocus = new VanyFocusFunctionForwarder();

// Register the current select control
let renderService: VanyRegisteredFormItemRenderService|null = null;
if (typeof props.name === 'string') {
  renderService = useFormItemStateRenderService()?.registerControl(props.name, fwdFocus) ?? null;
}

// Create the host
const serviceHost = createVanyFormControlRenderServiceHost<T, string>({
  currentValue: props.modelValue,
  onUpdateValueFn: (value: T|null) => {
    emits('update:modelValue', value);
  },
  fwdFocus,
  codec: props.codec ?? _cast<VanyCodec<T, string>>(new VanyDummyCodec<string>),
  registeredControl: renderService,
  defaultValidateTrigger: 'change',
  controlNature: 'select',
});

serviceHost.onChangeEvent((value: T|Error|null, rawValue?: string|null, context?: any) => {
  emits('change', value, rawValue, context);
});

// Connect to the host
onMounted(() => serviceHost.notifyMounted(props.modelValue));
watch(() => props.modelValue, serviceHost.notifyWatch);
onBeforeUnmount(serviceHost.notifyBeforeUnmount);

// Create reference
const refCtrl = ref();

// Create managed select options rendering host
const managedServiceHost = props.manager ? createVanySelectRenderServiceHost({ manager: props.manager }) : null;

// Create and link the app error handler
const raiseError = useAppStateRaiseError<string>((context: string) => {
  return {
    vanyClass: 'select',
    el: refCtrl.value,
    scope: context,
  };
});

// Connect to the managed select options
if (props.manager && managedServiceHost) {
  // Handle autoload
  if (props.manager!.autoload) {
    nextTick(async () => {
      try {
        await managedServiceHost.triggerRefreshOptions();
      } catch (e) {
        raiseError('triggerRefreshOptions', XwError.asError(e));
      }
      if (props.manager!.autoselect) {
        nextTick(() => {
          try {
            managedServiceHost.triggerEnsureSelect();
          } catch (e) {
            raiseError('triggerEnsureSelect', XwError.asError(e));
          }
        });
      }
    });
  }
}
//#endregion

//#region Exposed functions
/**
 * Focus into the input
 * @returns
 */
async function focus(): Promise<boolean> {
  return fwdFocus.call();
}


/**
 * Refresh the available options
 */
async function refreshOptions(): Promise<void> {
  await managedServiceHost?.triggerRefreshOptions();
}


defineExpose({
  focus,
  refreshOptions,
});
//#endregion

//#region Renderer
const render = () => {
  const request: VanySelectRenderRequest = {
    vanyClass: 'select',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    name: props.name,
    placeholder: xw.normalizeString(props.placeholder ?? null),
    disabled: props.disabled,
    _render: serviceHost.export(),
    _renderManaged: managedServiceHost?.export() ?? null,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render ref="refCtrl" />
</template>