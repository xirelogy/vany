import VanyInRegistry from '../internals/VanyInRegistry';


/**
 * Using current actuator's name
 * @returns
 */
export function useVanyActuatorName(): string {
  return VanyInRegistry.name;
}