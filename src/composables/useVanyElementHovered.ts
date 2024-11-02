import {
  computed,
  nextTick,
  ref,
} from 'vue';

import { type Ref as MinRef } from '@xirelogy/vue-minimal';

import {
  type VanySpec,
  fromVanySpec,
} from '../features/VanySpec';


/**
 * Keep track of element hover
 * @param el Target element
 * @returns
 */
export function useVanyElementHovered(el: VanySpec<HTMLElement>): MinRef<boolean> {
  const isHovered = ref(false);

  nextTick(() => {
    const _el = fromVanySpec(el);

    _el?.addEventListener('mouseenter', () => {
      isHovered.value = true;
    });
    _el?.addEventListener('mouseout', () => {
      isHovered.value = false;
    });
  });

  return computed(() => {
    return isHovered.value;
  });
}