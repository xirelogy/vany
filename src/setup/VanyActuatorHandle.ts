import {
  VNode as MinVNode,
} from '@xirelogy/vue-minimal';

import VanyReactiveRequest from './VanyReactiveRequest';
import VanyRenderRequest from './VanyRenderRequest';
import VanyServiceRequest from './VanyServiceRequest';

import { type VanyCompatDirective } from '../directives';


/**
 * Rendering function
 */
export type VanyActuatorRenderFunction = (request: VanyRenderRequest) => MinVNode|null;

/**
 * Directive function
 */
export type VanyActuatorDirectiveFunction = () => VanyCompatDirective|undefined;

/**
 * Reactive function
 */
export type VanyActuatorReactiveFunction = (request: VanyReactiveRequest) => any;

/**
 * Service function
 */
export type VanyActuatorServiceFunction = (request: VanyServiceRequest) => any;


/**
 * Handle to a VanyActuator
 */
export default interface VanyActuatorHandle {
  /**
   * Actuator name
   */
  get name(): string;

  /**
   * Call for a rendering request
   * @param request The rendering request (per vany)
   * @returns Render result
   */
  render(request: VanyRenderRequest): MinVNode|null;

  /**
   * Call for a directive request
   * @param name The directive name
   * @returns Directive instance, if any
   */
  directive(name: string): VanyCompatDirective|undefined;

  /**
   * Call for a reactive request
   * @param request The reactive request
   * @returns Reactive result
   */
  reactive(request: VanyReactiveRequest): any;

  /**
   * Register a service function
   * @param vanyClass Service class
   * @param serviceFn Service function
   * @param isOverride Overriding registration (default: true)
   */
  registerService(vanyClass: string, serviceFn: VanyActuatorServiceFunction, isOverride?: boolean): void;

  /**
   * Call for a service request
   * @param request The service request
   * @returns Service result (instance)
   */
  service(request: VanyServiceRequest): any;
}