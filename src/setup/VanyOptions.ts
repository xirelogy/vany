import VanyActuator from './VanyActuator';
import VanyActuatorOptions from './VanyActuatorOptions';


/**
 * Vue plugin options for vany
 */
export default interface VanyOptions {
  /**
   * Specify actuator to be used
   */
  useActuator?: VanyActuator;
  /**
   * Options to the actuator
   */
  useActuatorOptions?: VanyActuatorOptions[];
}