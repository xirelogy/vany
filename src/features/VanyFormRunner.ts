import {
  type ComputedRef as MinComputedRef,
} from '@xirelogy/vue-minimal';


/**
 * VanyForm's runner (interface)
 */
export default interface VanyFormRunner {
  /**
   * If the form submission should be blocked (adapt to button disable pattern)
   */
  readonly isSubmitDisabled: MinComputedRef<boolean>;

  /**
   * If any field value monitored by the form had changed (dirty)
   */
  readonly isDirty: MinComputedRef<boolean>;

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
