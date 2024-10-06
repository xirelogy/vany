import {
  h,
  render,
} from 'vue';

import {
  xw,
  _used,
} from '@xirelogy/xwts';

import VanyPromptDialogHost from '../internals/components/VanyPromptDialogHost.vue';
import VanyVue from '../setup/VanyVue';
import VanyServiceRequest from '../setup/VanyServiceRequest';
import VanyPromptServiceRequest from './requests/VanyPromptServiceRequest';


/**
 * Service function
 * @param request
 * @returns
 */
const defaultServicePrompt = async (request: VanyServiceRequest): Promise<any> => {
  const specRequest = request as VanyPromptServiceRequest<any>;
  const specOptions = specRequest.options;

  const children: Record<string, any> = {
    default: VanyVue.acceptFunctionOrTextAsFunction(specOptions.content),
  };

  if (specOptions.title) {
    children.header = VanyVue.acceptFunctionOrTextAsFunction(specOptions.title);
  }

  const hostComponent = h(VanyPromptDialogHost, { specOptions }, children);
  render(hostComponent, document.body);

  await xw.sleep(0); // Next-tick

  return await hostComponent.component!.exposed!.run();
}
export default defaultServicePrompt;