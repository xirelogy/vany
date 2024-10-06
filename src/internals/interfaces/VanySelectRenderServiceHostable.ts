import VanySelectRenderService from '../../components/services/VanySelectRenderService';

/**
 * Hosting interface for VanySelectRenderService
 */
export interface VanySelectRenderServiceHostable {
  /**
   * Trigger the refresh options
   */
  triggerRefreshOptions(): Promise<void>

  /**
   * Trigger selection ensure
   */
  triggerEnsureSelect(): void;

  /**
   * Export representation instance for Vany actuators
   * @returns The exported interface
   */
  export(): VanySelectRenderService;
}