import { VanyModelValue } from '../supports/VanyModelValue';
import { VanyModalEvent } from '../../types/VanyModalEvent';

/**
 * Render service for VanyDrawer
 */
export default interface VanyDrawerRenderService {
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