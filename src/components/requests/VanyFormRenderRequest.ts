import VanyRenderRequest from '../../setup/VanyRenderRequest';


/**
 * Render request for VanyForm
 */
export default interface VanyFormRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'form';
  /**
   * Pseudo submit button
   */
  submitButton: boolean;
  /**
   * If disabled
   */
  disabled: boolean;
  /**
   * If form-item(s) are rendered inline (one-liner)
   */
  inline: boolean;
  /**
   * If form is virtual (form-item label not expected to be visible)
   */
  virtual: boolean;
}