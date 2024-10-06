import VanyInRegistry from '../internals/VanyInRegistry';
import VanyDarkModeReactiveRequest from './requests/VanyDarkModeReactiveRequest';

/**
 * Make a reactive request to change dark mode
 * @param isDark
 * @returns
 */
export default function vanyReactDarkMode(isDark: boolean): boolean|Error {
  return VanyInRegistry.reactive({
    vanyClass: 'dark-mode',
    isDark: isDark,
  } as VanyDarkModeReactiveRequest) as (boolean|Error);
}