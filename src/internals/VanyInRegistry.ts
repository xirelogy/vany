import {
  VNode as MinVNode,
} from '@xirelogy/vue-minimal';

import VanyActuatorHandle from '../setup/VanyActuatorHandle';
import VanyRenderRequest from '../setup/VanyRenderRequest';
import VanyReactiveRequest from '../setup/VanyReactiveRequest';
import VanyServiceRequest from '../setup/VanyServiceRequest';

import {
  VanyCompatDirective,
} from '../directives';

import {
  VanyActuatorServiceFunction,
} from '../setup/VanyActuatorHandle';


/**
 * Vany registry
 */
export default class VanyInRegistry {
  /**
   * Current handle
   */
  private static _currentHandle: VanyActuatorHandle|null = null;


  /**
   * Register the registry handle
   * @param handle Handle to be registered
   */
  static registerHandle(handle: VanyActuatorHandle): void {
    this._currentHandle = handle;
  }


  /**
   * Current actuator name
   */
  static get name(): string {
    if (this._currentHandle === null) throw new Error('No actuator handle is registered: Vany is not configured properly!');
    return this._currentHandle.name;
  }


  /**
   * Route a rendering request
   * @param request The rendering request (per vany)
   * @returns Render result
   */
  static render(request: VanyRenderRequest): MinVNode|null {
    if (this._currentHandle === null) throw new Error('No actuator handle is registered: Vany is not configured properly!');
    return this._currentHandle.render(request);
  }


  /**
   * Route a directive request
   * @param name The directive name
   * @returns Directive instance, if any
   */
  static directive(name: string): VanyCompatDirective|undefined {
    if (this._currentHandle === null) throw new Error('No actuator handle is registered: Vany is not configured properly!');
    return this._currentHandle.directive(name);
  }


  /**
   * Route a reactive request
   * @param request The reactive request
   * @returns Reactive result
   */
  static reactive(request: VanyReactiveRequest): any {
    if (this._currentHandle === null) throw new Error('No actuator handle is registered: Vany is not configured properly!');
    return this._currentHandle.reactive(request);
  }


  /**
   * Register a service function
   * @param vanyClass Service class
   * @param serviceFn Service function
   */
  static registerDefaultService(vanyClass: string, serviceFn: VanyActuatorServiceFunction): void {
    this._currentHandle?.registerService(vanyClass, serviceFn, false);
  }


  /**
   * Route a service request
   * @param request The service request
   * @returns Service result (instance)
   */
  static service(request: VanyServiceRequest): any {
    if (this._currentHandle === null) throw new Error('No actuator handle is registered: Vany is not configured properly!');
    return this._currentHandle.service(request);
  }
}