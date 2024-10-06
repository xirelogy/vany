import VanyServiceable from '../../features/VanyServiceable';


/**
 * Internal key
 */
export const KEY = Symbol();


export interface VanyInputFrameRemoteService extends VanyServiceable {
  /**
   * Current specific service class
   */
  vanyServiceClass: 'VanyInputFrameRemoteService';

  /**
   * Forward focus notification (from container controls)
   */
  notifyFocus(): void;

  /**
   * Forward blur notification (from container controls)
   */
  notifyBlur(): void;

  /**
   * Notification of validation result
   * @param success
   * @param message
   */
  notifyValidated(success: boolean|null, message: string|Error): void;
}