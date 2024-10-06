import VanyServiceRequest from '../../setup/VanyServiceRequest';
import { VanyNotifyOptions } from '../VanyNotifyService';

export default interface VanyNotifyServiceRequest extends VanyServiceRequest {
  /**
   * Specific class
   */
  vanyClass: 'notify';
  /**
   * Associated options
   */
  options: VanyNotifyOptions;
}