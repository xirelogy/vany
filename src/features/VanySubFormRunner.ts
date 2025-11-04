import { type Ref as MinRef } from '@xirelogy/vue-minimal';
import { VanyInputChangeEventFunction } from '../types/VanyInputChangeEventFunction';
import { VanyInputInputEventFunction } from '../types/VanyInputInputEventFunction';


/**
 * Upstream wrapper interface for VanySubFormRunner
 * Exposes only necessary methods and allows pre-handling
 */
export interface VanySubFormRunnerUpstream<BT, DT extends Record<string, any>> {
  /**
   * Hook on to vue's onBeforeUnmount
   */
  notifyBeforeUnmount(): void;

  /**
   * Hook on to vue's onMounted
   * @param modelValue Model value in component properties
   */
  notifyMounted(modelValue: BT | null): void;

  /**
   * Hook on to vue's modelValue watch
   * @param modelValue Model value watched
   */
  notifyWatch(modelValue: BT | null): void;

  /**
   * Notify (forward) focus request
   */
  notifyFocus(): Promise<boolean>;

  /**
   * Handle raising of 'update:modelValue' event
   * @param fn Handler function
   */
  onUpdateModelValueEvent(fn: (value: BT | null) => void): void;

  /**
   * Handle raising of 'change' event
   * @param fn Handler function
   */
  onChangeEvent(fn: VanyInputChangeEventFunction<BT, DT | null>): void;

  /**
   * Handle input event
   * @param fn Handler function
   */
  onInputEvent(fn: VanyInputInputEventFunction): void;

  /**
   * Handle focus event from the control group
   * @param fn Handler function
   */
  onFocusEvent(fn: () => void): void;

  /**
   * Handle blur event from the control group
   * @param fn Handler function
   */
  onBlurEvent(fn: () => void): void;
}


/**
 * Sub-form runner interface for composite controls
 * @template BT Business type (parent model value)
 * @template DT Display type (form data for sub-controls)
 */
export default interface VanySubFormRunner<BT, DT extends Record<string, any>> {
  /**
   * Reactive form data (display type)
   * Automatically synced with parent control's downstream
   */
  readonly formData: MinRef<DT>;

  /**
   * Upstream interface for event handling
   * Allows component to hook into lifecycle and emit events
   */
  readonly upstream: VanySubFormRunnerUpstream<BT, DT>;

  /**
   * Helper to generate sub-control names
   * Returns the field name as-is (for local naming)
   * @param fieldName Field name from DT
   */
  subName(fieldName: keyof DT): string;
}
