import {
  _cast,
} from '@xirelogy/xwts';

import { VanyCodec } from '../codecs/VanyCodec';
import VanyDummyCodec from '../codecs/VanyDummyCodec';
import VanyRegisteredFormItemRenderService from '../components/services/VanyRegisteredFormItemRenderService';
import VanyFormControlServiceHost from '../features/VanyFormControlServiceHost';
import { VanyFormControlNature } from '../types/VanyFormControlNature';
import { VanyFormValidateTrigger } from '../types/VanyFormValidateTrigger';
import { VanyInputChangeEventFunction } from '../types/VanyInputChangeEventFunction';
import { VanyInputInputEventFunction } from '../types/VanyInputInputEventFunction';

import VanyFocusFunctionForwarder from '../internals/comps/VanyFocusFunctionForwarder';
import createVanyFormControlRenderServiceHost from '../internals/createVanyFormControlRenderServiceHost';
import { useFormItemStateRenderService } from '../states/formItemState';


/**
 * Value forwarder
 */
type ForwardValueFunction<T> = (value: T|null) => void;


/**
 * Options to useVanyFormControlServiceHost
 */
interface UseVanyFormControlServiceHostOptions<BT, DT> {
  /**
   * The name attribute
   */
  nameAttr?: string|null;
  /**
   * The current value for the control
   */
  currentValue: BT|null;
  /**
   * Translation codec
   */
  codec?: VanyCodec<BT, DT>|null;
  /**
   * Default validation trigger
   * @defaultValue 'blur'
   */
  defaultValidateTrigger?: VanyFormValidateTrigger;
  /**
   * Control nature
   * @defaultValue 'input'
   */
  controlNature?: VanyFormControlNature;
}


/**
 * Access to rendering service
 * @param nameAttr
 * @returns
 */
function getRenderService(nameAttr: string|null|undefined, fwdFocus: VanyFocusFunctionForwarder): VanyRegisteredFormItemRenderService|null {
  if (typeof nameAttr !== 'string') return null;

  return useFormItemStateRenderService()?.registerControl(nameAttr, fwdFocus) ?? null;
}


/**
 * Access to form control's services
 * @param options
 * @returns
 */
export function useVanyFormControlServiceHost<BT, DT>(options: UseVanyFormControlServiceHostOptions<BT, DT>): VanyFormControlServiceHost<BT, DT> {

  const fwdFocus = new VanyFocusFunctionForwarder();
  const codec = options.codec ?? _cast<VanyCodec<BT, DT>>(new VanyDummyCodec<DT>);

  let currentUpdateValueFn: ForwardValueFunction<BT> = () => { };
  const onUpdateValueFn = (value: BT|null) => {
    currentUpdateValueFn(value);
  };

  // Try to obtain the rendering service
  const _renderService = getRenderService(options.nameAttr, fwdFocus);

  // Create service host
  const serviceHost = createVanyFormControlRenderServiceHost<BT, DT>({
    currentValue: options.currentValue,
    onUpdateValueFn,
    fwdFocus,
    codec,
    registeredControl: _renderService,
    defaultValidateTrigger: options.defaultValidateTrigger ?? 'blur',
    controlNature: options.controlNature ?? 'input',
  });

  return {
    /**
     * @inheritdoc
     */
    upstream: {
      /**
       * @inheritdoc
       */
      notifyBeforeUnmount(): void {
        serviceHost.notifyBeforeUnmount();
      },

      /**
       * @inheritdoc
       */
      notifyMounted(modelValue: BT|null): void {
        serviceHost.notifyMounted(modelValue);
      },

      /**
       * @inheritdoc
       */
      notifyWatch(modelValue: BT|null): void {
        serviceHost.notifyWatch(modelValue);
      },

      /**
       * @inheritdoc
       */
      notifyFocus(): Promise<boolean> {
        return fwdFocus.call();
      },

      /**
       * @inheritdoc
       */
      onUpdateModelValueEvent(fn: ForwardValueFunction<BT>) {
        currentUpdateValueFn = fn;
      },

      /**
       * @inheritdoc
       */
      onChangeEvent(fn: VanyInputChangeEventFunction<BT, DT>) {
        serviceHost.onChangeEvent(fn);
      },

      /**
       * @inheritdoc
       */
      onInputEvent(fn: VanyInputInputEventFunction): void {
        serviceHost.onInputEvent(fn);
      },
    },

    /**
     * @inheritdoc
     */
    downstream: serviceHost.export(),
  }
}