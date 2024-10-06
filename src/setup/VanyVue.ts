import {
  Stringable,
  xw,
  _cast,
} from '@xirelogy/xwts';

import {
  createTextVNode,
  isVNode,
  h,
  resolveComponent,
  Component,
  ComponentOptions,
  VNodeArrayChildren,
} from 'vue';

import {
  type VNode as MinVNode,
  type Slot as MinSlot,
} from '@xirelogy/vue-minimal';

import {
  type VanySlotFunction,
} from '../types/VanySlotFunction';

import {
  type VanyComponentSpec,
} from '../types/VanyComponentSpec';


/**
 * A dummy text VNode
 */
const _dummyTextVNode = createTextVNode('dummy');


/**`
 * VNode processor function
 */
type VNodeProcessFunction = (target: MinVNode) => MinVNode;

/**
 * Simplified VNode function
 */
type SimpleVNodeFunction = () => MinVNode|MinVNode[];


/**
 * Accept only single VNode (if multiple VNodes)
 * @param value
 * @returns
 */
function _acceptSingleVNode(value: any): MinVNode|null {
  if (value === null) return null;
  if (isVNode(value)) return value as MinVNode;

  if (Array.isArray(value)) {
    return _acceptSingleVNode(value[0]);
  }

  if (Array.isArray(value?.children)) {
    return _acceptSingleVNode(value.children[0]);
  }

  return null;
}


/**
 * VUE related helpers
 */
export default class VanyVue {
  /**
   * Accept a slot or fallback to label as a slot like item
   * @param slot
   * @param label
   * @returns
   */
  static acceptSlotOrTextAsSlot(slot?: MinSlot<any>, label?: Stringable|string): MinSlot<any>|null {
    if (slot) {
      return slot;
    }

    if (label) {
      return () => [
        createTextVNode(xw.normalizeString(label)),
      ];
    }

    return null;
  }


  /**
   * Accept a slot or fallback to label as a slot function
   * @param slot
   * @param label
   * @returns
   */
  static acceptSlotOrTextAsFunction(slot?: MinSlot<any>, label?: Stringable|string): VanySlotFunction {
    if (slot) {
      return slot;
    }

    if (label) {
      return () => createTextVNode(xw.normalizeString(label));
    }

    return () => null;
  }


  /**
   * Accept a function or text as a function
   * @param value
   * @returns
   */
  static acceptFunctionOrTextAsFunction(value: SimpleVNodeFunction|Stringable|string): SimpleVNodeFunction {
    // When it is function, assume it is already in the form that we wanted
    if (typeof value === 'function') {
      return value as SimpleVNodeFunction;
    }

    // Otherwise, treated as text (string)
    return () => {
      return createTextVNode(xw.normalizeString(value));
    }
  }


  /**
   * Accept a function as single VNode
   * @param value
   * @param tag
   * @returns
   */
  static acceptFunctionAsSingleVNode(value: SimpleVNodeFunction, tag: string): MinVNode {
    const ret = value();
    if (Array.isArray(ret)) {
      return h(tag, {}, _cast<VNodeArrayChildren>(ret));
    }

    return ret;
  }


  /**
   * Accept a function as multiple VNodes
   * @param value
   * @returns
   */
  static acceptFunctionAsMultipleVNode(value: SimpleVNodeFunction): MinVNode[] {
    const ret = value();
    if (Array.isArray(ret)) return ret;
    return [ ret ];
  }


  /**
   * Try to resolve component specification as component
   * @param value Component specification to be resolved
   * @returns
   */
  static acceptComponent(value: VanyComponentSpec): Component|ComponentOptions {
    if (typeof value === 'string') {
      const resolved = resolveComponent(value);
      if (typeof resolved === 'string') {
        throw new Error(`Cannot resolve component: '${resolved}'`);
      }
      return (resolved as Component);
    }

    return value as Component|ComponentOptions;
  }


  /**
   * Accept only single VNode from the given VNode/VNodes
   * @param value
   * @returns
   */
  static acceptSingleVNode(value: any): MinVNode|null {
    return _acceptSingleVNode(value);
  }


  /**
   * Patch VNodes using given processing function
   * @param target Target to be processed, either an array of VNodes or a single VNode
   * @param processFn Processing function
   * @returns
   */
  static patchVNodes(target: any, processFn: VNodeProcessFunction): MinVNode[] {
    if (isVNode(target)) {
      return [
        processFn(target),
      ];
    } else if (target instanceof Array) {
      const ret = [];
      for (const subTarget of target) {
        if (isVNode(subTarget)) {
          ret.push(processFn(subTarget));
        }
      }
      return ret;
    } else {
      return [];
    }
  }


  /**
   * Check if target is a text node
   * @param target Target to be checked
   * @returns
   */
  static isTextVNode(target: MinVNode): boolean {
    return target.type === _dummyTextVNode.type;
  }


  /**
   * Extract the component type name if given node is a component node
   * @param target Target VNode
   * @returns
   */
  static getComponentVNodeType(target: MinVNode): string|null {
    if (typeof target.type != 'object') return null;
    return (target.type as Record<string, any>).__name ?? null;
  }


  /**
   * Flatten the target VNode to be left with effective text content only
   * @param target Target VNode/VNodes
   * @returns
   */
  static flattenVNodeAsText(target: MinVNode|MinVNode[]): string {
    if (target instanceof Array) {
      let ret = '';
      for (const subTarget of target) {
        ret += this.flattenVNodeAsText(subTarget);
      }
      return ret;
    }

    if (!isVNode(target)) return ''; // Special safety

    if (typeof target.children == 'string') return target.children;

    if (target.children instanceof Array) {
      let ret = '';

      for (const child of target.children) {
        if (typeof child === 'string') {
          ret += child;
        } else if (child instanceof Array || isVNode(child)) {
          ret += this.flattenVNodeAsText(child as MinVNode|MinVNode[]);
        }
      }

      return ret;
    }

    return '';
  }


  /**
   * Check if target is a component node (of given type)
   * @param target Target to be checked
   * @param compType Component type expected
   * @returns
   */
  static isComponentVNodeOf(target: MinVNode, compType: string): boolean {
    return (this.getComponentVNodeType(target) ?? '') == compType;
  }
}