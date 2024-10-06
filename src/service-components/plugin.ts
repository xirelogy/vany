import VanyInRegistry from '../internals/VanyInRegistry';

import defaultServicePrompt from './defaultServicePrompt';


/**
 * Initialization of default services
 */
export default function pluginInitDefaultServices() {
  VanyInRegistry.registerDefaultService('prompt', defaultServicePrompt);
}