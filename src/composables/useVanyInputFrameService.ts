import {
  Ref,
} from 'vue';

import {
  Ref as MinRef,
} from '@xirelogy/vue-minimal';

import VanyInputFrame from '../components/VanyInputFrame.vue';
import VanyInputGroup from '../components/VanyInputGroup.vue';
import VanyInputFrameService from '../features/VanyInputFrameService';

import {
  KEY as VanyInputFrameRemoteServiceKey,
  VanyInputFrameRemoteService,
} from '../internals/services/VanyInputFrameRemoteService';


/**
 * Get the remote service
 * @param refInputFrame
 * @returns
 */
function getRemoteService(refInputFrame: MinRef<InstanceType<typeof VanyInputFrame>>|MinRef<InstanceType<typeof VanyInputGroup>>|MinRef<any>): VanyInputFrameRemoteService|null {
  return (refInputFrame as Ref<InstanceType<typeof VanyInputFrame>>|Ref<InstanceType<typeof VanyInputGroup>>).value
    ?.serviceNegotiator
    ?.negotiate<VanyInputFrameRemoteService>(VanyInputFrameRemoteServiceKey);
}


/**
 * Access to input frame service for the frame's content
 * @param refInputFrame
 * @returns
 */
export function useVanyInputFrameService(refInputFrame: MinRef<InstanceType<typeof VanyInputFrame>>|MinRef<InstanceType<typeof VanyInputGroup>>|MinRef<any>): VanyInputFrameService {
  return {
    /**
     * @inheritdoc
     */
    notifyFocus() {
      getRemoteService(refInputFrame)?.notifyFocus();
    },

    /**
     * @inheritdoc
     */
    notifyBlur() {
      getRemoteService(refInputFrame)?.notifyBlur();
    },

    /**
     * @inheritdoc
     */
    notifyValidated(success: boolean|null, message: string|Error): void {
      getRemoteService(refInputFrame)?.notifyValidated(success, message);
    },
  };
}