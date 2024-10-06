<script setup lang="ts">
//#region Imports
import {
  provide,
  useAttrs,
} from 'vue';

import {
  _used,
} from '@xirelogy/xwts';

import VanyMenuRenderRequest from './requests/VanyMenuRenderRequest';

import { type VanyMenuTemplateType } from '../types/VanyMenuTemplateType';
import type VanyMenuRenderService from './services/VanyMenuRenderService';

import {
  KEY as menuStateKey,
  createMenuState,
} from '../states/menuState';

import {
  KEY as menuContainerStateKey,
  createMenuContainerState,
} from '../states/menuContainerState';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const props = withDefaults(defineProps<{
  /**
   * Menu template type
   * @defaultValue 'horizontal'
   */
  template?: VanyMenuTemplateType,
  /**
   * If menu is shown compact
   * @defaultValue false
   */
  compact?: boolean,
}>(), {
  template: 'horizontal',
  compact: false,
});

const emits = defineEmits<{
  /**
   * Menu item within current menu selected
   */
  'selected': [menuKey: string],
}>();

const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Menu items
   */
  default: () => any,
}>();
//#endregion

//#region Internal setup
type AsyncSelectFunction = (menuKey: string) => Promise<void>;

// Selection listener
let onSelectFunction: AsyncSelectFunction = async (menuKey: string) => {
  _used(menuKey);
}

// Create render service and register
const renderService: VanyMenuRenderService = {
  /**
   * @inheritdoc
   */
  onSelect(fn: AsyncSelectFunction): void {
    onSelectFunction = fn;
  },

  /**
   * @inheritdoc
   */
  notifySelected(menuKey?: string): void {
    if (menuKey === undefined) return;
    emits('selected', menuKey);
  },
};

provide(menuStateKey, createMenuState(renderService));
provide(menuContainerStateKey, createMenuContainerState('menu'));
//#endregion

//#region Exposed functions
/**
 * Select a specific menu item
 * @param menuKey
 */
async function select(menuKey: string): Promise<void> {
  await onSelectFunction(menuKey);
}


defineExpose({
  select,
});
//#endregion

//#region Renderer
const render = () => {
  const request: VanyMenuRenderRequest = {
    vanyClass: 'menu',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    template: props.template,
    compact: props.compact,
    _render: renderService,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>