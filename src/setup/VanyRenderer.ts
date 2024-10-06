import {
  useAttrs,
} from 'vue';

import {
  Ref as MinRef,
  Slot as MinSlot,
} from '@xirelogy/vue-minimal';

import {
  type VanySlotFunction,
} from '../types/VanySlotFunction';


type UseAttrsReturn = ReturnType<typeof useAttrs>;


/**
 * Support rendering
 */
export default class VanyRenderer {
  /**
   * Accept attributes
   * @param attrs Incoming attributes
   * @returns Flatten attributes
   */
  static acceptAttrs(attrs: UseAttrsReturn): Record<string, any> {
    const ret = {} as Record<string, any>;
    for (const key in attrs) {
      ret[key] = attrs[key];
    }
    return ret;
  }


  /**
   * Accept modelValue from attributes
   * @param attrs Incoming attributes
   * @returns Model value in attributes, if any
   */
  static acceptModelValueFromAttrs(attrs: UseAttrsReturn): MinRef|null {
    for (const key in attrs) {
      if (key === 'modelValue') return attrs[key] as MinRef;
    }
    return null;
  }


  /**
   * Accept a slot
   * @param slot Target slot
   * @returns Corresponding slot function
   */
  static acceptSlot(slot: MinSlot|undefined): VanySlotFunction {
    if (slot === undefined) return () => null;
    return (...args: any) => slot(...args);
  }


  /**
   * Accept an optional slot
   * @param slot Target slot
   * @returns Corresponding slot function, if any
   */
  static acceptOptionalSlot(slot: MinSlot|undefined): VanySlotFunction|undefined {
    if (slot === undefined) return undefined;
    return (...args: any) => slot(...args);
  }
}