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

import VanyDrawerRenderRequest from './requests/VanyDrawerRenderRequest';

import { VanyModelValue } from './supports/VanyModelValue';
import VanyDrawerRenderService from './services/VanyDrawerRenderService';

import createVanyModelValueHost from '../internals/createVanyModelValueHost';

import { type VanyDrawerDockType } from '../types/VanyDrawerDockType';
import { type VanyDrawerEvent } from '../types/VanyDrawerEvent';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const props = withDefaults(defineProps<{
  /**
   * If drawer shown
   */
  modelValue?: boolean,
  /**
   * If close button shown
   * @defaultValue true
   */
  closeButton?: boolean,
  /**
   * If clicking outside closes the drawer
   * @defaultValue true
   */
  closeOutside?: boolean,
  /**
   * If escape key closes the drawer
   * @defaultValue true
   */
  closeEscape?: boolean,
  /**
   * If drawer shown with modal
   * @defaultValue true
   */
  modal?: boolean,
  /**
   * Dock type
   * @defaultValue 'right'
   */
  dock?: VanyDrawerDockType,
  /**
   * Style specification of the drawer size
   * @defaultValue undefined
   */
  size?: number|string;
}>(), {
  modelValue: false,
  closeButton: true,
  closeOutside: true,
  closeEscape: true,
  modal: true,
  dock: 'right',
});

const emits = defineEmits<{
  /**
   * Model value (showing state) updated
   */
   'update:modelValue': [value: boolean],
  /**
   * Drawer show (start)
   */
  show: [],
  /**
   * Drawer shown
   */
  shown: [],
  /**
   * Drawer hide (start)
   */
  hide: [],
  /**
   * Drawer hidden
   */
  hidden: [],
}>();

const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Drawer body
   */
  default: () => any,
  /**
   * Drawer header
   */
  header: () => any,
  /**
   * Drawer footer
   */
  footer: () => any,
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
const eventBrokers = new Map<VanyDrawerEvent, XwEventBroker<void>>();

// Setup event broker with emit function subscribed
function setupEventBroker(eventType: VanyDrawerEvent, emitFn: () => void) {
  const eventBroker = new XwEventBroker<void>();
  eventBroker.expose().subscribe(emitFn);

  eventBrokers.set(eventType, eventBroker);
}

setupEventBroker('show', () => emits('show'));
setupEventBroker('shown', () => emits('shown'));
setupEventBroker('hide', () => emits('hide'));
setupEventBroker('hidden', () => emits('hidden'));

// Create the render service
const renderService: VanyDrawerRenderService = {
  /**
   * @inheritdoc
   */
  get modelValue(): VanyModelValue<boolean> {
    return modelValueHost.export();
  },

  /**
   * @inheritdoc
   */
  notifyEvent(eventType: VanyDrawerEvent) {
    eventBrokers.get(eventType)?.publish();
  },
};
//#endregion

//#region Renderer
const render = () => {
  const request: VanyDrawerRenderRequest = {
    vanyClass: 'drawer',
    attrs: VanyRenderer.acceptAttrs(attrs),
    modelValue: props.modelValue,
    slots: slots,
    closeButton: props.closeButton,
    closeOutside: props.closeOutside,
    closeEscape: props.closeEscape,
    modal: props.modal,
    dock: props.dock,
    size: props.size,
    _render: renderService,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>