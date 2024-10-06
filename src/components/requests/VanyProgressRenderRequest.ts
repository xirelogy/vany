import VanyRenderRequest from '../../setup/VanyRenderRequest';
import { type VanyProgressTemplateType } from '../../types/VanyProgressTemplateType';
import { type VanyProgressType } from '../../types/VanyProgressType';

/**
 * Render request for VanyProgress
 */
export default interface VanyProgressRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'progress';
  /**
   * Progress value in percentage (0~100)
   */
  value: number;
  /**
   * Progress bar width
   */
  barWidth: number;
  /**
   * Progress template
   */
  template: VanyProgressTemplateType;
  /**
   * Type
   */
  type: VanyProgressType;
}
