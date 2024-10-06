import { VanyModelValue } from '../supports/VanyModelValue';
import { VanyDialogEvent } from '../../types/VanyDialogEvent';

/**
 * Render service for VanyDialog
 */
export default interface VanyDialogRenderService {
  /**
   * The model value
   */
  get modelValue(): VanyModelValue<boolean>;

  /**
   * Notify an event had happened
   * @param eventType
   */
  notifyEvent(eventType: VanyDialogEvent): void;
};