import {
  Ref as MinRef,
} from '@xirelogy/vue-minimal';

import VanyDialog from '../components/VanyDialog.vue';
import { useVanyModalRunner } from './useVanyModalRunner';
import VanyModalRunner from '../features/VanyModalRunner';


/**
 * Using VanyDialogRunner composable
 * @param refDialog Reference to VanyDialog instance
 * @param defaultReturn Default return value
 * @returns
 * @deprecated useVanyDialogRunner() is replaced with useVanyModalRunner()
 */
export function useVanyDialogRunner<T>(refDialog: MinRef<InstanceType<typeof VanyDialog>>|MinRef<any>, defaultReturn: T): VanyModalRunner<T> {
  return useVanyModalRunner<T>(refDialog, defaultReturn);
}