import {
  ComputedRef,
} from 'vue';

/**
 * VanyForm's runner (interface)
 */
export default interface VanyFormRunner {
  /**
   * If the form submission should be blocked (adapt to button disable pattern)
   */
  readonly isSubmitDisabled: ComputedRef<boolean>;

  /**
   * If any field value monitored by the form had changed (dirty)
   */
  readonly isDirty: ComputedRef<boolean>;

  /**
   * Reset the form
   */
  reset(): Promise<void>;

  /**
   * Automatically focus on first input
   */
  autoFocus(): Promise<boolean>;

  /**
   * Validate the fields in the form
   * @param isForeground If the validation is caused by foreground activity [true]
   * @returns If the validation is successful (accepted)
   */
  validate(isForeground?: boolean): Promise<boolean>;
}
