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

import { type VanyAutocompleteFilterFunction } from '../types/VanyAutocompleteFilterFunction';
import { type VanyAutocompleteItemContext } from '../types/VanyAutocompleteItemContext';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
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


defineExpose({
  notifyKeyword,
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
    debounceMs: props.debounce ?? 350,
    scrollHeight: props.scrollHeight,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>