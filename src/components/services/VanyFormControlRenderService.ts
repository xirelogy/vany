import { VanyModelValue } from '../supports/VanyModelValue';
import { VanyFormEvent } from '../../types/VanyFormEvent';
import { VanyValidatedResultFunction } from '../../types/VanyValidatedResultFunction';

/**
 * Render service for form controls: VanyInput, VanyDateInput, VanyTimeInput, VanySelect
 * @template T The general display type of the target input
 */
export default interface VanyFormControlRenderService<T> {
  /**
   * The model value
   */
  get modelValue(): VanyModelValue<T>;

  /**
   * Handle focus request to current control
   * @param fn Handler function
   */
  onFocus(fn: () => Promise<boolean>): void;

  /**
   * Handle form control validated
   * @param fn Handler function
   */
  onValidated(fn: VanyValidatedResultFunction): void;

  /**
   * Notify that a bad model value is (currently) discovered
   * @param modelValue
   */
  notifyBadModelValue(modelValue: T): void;

  /**
   * Notify an event had happened
   * @param eventType
   * @param args
   * @param payload
   */
  notifyEvent(eventType: VanyFormEvent, args?: IArguments, payload?: any): void;
}