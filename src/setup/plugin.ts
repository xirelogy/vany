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
import VanyActuatorHandle from './VanyActuatorHandle';
import VanyCommonActuatorHandle from './VanyCommonActuatorHandle';

import pluginInitComponents from '../components/plugin';
import pluginInitDirectives from '../directives/plugin';
import pluginInitDefaultDirectives from '../directives/defaults';
import pluginInitDefaultServices from '../service-components/plugin';

import { initVanyFormCodecMessageContext } from '../features/VanyFormCodecMessageContext';


const plugin: VuePlugin<VanyOptions[]> = {
  /**
   * @inheritdoc
   */
  install(app: MinApp, ...options: VanyOptions[]): void {

    let _handle: VanyActuatorHandle|null = null;
    for (const option of options) {
      const useActuator = option.useActuator ?? null;
      if (useActuator === null) continue;

      const handle = useActuator.install(app, option.useActuatorOptions ?? []);
      VanyInRegistry.registerHandle(handle);
      _handle = handle;
    }

    const _app = app as VueApp;

    // Default directives
    if (_handle instanceof VanyCommonActuatorHandle) pluginInitDefaultDirectives(_handle);

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
