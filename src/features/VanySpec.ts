import { isRef } from 'vue';
import { type Ref as MinRef } from '@xirelogy/vue-minimal';


/**
 * A derive function that may result into something
 */
export type VanySpecDerivableFunction<T> = () => T|undefined;


/**
 * Common specification
 */
export type VanySpec<T> = MinRef<T|undefined>|VanySpecDerivableFunction<T>|T|undefined;


/**
 * Get value from specification
 * @param spec
 * @returns
 */
export function fromVanySpec<T>(spec: VanySpec<T>): T|undefined {
  if (typeof spec === 'function') return (spec as VanySpecDerivableFunction<T>)();
  if (isRef<T|undefined>(spec)) return spec.value;
  return spec as T|undefined;
}