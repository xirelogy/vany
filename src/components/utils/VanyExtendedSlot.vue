<script setup lang="ts">
import {
  cloneVNode,
  useAttrs,
  useSlots,
  type VNode,
} from 'vue';

const attrs = useAttrs();


function recursiveAddProps(element: VNode): VNode|VNode[] {
  if (Array.isArray(element?.children)) {
    return element.children.map((el) => recursiveAddProps(el as VNode)) as VNode[];
  } else {
    return cloneVNode(element, attrs);
  }
}


const render = () => {
  const slot = useSlots()?.default!();
  return recursiveAddProps(slot[0]);
}
</script>

<template>
  <render>
    <slot></slot>
  </render>
</template>