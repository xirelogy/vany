import '../styles/index.scss';

export * from './codecs/index';
export * from './components/index';
export * from './composables/index';
export * from './directives/index';
export * from './features/index';
export * from './reactives/index';
export * from './service-components/index';
export * from './setup/index';
export * from './types/index';

export {
  type Ref as MinRef,
  type App as MinApp,
  type VNode as MinVNode,
  type Slot as MinSlot,
} from '@xirelogy/vue-minimal';

export { default as Vany } from './setup/plugin';
