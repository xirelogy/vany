<script setup lang="ts">
//#region Imports
import {
  provide,
  useAttrs,
} from 'vue';

import {
  _used,
} from '@xirelogy/xwts';

import VanyDropdownMenuRenderRequest from './requests/VanyDropdownMenuRenderRequest';

import { type VanyDropdownMenuTriggerType } from '../types/VanyDropdownMenuTriggerType';
import type VanyDropdownMenuRenderService from './services/VanyDropdownMenuRenderService';

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
   * How the menu is triggered
   * @defaultValue 'hover'
   */
  trigger?: VanyDropdownMenuTriggerType,
}>(), {
  trigger: 'hover',
});

const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Menu content
   */
  default: () => any,
  /**
   * Reference trigger
   */
  reference: () => any,
}>();

const emits = defineEmits<{
  /**
   * Menu item within current menu selected
   */
  'selected': [menuKey: string],
}>();
//#endregion

//#region Internal setup
// Create render service and register
const renderService: VanyDropdownMenuRenderService = {
  /**
   * @inheritdoc
   */
  notifySelected(menuKey?: string): void {
    if (menuKey === undefined) return;
    emits('selected', menuKey);
  },
};

provide(menuContainerStateKey, createMenuContainerState('dropdown-menu'));
//#endregion

//#region Renderer
const render = () => {
  const request: VanyDropdownMenuRenderRequest = {
    vanyClass: 'dropdown-menu',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    trigger: props.trigger,
    _render: renderService,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>
