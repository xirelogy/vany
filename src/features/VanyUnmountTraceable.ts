/**
 * May get notified on vue's onBeforeUnmount()
 */
export default interface VanyUnmountTraceable {
  /**
   * Get notified on vue's onBeforeUnmount()
   */
  notifyBeforeUnmount(): void;
}