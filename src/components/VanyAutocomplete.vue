<script setup lang="ts">
//#region Imports
import {
  provide,
  useAttrs,
} from 'vue';

import {
  KEY as autocompleteStateKey,
  createAutocompleteState,
} from '../states/autocompleteState';

import VanyAutocompleteRenderRequest from './requests/VanyAutocompleteRenderRequest';
import VanyAutocompleteKeywordFunctionForwarder from '../internals/comps/VanyAutocompleteKeywordFunctionForwarder';
import VanyAutocompleteKeyboardEventFunctionForwarder from '../internals/comps/VanyAutocompleteKeyboardEventFunctionForwarder';

import { type VanyAutocompleteFilterFunction } from '../types/VanyAutocompleteFilterFunction';
import { type VanyAutocompleteItemContext } from '../types/VanyAutocompleteItemContext';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
import VanyFunctionForwarder from '../internals/comps/VanyFunctionForwarder';
//#endregion

//#region Component definition
const props = defineProps<{
  /**
   * Filtering function
   */
  filter: VanyAutocompleteFilterFunction,
  /**
   * Debounce timer (in milliseconds)
   * @defaultValue 350
   */
  debounce?: number;
  /**
   * Maximum height before scroll
   */
  scrollHeight?: number|string;
  /**
   * If autocomplete (keyword handling) is to be triggered manually
   * @defaultValue false
   */
  manualTrigger?: boolean;
  /**
   * If to automatically select first item when candidate available
   * @defaultValue false
   */
  autoSelect?: boolean;
}>();

const emits = defineEmits<{
  /**
   * A specific autocomplete option is selected
   */
  'selected': [value: any|null, isSelected: boolean],
}>();

const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Autocomplete trigger
   */
  default: () => any,
  /**
   * Item template
   */
  item: (context: VanyAutocompleteItemContext) => any,
}>();
//#endregion

//#region Internal setup
// Register functions
const fwdNotifyKeyword = new VanyAutocompleteKeywordFunctionForwarder();
const fwdNotifyControlKeyDown = new VanyAutocompleteKeyboardEventFunctionForwarder();
const fwdNotifyControlKeyUp = new VanyAutocompleteKeyboardEventFunctionForwarder();
const fwdNotifyControlBlur = new VanyFunctionForwarder<void, void>(() => { });

// Provide autocomplete state (unless manual trigger)
if (!(props.manualTrigger ?? false)) {
  provide(autocompleteStateKey, createAutocompleteState(fwdNotifyKeyword));
}
//#endregion

//#region Exposed functions
/**
 * Notify that autocomplete keyword is updated
 * @param keyword
 */
function notifyKeyword(keyword: string): void {
  fwdNotifyKeyword.call(keyword);
}


/**
 * Notify that a keyboard event from the control
 * @param ev
 */
function notifyControlKeyDown(ev: KeyboardEvent): void {
  fwdNotifyControlKeyDown.call(ev);
}


/**
 * Notify that a keyboard event from the control
 * @param ev
 */
function notifyControlKeyUp(ev: KeyboardEvent): void {
  fwdNotifyControlKeyUp.call(ev);
}


/**
 * Notify that relevant control had lost focus
 */
function notifyControlBlur(): void {
  fwdNotifyControlBlur.call();
}


defineExpose({
  notifyKeyword,
  notifyControlKeyDown,
  notifyControlKeyUp,
  notifyControlBlur,
});
//#endregion

//#region Renderer
const render = () => {
  const request: VanyAutocompleteRenderRequest = {
    vanyClass: 'autocomplete',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    filter: props.filter,
    notifySelected: (value: any|null, isSelected: boolean) => {
      emits('selected', value, isSelected);
    },
    fwdNotifyKeyword: fwdNotifyKeyword,
    fwdNotifyControlKeyDown: fwdNotifyControlKeyDown,
    fwdNotifyControlKeyUp: fwdNotifyControlKeyUp,
    fwdNotifyControlBlur: fwdNotifyControlBlur,
    debounceMs: props.debounce ?? 350,
    autoSelect: props.autoSelect ?? false,
    scrollHeight: props.scrollHeight,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>