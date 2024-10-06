import {
  App as MinApp,
} from '@xirelogy/vue-minimal';

import VanyActuatorHandle from './VanyActuatorHandle';
import VanyActuatorOptions from './VanyActuatorOptions';


/**
 * Vany actuator setup interface
 */
export default interface VanyActuator {
  /**
   * Install the actuator
   * @param app Associated vue app
   * @param options Options to the actuator
   * @returns Handle to the actuator
   */
  install(app: MinApp, options: VanyActuatorOptions[]): VanyActuatorHandle;
}