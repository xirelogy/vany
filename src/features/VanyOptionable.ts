import { VanyRenderFunction } from '../types/VanyRenderFunction';


/**
 * Representation of an option for 'select'
 */
export default interface VanyOptionable {
  /**
   * The key value
   */
  value: string;
  /**
   * Label for display
   */
  label: string|VanyRenderFunction;
  /**
   * If current option is disabled
   */
  disabled?: boolean;
}