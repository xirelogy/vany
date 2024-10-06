import VanyRegisteredFormItemRenderService from './VanyRegisteredFormItemRenderService';
import VanyCallable from '../../features/VanyCallable';
import { VanyValidatedResultFunction } from '../../types/VanyValidatedResultFunction';
import VanyUnmountTraceable from '../../features/VanyUnmountTraceable';

/**
 * Render service for VanyFormItem
 */
export default interface VanyFormItemRenderService extends VanyUnmountTraceable {
  /**
   * Register a form control under this form item
   * @param name Name attribute of the control
   * @param fwdFocus Focus forwarding function
   * @returns
   */
  registerControl(name: string, fwdFocus?: VanyCallable<void, Promise<boolean>>): VanyRegisteredFormItemRenderService|null;

  /**
   * Handle form control under current form item validated
   * @param fn Handler function
   */
  onValidated(fn: VanyValidatedResultFunction): void;
}