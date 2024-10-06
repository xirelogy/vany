import {
  Stringable,
} from '@xirelogy/xwts';

import VanyRenderRequest from '../../setup/VanyRenderRequest';
import { type VanyComponentSpec } from '../../types/VanyComponentSpec';
import { type VanyMenuContainerType } from '../../types/VanyMenuContainerType';


/**
 * Render request for VanyMenuItem
 */
export default interface VanyMenuItemRenderRequest extends VanyRenderRequest {
  /**
   * Specific class
   */
  vanyClass: 'menu-item';
  /**
   * Associated container type
   */
  containerType: VanyMenuContainerType|null;
  /**
   * Menu item key
   */
  key: string|null;
  /**
   * If active
   */
  active: boolean;
  /**
   * If disabled
   */
  disabled: boolean;
  /**
   * Icon component specification
   */
  icon: VanyComponentSpec|null;
  /**
   * Label specification
   */
  label: string|Stringable|null;
}