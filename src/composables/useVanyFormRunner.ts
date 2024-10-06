import {
  computed,
} from 'vue';

import {
  Ref as MinRef,
} from '@xirelogy/vue-minimal';

import VanyForm from '../components/VanyForm.vue';
import VanyFormRunner from '../features/VanyFormRunner';


/**
 * Using VanyFormRunner composable
 * @param refForm Reference to VanyForm instance
 * @returns
 */
export function useVanyFormRunner(refForm: MinRef<InstanceType<typeof VanyForm>>|MinRef<any>): VanyFormRunner {
  // Dynamic runner access
  const _runner = computed<VanyFormRunner>(() => {
    return refForm.value?.runner();
  });

  return {
    /**
     * @inheritdoc
     */
    isSubmitDisabled: computed(() => {
      if (_runner.value) return _runner.value.isSubmitDisabled.value;
      return false;
    }),

    /**
     * @inheritdoc
     */
    isDirty: computed(() => {
      if (_runner.value) return _runner.value.isDirty.value;
      return false;
    }),

    /**
     * @inheritdoc
     */
    async reset() {
      await _runner.value?.reset();
    },

    /**
     * @inheritdoc
     */
    async autoFocus() {
      return await _runner.value?.autoFocus() ?? false;
    },

    /**
     * @inheritdoc
     */
    async validate(isForeground?: boolean) {
      return await _runner.value?.validate(isForeground) ?? false;
    }
  };
}