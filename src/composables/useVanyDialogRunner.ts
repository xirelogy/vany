import {
  Ref as MinRef,
} from '@xirelogy/vue-minimal';

import VanyDialog from '../components/VanyDialog.vue';
import VanyDialogRunner from '../features/VanyDialogRunner';


/**
 * Using VanyDialogRunner composable
 * @param refForm Reference to VanyDialog instance
 * @returns
 */
export function useVanyDialogRunner<T>(refDialog: MinRef<InstanceType<typeof VanyDialog>>|MinRef<any>, defaultReturn: T): VanyDialogRunner<T> {
  return new VanyDialogRunner<T>(() => refDialog.value?.serviceNegotiator, defaultReturn);
}