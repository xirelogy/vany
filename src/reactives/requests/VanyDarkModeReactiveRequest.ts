import VanyReactiveRequest from '../../setup/VanyReactiveRequest';


/**
 * Reactive request to dark-mode settings
 */
export default interface VanyDarkModeReactiveRequest extends VanyReactiveRequest {
  /**
   * Specific class
   */
  vanyClass: 'dark-mode';
  /**
   * If dark mode is to be enabled
   */
  isDark: boolean;
}