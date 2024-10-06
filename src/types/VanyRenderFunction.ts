import {
  type VNode as MinVNode,
} from '@xirelogy/vue-minimal';


/**
 * A rendering function (may produce a VNode)
 */
export type VanyRenderFunction = () => MinVNode|MinVNode[];