import {
  App,
} from 'vue';

import VanyInRegistry from '../internals/VanyInRegistry';



/**
 * Try to register directive
 * @param name Directive name
 * @returns If successful
 */
function tryRegisterDirective(app: App, name: string): boolean {
  const dirInstance = VanyInRegistry.directive(name);
  if (!dirInstance) {
    console.warn(`Registration of directive '${name}' is not successful. Some dependencies may break!`);
    return false;
  }

  app.directive(name, dirInstance);
  return true;
}


/**
 * Initialization
 * @param app
 */
export default function pluginInitDirectives(app: App) {
  tryRegisterDirective(app, 'flex');
  tryRegisterDirective(app, 'loading');
}