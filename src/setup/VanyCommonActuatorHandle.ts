import {
  h,
} from 'vue';

import {
  VNode as MinVNode,
} from '@xirelogy/vue-minimal';

import VanyActuatorHandle from './VanyActuatorHandle';
import VanyRenderRequest from './VanyRenderRequest';
import VanyReactiveRequest from './VanyReactiveRequest';
import VanyServiceRequest from './VanyServiceRequest';

import {
  type VanyActuatorRenderFunction,
  type VanyActuatorDirectiveFunction,
  type VanyActuatorReactiveFunction,
  type VanyActuatorServiceFunction,
} from './VanyActuatorHandle';

import { type VanyCompatDirective } from '../directives';


/**
 * Default renderer for unsupported item
 * @param request
 * @returns
 */
const defaultRenderer: VanyActuatorRenderFunction = (request: VanyRenderRequest) => {
  return h('unsupported', {
    vanyClass: request.vanyClass,
  }, {
    default: () => 'UNSUPPORTED-VANY-ITEM',
  });
};


/**
 * Default reactor for unsupported type
 * @param request
 * @returns
 */
const defaultReactor: VanyActuatorReactiveFunction = (request: VanyReactiveRequest) => {
  return new Error(`Unsupported reactive request ${request.vanyClass}`);
};


const defaultService: VanyActuatorServiceFunction = (request: VanyServiceRequest) => {
  return new Error(`Unsupported service request ${request.vanyClass}`);
};


/**
 * Common implementation of the actuator handle
 */
export default class VanyCommonActuatorHandle implements VanyActuatorHandle {
  /**
   * Actuator name
   */
  private readonly _name: string;
  /**
   * All registered renderers
   */
  private _renderers = new Map<string, VanyActuatorRenderFunction>();
  /**
   * All registered directives
   */
  private _directives = new Map<string, VanyActuatorDirectiveFunction>();
  /**
   * All registered reactors
   */
  private _reactors = new Map<string, VanyActuatorReactiveFunction>();
  /**
   * All registered services
   */
  private _services = new Map<string, VanyActuatorServiceFunction>();


  /**
   * @constructor
   * @param name
   */
  constructor(name: string) {
    this._name = name;
  }


  /**
   * @inheritdoc
   */
  get name(): string {
    return this._name;
  }


  /**
   * Register a rendering function
   * @param vanyClass
   * @param renderFn
   */
  registerRenderer(vanyClass: string, renderFn: VanyActuatorRenderFunction): void {
    this._renderers.set(vanyClass, renderFn);
  }


  /**
   * @inheritdoc
   */
  render(request: VanyRenderRequest): MinVNode|null {
    const renderer = this._renderers.get(request.vanyClass);
    if (renderer === undefined) return defaultRenderer(request);
    return renderer(request);
  }


  /**
   * Register a directive function
   * @param name
   * @param directiveFn
   */
  registerDirective(name: string, directiveFn: VanyActuatorDirectiveFunction): void {
    this._directives.set(name, directiveFn);
  }


  /**
   * @inheritdoc
   */
  directive(name: string): VanyCompatDirective|undefined {
    const creator = this._directives.get(name);
    if (creator === undefined) return undefined;
    return creator();
  }


  /**
   * Register a reactive function
   * @param vanyClass
   * @param reactiveFn
   */
  registerReactive(vanyClass: string, reactiveFn: VanyActuatorReactiveFunction): void {
    this._reactors.set(vanyClass, reactiveFn);
  }


  /**
   * @inheritdoc
   */
  reactive(request: VanyReactiveRequest): any {
    const reactor = this._reactors.get(request.vanyClass);
    if (reactor === undefined) return defaultReactor(request);
    return reactor(request);
  }


  /**
   * @inheritdoc
   */
  registerService(vanyClass: string, serviceFn: VanyActuatorServiceFunction, isOverride?: boolean): void
  {
    if (!(isOverride ?? true) && this._services.get(vanyClass)) return;
    this._services.set(vanyClass, serviceFn);
  }


  /**
   * @inheritdoc
   */
  service(request: VanyServiceRequest): any {
    const handler = this._services.get(request.vanyClass);
    if (handler === undefined) return defaultService(request);
    return handler(request);
  }
}