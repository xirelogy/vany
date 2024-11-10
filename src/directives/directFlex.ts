import {
  DirectiveBinding,
} from 'vue';

import { type VanyCompatDirective } from '.';

import VanyCommonActuatorHandle from '../setup/VanyCommonActuatorHandle';



/**
 * Directive provider
 * @returns
 */
function directFlex(): VanyCompatDirective|undefined {
  return {
    beforeMount(el: any, binding: DirectiveBinding<void>) {
      const _isHor = binding.modifiers?.hor === true;
      const _isVer = binding.modifiers?.ver === true;
      const _isFixed = binding.modifiers?.fixed === true;
      const _isSpring = binding.modifiers?.spring === true;

      if (el instanceof HTMLElement) {
        if (_isHor) el.classList.add('vany-std-flex-hor');
        if (_isVer) el.classList.add('vany-std-flex-ver');
        if (_isFixed) el.classList.add('vany-std-flex-item-fixed');
        if (_isSpring) el.classList.add('vany-std-flex-item-spring');
      }
    },
  };
}



/**
 * Register function
 * @param handle
 */
export default function register(handle: VanyCommonActuatorHandle): void {
  handle.registerDirective('flex', directFlex);
}