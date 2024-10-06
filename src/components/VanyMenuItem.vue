<script setup lang="ts">
//#region Imports
import {
  useAttrs,
} from 'vue';

import {
  Stringable,
} from '@xirelogy/xwts';

import VanyMenuItemRenderRequest from './requests/VanyMenuItemRenderRequest';

import { type VanyComponentSpec } from '../types/VanyComponentSpec';

import {
  useMenuContainerStateType,
} from '../states/menuContainerState';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const props = withDefaults(defineProps<{
  /**
   * Item key
   */
  menuKey?: string;
  /**
   * If active
   * @defaultValue false
   */
  active?: boolean;
  /**
   * If disabled
   * @defaultValue false
   */
  disabled?: boolean,
  /**
   * Specific icon component
   */
  icon?: VanyComponentSpec,
  /**
   * Specific label
   */
  label?: string|Stringable,
}>(), {
  key: undefined,
  active: false,
  disabled: false,
  icon: undefined,
  label: undefined,
});

const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Sub-items
   */
  default?: () => any,
  /**
   * Menu item's icon
   */
  icon?: () => any,
  /**
   * Menu item's label
   */
  label: () => any,
}>();
//#endregion

//#region Renderer
const render = () => {
  const request: VanyMenuItemRenderRequest = {
    vanyClass: 'menu-item',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    containerType: useMenuContainerStateType(),
    key: props.menuKey ?? null,
    active: props.active,
    disabled: props.disabled,
    icon: props.icon ?? null,
    label: props.label ?? null,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>