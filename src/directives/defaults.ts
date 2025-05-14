import VanyCommonActuatorHandle from '../setup/VanyCommonActuatorHandle';

import registerDirectFlex from './directFlex';


/**
 * Default initialization
 * @param handle
 */
export default function pluginInitDefaultDirectives(handle: VanyCommonActuatorHandle) {
  registerDirectFlex(handle);
}