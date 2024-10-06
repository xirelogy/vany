/**
 * Render service for VanyTag
 */
export default interface VanyTagRenderService {
  /**
   * Notification of click
   */
  notifyClick(): void;
  /**
   * Notification of close
   */
  notifyClose(): void;
}