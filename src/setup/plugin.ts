import {
  _used,
  _cast,
} from '@xirelogy/xwts';

import {
  App as VueApp,
  Plugin as VuePlugin,
} from 'vue';

import {
  App as MinApp,
} from '@xirelogy/vue-minimal';

import VanyOptions from './VanyOptions';
import VanyInRegistry from '../internals/VanyInRegistry';

import pluginInitComponents from '../components/plugin';
import pluginInitDirectives from '../directives/plugin';
import pluginInitDefaultServices from '../service-components/plugin';

import { initVanyFormCodecMessageContext } from '../features/VanyFormCodecMessageContext';


const plugin: VuePlugin<VanyOptions[]> = {
  /**
   * @inheritdoc
   */
  install(app: MinApp, ...options: VanyOptions[]): void {

    for (const option of options) {
      const useActuator = option.useActuator ?? null;
      if (useActuator === null) continue;

      const handle = useActuator.install(app, option.useActuatorOptions ?? []);
      VanyInRegistry.registerHandle(handle);
    }

    const _app = app as VueApp;

    // Initializations
    pluginInitComponents(_app);
    pluginInitDirectives(_app);

    // Common initialization
    initVanyFormCodecMessageContext();

    // Defaults
    pluginInitDefaultServices();
  }
};

export default plugin;
