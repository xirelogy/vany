import VanyRenderRequest from '../../setup/VanyRenderRequest';
import VanyFormControlRenderService from '../services/VanyFormControlRenderService';
import { type VanyUploadFunction } from '../../types/VanyUploadFunction';


/**
 * Render request for VanyImageInput
 */
export default interface VanyImageInputRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'image-input';
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
   * If deletable
   */
  deletable: boolean;
  /**
   * If disabled
   */
  disabled: boolean;
  /**
   * Rendering service
   */
  _render: VanyFormControlRenderService<string|null>|null;
}