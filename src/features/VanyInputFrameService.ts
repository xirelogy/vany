/**
 * Input frame service
 */
export default interface VanyInputFrameService {
  /**
   * Get notified of focus
   */
  notifyFocus(): void;

  /**
   * Get notified of blur (lost focus)
   */
  notifyBlur(): void;

  /**
   * Notification of validation result
   * @param success
   * @param message
   */
  notifyValidated(success: boolean|null, message: string|Error): void;
}