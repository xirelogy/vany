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

import VanyPopupRenderRequest from './requests/VanyPopupRenderRequest';

import { VanyModelValue } from './supports/VanyModelValue';
import VanyPopupRenderService from './services/VanyPopupRenderService';

import VanyServiceProvider from '../internals/VanyServiceProvider';
import createVanyModelValueHost from '../internals/createVanyModelValueHost';

import {
  KEY as VanyModalRemoteServiceKey,
} from '../internals/services/VanyModalRemoteService';
import createVanyModalRemoteService from '../internals/createVanyModalRemoteService';

import { type VanyModalEvent } from '../types/VanyModalEvent';
import { type VanyPopupTriggerType } from '../types/VanyPopupTriggerType';
import { type VanyPopupPlacementType } from '../types/VanyPopupPlacementType';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';

import vanyI18nInit from '../internals/locale-setup';
const _l = vanyI18nInit('VanyPopup');
//#endregion

//#region Component definition
const props = withDefaults(defineProps<{
  /**
   * Model value bind to popup visibility
   */
  modelValue?: boolean,
  /**
   * How the popup is triggered
   * @defaultValue 'hover'
   */
  trigger?: VanyPopupTriggerType,
  /**
   * Popup placement
   * @defaultValue 'bottom'
   */
  placement?: VanyPopupPlacementType,
  /**
   * Popup width
   * @defaultValue 200
   */
  width?: number|string;
  /**
   * Popup classes
   * @defaultValue undefined
   */
  popupClass?: string,
}>(), {
  modelValue: false,
  trigger: 'hover',
  placement: 'bottom',
  width: 200,
});

const emits = defineEmits<{
  /**
   * Model value (showing state) updated
   */
  'update:modelValue': [value: boolean],
  /**
   * Popup show (start)
   */
  show: [],
  /**
   * Popup shown
   */
  shown: [],
  /**
   * Popup hide (start)
   */
  hide: [],
  /**
   * Popup hidden
   */
  hidden: [],
}>();

const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Popup content
   */
  default: () => any,
  /**
   * Reference trigger
   */
  reference: () => any,
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
const renderService: VanyPopupRenderService = {
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
const modalRemoteService = createVanyModalRemoteService(modelValueHost, eventBrokers, _l('Popup'));
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
  const request: VanyPopupRenderRequest = {
    vanyClass: 'popup',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    trigger: props.trigger,
    placement: props.placement,
    width: props.width,
    popupClass: props.popupClass,
    _render: renderService,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>
