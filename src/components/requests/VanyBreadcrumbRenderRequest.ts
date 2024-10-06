import {
  Stringable,
} from '@xirelogy/xwts';

import VanyRenderRequest from '../../setup/VanyRenderRequest';


/**
 * Render request for VanyBreadcrumb
 */
export default interface VanyBreadcrumbRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'breadcrumb';
  /**
   * Specific separator between breadcrumb items
   */
  separator?: Stringable|string;
}
