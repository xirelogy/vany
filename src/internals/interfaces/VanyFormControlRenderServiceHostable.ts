import VanyFormControlRenderService from '../../components/services/VanyFormControlRenderService';
import { type VanyInputChangeEventFunction } from '../../types/VanyInputChangeEventFunction';
import { type VanyInputInputEventFunction } from '../../types/VanyInputInputEventFunction';

/**
 * Hosting interface for VanyFormControlRenderService
 * @template BT Base type: how data is internally understood and stored
 * @template DT Display type: how data is presented to the end user
 */
export interface VanyFormControlRenderServiceHostable<BT, DT> {
  /**
   * Hook on to vue's onMounted at Vany's internal end
   * @param modelValue Model value in component properties
   */
  notifyMounted(modelValue: BT|null): void;

  /**
   * Hook on to vue's modelValue watch at Vany's internal end
   * @param modelValue Model value watched
   */
  notifyWatch(modelValue: BT|null): void;

  /**
   * Hook on to vue's onBeforeUnmount at Vany's internal end
   */
  notifyBeforeUnmount(): void;

  /**
   * Trigger validation manually at Vany's internal end
   */
  notifyValidate(): void;

  /**
   * Handle change event
   * @param fn Receiver function
   */
  onChangeEvent(fn: VanyInputChangeEventFunction<BT, DT>): void;

  /**
   * Handle input event
   * @param fn Receiver function
   */
  onInputEvent(fn: VanyInputInputEventFunction): void;

  /**
   * Export representation instance for Vany actuators
   * @returns The exported interface
   */
  export(): VanyFormControlRenderService<DT|null>;
}