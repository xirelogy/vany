/**
 * Representation of a model value forwarded to Vany actuators
 */
export interface VanyModelValue<T> {
  /**
   * Handle the value change at the UI end.
   * @param fn Handler function
   * @note Equivalent to vue's watch on modelValue
   */
  onWatch(fn: (value: T) => void): void;

  /**
   * Notify the Vany host that the model value had been updated.
   * @param value Updated value
   * @note Equivalent to vue's 'update:modelValue' event.
   */
  notifyUpdate(value: T): void;
}