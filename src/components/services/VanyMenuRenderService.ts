type AsyncSelectFunction = (menuKey: string) => Promise<void>;


/**
 * Render service for VanyMenu
 */
export default interface VanyMenuRenderService {
  /**
   * Handle menu selection request (from user)
   * @param fn
   */
  onSelect(fn: AsyncSelectFunction): void;

  /**
   * Notify that a menu item is selected
   * @param menuKey
   */
  notifySelected(menuKey?: string): void;
}