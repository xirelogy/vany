<script setup lang="ts">
//#region Imports
import {
  _used,
  XwEventBroker,
} from '@xirelogy/xwts';

import {
  onMounted,
  useAttrs,
  watch,
} from 'vue';

import VanyDialogRenderRequest from './requests/VanyDialogRenderRequest';

import { VanyModelValue } from './supports/VanyModelValue';
import VanyDialogRenderService from './services/VanyDialogRenderService';

import VanyServiceProvider from '../internals/VanyServiceProvider';
import createVanyModelValueHost from '../internals/createVanyModelValueHost';

import {
  KEY as VanyModalRemoteServiceKey,
} from '../internals/services/VanyModalRemoteService';
import createVanyModalRemoteService from '../internals/createVanyModalRemoteService';

import { type VanyModalEvent } from '../types/VanyModalEvent';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';

import vanyI18nInit from '../internals/locale-setup';
const _l = vanyI18nInit('VanyDialog');
//#endregion

//#region Component definition
const props = withDefaults(defineProps<{
  modelValue?: boolean,
}>(), {
  modelValue: false,
});

const emits = defineEmits<{
  /**
   * Model value (showing state) updated
   */
  'update:modelValue': [value: boolean],
  /**
   * Dialog show (start)
   */
  show: [],
  /**
   * Dialog shown
   */
  shown: [],
  /**
   * Dialog hide (start)
   */
  hide: [],
  /**
   * Dialog hidden
   */
  hidden: [],
}>();

const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Dialog content
   */
  default: () => any,
  /**
   * Dialog header
   */
  header?: () => any,
  /**
   * Dialog footer
   */
  footer?: () => any,
}>();
//#endregion

//#region Internal setup
// Host the model value and connect to current component
const modelValueHost = createVanyModelValueHost<boolean>({
  currentValue: props.modelValue,
  onUpdateValueFn: (value: boolean) => emits('update:modelValue', value),
});

onMounted(() => modelValueHost.notifyMounted(props.modelValue));
watch(() => props.modelValue, modelValueHost.notifyWatch);

// Setup the event brokers
const eventBrokers = new Map<VanyModalEvent, XwEventBroker<void>>();

// Setup event broker with emit function subscribed
function setupEventBroker(eventType: VanyModalEvent, emitFn: () => void) {
  const eventBroker = new XwEventBroker<void>();
  eventBroker.expose().subscribe(emitFn);

  eventBrokers.set(eventType, eventBroker);
}

setupEventBroker('show', () => emits('show'));
setupEventBroker('shown', () => emits('shown'));
setupEventBroker('hide', () => emits('hide'));
setupEventBroker('hidden', () => emits('hidden'));

// Create the render service
const renderService: VanyDialogRenderService = {
  /**
   * @inheritdoc
   */
  get modelValue(): VanyModelValue<boolean> {
    return modelValueHost.export();
  },

  /**
   * @inheritdoc
   */
  notifyEvent(eventType: VanyModalEvent) {
    eventBrokers.get(eventType)?.publish();
  },
};

// Prepare the service provider
const serviceProvider = new VanyServiceProvider();

// Register VanyModalRemoteService
const modalRemoteService = createVanyModalRemoteService(modelValueHost, eventBrokers, _l('Dialog'));
serviceProvider.registerService(VanyModalRemoteServiceKey, modalRemoteService);
//#endregion

//#region Exposed functions
/**
 * Service negotiator
 */
const serviceNegotiator = serviceProvider.negotiator;


defineExpose({
  serviceNegotiator,
});
//#endregion

//#region Renderer
const render = () => {
  const request: VanyDialogRenderRequest = {
    vanyClass: 'dialog',
    attrs: VanyRenderer.acceptAttrs(attrs),
    modelValue: props.modelValue,
    slots: slots,
    _render: renderService,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>