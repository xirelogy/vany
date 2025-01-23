import {
  type ComputedRef as MinComputedRef,
} from '@xirelogy/vue-minimal';


/**
 * VanyForm's runner support to the submit button (interface)
 */
export default interface VanyFormRunnerSubmitButton {
  /**
   * If the submit button should be blocked
   */
  readonly isDisabled: MinComputedRef<boolean>;

  /**
   * If the submit button should be blocked (with dirty consideration)
   */
  readonly isDirtyDisabled: MinComputedRef<boolean>;

  /**
   * If submission is currently running
   */
  readonly isSubmitting: MinComputedRef<boolean>;

  /**
   * Notification receiver for submission
   */
  notifySubmit(): void;
}