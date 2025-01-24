import { isRef } from 'vue';
import { type Ref as MinRef } from '@xirelogy/vue-minimal';


/**
 * A derive function that may result into something
 */
export type VanySpecDerivableFunction<T> = () => T|null|undefined;


/**
 * Common specification
 */
export type VanySpec<T> = MinRef<T|null|undefined>|VanySpecDerivableFunction<T>|T|null|undefined;


/**
 * Get value from specification
 * @param spec
 * @returns
 */
export function fromVanySpec<T>(spec: VanySpec<T>): T|undefined {
  if (typeof spec === 'function') return (spec as VanySpecDerivableFunction<T>)() ?? undefined;
  if (isRef<T|null|undefined>(spec)) return spec.value ?? undefined;
  return (spec as T|null|undefined) ?? undefined;
}