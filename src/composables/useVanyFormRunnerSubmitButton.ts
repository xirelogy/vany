import {
  computed,
  ref,
} from 'vue';

import {
  Ref as MinRef,
} from '@xirelogy/vue-minimal';

import VanyForm from '../components/VanyForm.vue';
import VanyFormRunner from '../features/VanyFormRunner';
import VanyFormRunnerSubmitButton from '../features/VanyFormRunnerSubmitButton';
import VanyUi from '../features/VanyUi';


/**
 * Using VanyFormRunner's submit button composable
 * @param refForm Reference to VanyForm instance
 * @param fn Submit function
 * @returns
 */
export function useVanyFormRunnerSubmitButton(refForm: MinRef<InstanceType<typeof VanyForm>>|MinRef<any>, fn: () => Promise<void>): VanyFormRunnerSubmitButton {
  // Dynamic runner access
  const _runner = computed<VanyFormRunner>(() => {
    return refForm.value?.runner();
  });

  // Submission state
  const _isSubmitting = ref(false);

  return {
    /**
     * @inheritdoc
     */
    isDisabled: computed(() => {
      if (_runner.value) {
        return _runner.value.isSubmitDisabled.value;
      } else {
        return true;
      }
    }),

    /**
     * @inheritdoc
     */
    isSubmitting: computed(() => {
      return _isSubmitting.value;
    }),

    /**
     * @inheritdoc
     */
    async notifySubmit() {
      await VanyUi.busyWhile(_isSubmitting, async () => {
        const isValidated = await _runner.value?.validate() ?? false;
        if (!isValidated) return;

        await fn();
      });
    },
  };
}
