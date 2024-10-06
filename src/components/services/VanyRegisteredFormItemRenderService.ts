import VanyServiceNegotiable from '../../features/VanyServiceNegotiable';
import VanyUnmountTraceable from '../../features/VanyUnmountTraceable';
import { VanyValidatedResultFunction } from '../../types/VanyValidatedResultFunction';

/**
 * Render service for registered VanyFormItem
 */
export default interface VanyRegisteredFormItemRenderService extends VanyServiceNegotiable, VanyUnmountTraceable {
  /**
   * Control name attribute
   */
  readonly name: string;

  /**
   * Handle form control under current form item validated
   * @param fn Handler function
   */
  onValidated(fn: VanyValidatedResultFunction): void;
}