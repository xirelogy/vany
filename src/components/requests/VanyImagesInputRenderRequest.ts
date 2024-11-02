import VanyRenderRequest from '../../setup/VanyRenderRequest';
import VanyFormControlRenderService from '../services/VanyFormControlRenderService';
import { type VanyUploadFunction } from '../../types/VanyUploadFunction';


/**
 * Render request for VanyImagesInput
 */
export default interface VanyImagesInputRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'images-input';
  /**
   * Name attribute (if available)
   */
  name: string|null;
  /**
   * Acceptable MIME types
   */
  accept: string;
  /**
   * Image uploader function
   */
  uploader: VanyUploadFunction<string>;
  /**
   * Specific display width
   */
  displayWidth: number|undefined;
  /**
   * Specific display height
   */
  displayHeight: number|undefined;
  /**
   * If disabled
   */
  disabled: boolean;
  /**
   * Rendering service
   */
  _render: VanyFormControlRenderService<string[]|null>|null;
}