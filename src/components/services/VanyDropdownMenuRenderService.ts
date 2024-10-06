/**
 * Render service for VanyDropdownMenu
 */
export default interface VanyDropdownMenuRenderService {
  /**
   * Notify that a menu item is selected
   * @param menuKey
   */
  notifySelected(menuKey?: string): void;
}