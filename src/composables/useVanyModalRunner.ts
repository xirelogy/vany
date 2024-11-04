import {
  Ref as MinRef,
} from '@xirelogy/vue-minimal';

import VanyDialog from '../components/VanyDialog.vue';
import VanyDrawer from '../components/VanyDrawer.vue';
import VanyModalRunner from '../features/VanyModalRunner';


/**
 * Using VanyModalRunner composable
 * @param refModal Reference to modal providing instance
 * @param defaultReturn Default return value
 * @returns
 */
export function useVanyModalRunner<T>(
  refModal: MinRef<InstanceType<typeof VanyDialog>>|MinRef<InstanceType<typeof VanyDrawer>>|MinRef<any>,
  defaultReturn: T
): VanyModalRunner<T> {
  return new VanyModalRunner<T>(() => refModal.value?.serviceNegotiator, defaultReturn);
}