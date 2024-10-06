<script setup lang="ts">
//#region Imports
import {
  type VNode as MinVNode,
} from '@xirelogy/vue-minimal';
//#endregion

//#region Component definition
const props = defineProps<{
  /**
   * Rendering function
   */
  fn: () => MinVNode|MinVNode[];
}>();
//#endregion

//#region Renderer
const render = () => {
  return props.fn();
}
//#endregion
</script>

<template>
  <render />
</template>