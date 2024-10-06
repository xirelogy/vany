import VanyOptionable from './VanyOptionable';

/**
 * Source function
 */
export type VanySelectOptionSourceFunction = () => Promise<VanyOptionable[]>|VanyOptionable[];


/**
 * The 'option's in select shall be managed
 */
export default interface VanySelectOptionManageable {
  /**
   * Source function providing the list of options
   */
  source: VanySelectOptionSourceFunction;
  /**
   * If the options shall be automatically loaded from source upon mount
   */
  autoload?: boolean;
  /**
   * If the first available options shall be automatically selected upon availability
   */
  autoselect?: boolean;
}