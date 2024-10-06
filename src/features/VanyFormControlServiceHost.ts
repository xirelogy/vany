import VanyFormControlRenderService from '../components/services/VanyFormControlRenderService';
import { VanyInputChangeEventFunction } from '../types/VanyInputChangeEventFunction';
import { VanyInputInputEventFunction } from '../types/VanyInputInputEventFunction';

/**
 * Service host for form control for upstream: component declaration
 */
export interface VanyFormControlServiceUpstreamHost<BT, DT> {
  /**
   * Hook on to vue's onBeforeUnmount
   */
  notifyBeforeUnmount(): void;

  /**
   * Hook on to vue's onMounted
   * @param modelValue Model value in component properties
   */
  notifyMounted(modelValue: BT|null): void;

  /**
   * Hook on to vue's modelValue watch
   * @param modelValue Model value watched
   */
  notifyWatch(modelValue: BT|null): void;

  /**
   * Notify (forward) focus request
   */
  notifyFocus(): Promise<boolean>;

  /**
   * Handle raising of 'update:modelValue' event
   * @param fn
   */
  onUpdateModelValueEvent(fn: (value: BT|null) => void): void;

  /**
   * Handle raising of 'change' event
   * @param fn
   */
  onChangeEvent(fn: VanyInputChangeEventFunction<BT, DT>): void;

  /**
   * Handle input event
   * @param fn
   */
  onInputEvent(fn: VanyInputInputEventFunction): void;
}


/**
 * Service host for form control
 */
export default interface VanyFormControlServiceHost<BT, DT> {
  /**
   * Upstream interface (component declaration)
   */
  readonly upstream: VanyFormControlServiceUpstreamHost<BT, DT>;
  /**
   * Downstream interface (component implementation)
   */
  readonly downstream: VanyFormControlRenderService<DT|null>;
}