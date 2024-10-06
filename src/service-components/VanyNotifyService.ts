import VanyInRegistry from '../internals/VanyInRegistry';
import { VanyNotifyDockValue } from '../types/VanyNotifyDockValue';
import { VanyNotifyTemplateType } from '../types/VanyNotifyTemplateType';
import { VanyNotifyType } from '../types/VanyNotifyType';
import { VanyRenderFunction } from '../types/VanyRenderFunction';
import VanyNotifyServiceRequest from './requests/VanyNotifyServiceRequest';


/**
 * Defaults for VanyNotify
 */
export class VanyNotifyOptionsDefault {
  /**
   * Default template type
   */
  static readonly template: VanyNotifyTemplateType = 'normal';
  /**
   * Default notification dock
   */
  static readonly dock: VanyNotifyDockValue = 'bottom-right';
  /**
   * Default show duration (milliseconds)
   */
  static readonly duration: number = 3000;
  /**
   * Default closable
   */
  static readonly closable: boolean = true;
}


/**
 * Options to VanyNotify
 */
export interface VanyNotifyOptions {
  /**
   * Template type
   * @defaultValue 'normal'
   */
  template?: VanyNotifyTemplateType;
  /**
   * Notification type
   * @defaultValue undefined
   */
  type?: VanyNotifyType;
  /**
   * Title
   * @defaultValue undefined
   */
  title?: string|VanyRenderFunction;
  /**
   * Main content
   */
  content: string|VanyRenderFunction;
  /**
   * Where to dock the notification
   * @defaultValue 'bottom-right'
   */
  dock?: VanyNotifyDockValue;
  /**
   * Duration to show the notification (in milliseconds)
   * @defaultValue 3000;
   */
  duration?: number;
  /**
   * If the notification can be closed
   * @defaultValue true
   */
  closable?: boolean;
  /**
   * Notification click handler
   * @defaultValue undefined
   */
  onClick?: () => void;
  /**
   * Notification closed handler
   * @defaultValue undefined
   */
  onClose?: () => void;
}


/**
 * Instance of VanyNotify
 */
export interface VanyNotifyInstance {
  /**
   * Close the current notification
   */
  close(): void;
}


/**
 * Vany notification global service component
 */
export default class VanyNotifyService {
  /**
   * Create a notification instance
   * @param options Related options
   * @returns Created instance
   */
  static create(options: VanyNotifyOptions): VanyNotifyInstance {
    const request: VanyNotifyServiceRequest = {
      vanyClass: 'notify',
      options: options,
    };

    return VanyInRegistry.service(request);
  }
}
