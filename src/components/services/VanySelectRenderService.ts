import { type VanySelectOptionSourceFunction } from '../../features/VanySelectOptionManageable';


/**
 * Render service for VanySelect (managed)
 */
export default interface VanySelectRenderService {
  /**
   * Register the handler function for refreshing options
   * @param fn
   */
  onRefreshOptions(fn: (source: VanySelectOptionSourceFunction) => Promise<void>): void;

  /**
   * Try to ensure something is selected
   * @param fn
   */
  onEnsureSelect(fn: () => void): void;
}