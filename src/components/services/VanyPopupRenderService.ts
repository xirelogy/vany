import { VanyModelValue } from '../supports/VanyModelValue';
import { VanyModalEvent } from '../../types/VanyModalEvent';

/**
 * Render service for VanyPopup
 */
export default interface VanyPopupRenderService {
  /**
   * The model value
   */
  get modelValue(): VanyModelValue<boolean>;

  /**
   * Notify an event had happened
   * @param eventType
   */
  notifyEvent(eventType: VanyModalEvent): void;
};