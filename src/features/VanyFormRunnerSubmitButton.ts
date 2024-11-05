import {
  ComputedRef,
} from 'vue';


/**
 * VanyForm's runner support to the submit button (interface)
 */
export default interface VanyFormRunnerSubmitButton {
  /**
   * If the submit button should be blocked
   */
  readonly isDisabled: ComputedRef<boolean>;

  /**
   * If the submit button should be blocked (with dirty consideration)
   */
  readonly isDirtyDisabled: ComputedRef<boolean>;

  /**
   * If submission is currently running
   */
  readonly isSubmitting: ComputedRef<boolean>;

  /**
   * Notification receiver for submission
   */
  notifySubmit(): void;
}