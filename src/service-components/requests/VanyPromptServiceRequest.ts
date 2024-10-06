
import VanyServiceRequest from '../../setup/VanyServiceRequest';
import { VanyPromptOptions } from '../VanyPromptService';

export default interface VanyPromptServiceRequest<T> extends VanyServiceRequest {
  /**
   * Specific class
   */
  vanyClass: 'prompt';
  /**
   * Associated options
   */
  options: VanyPromptOptions<T>;
}