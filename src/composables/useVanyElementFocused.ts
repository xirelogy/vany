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
 * Keep track of element focus
 * @param el Target element
 * @returns
 */
export function useVanyElementFocused(el: VanySpec<HTMLElement>): MinRef<boolean> {
  const isFocused = ref(false);

  nextTick(() => {
    const _el = fromVanySpec(el);

    _el?.addEventListener('focusin', () => {
      isFocused.value = true;
    });
    _el?.addEventListener('focusout', () => {
      isFocused.value = false;
    });
  });

  return computed(() => {
    return isFocused.value;
  });
}