import {
  Stringable,
  XwEventBroker,
  XwReleasable,
} from '@xirelogy/xwts';

import { type VanyModelValueHostable } from './interfaces/VanyModelValueHostable';
import { type VanyModalRemoteService } from './services/VanyModalRemoteService';
import { type VanyModalEvent } from '../types/VanyModalEvent';


/**
 * Create an instance of VanyModalRemoteService
 * @param modelValueHost
 * @param eventBrokers
 * @returns
 */
export default function createVanyModalRemoteService(
  modelValueHost: VanyModelValueHostable<boolean>,
  eventBrokers: Map<VanyModalEvent, XwEventBroker<void>>,
  name: string|Stringable,
) : VanyModalRemoteService {
  return {
    /**
     * @inheritdoc
     */
    vanyServiceClass: 'VanyModalRemoteService',

    /**
     * @inheritdoc
     */
    get name(): string|Stringable {
      return name;
    },

    /**
     * @inheritdoc
     */
    get currentModelValue(): boolean {
      return modelValueHost.currentValue;
    },

    /**
     * @inheritdoc
     */
    setShowModelValue(value: boolean): void {
      modelValueHost.notifyWatch(value);
    },

    /**
     * @inheritdoc
     */
    subscribeModelValueUpdated(fn: (value: boolean) => void): XwReleasable|null {
      return modelValueHost.subscribeModelValueUpdated(fn);
    },

    /**
     * @inheritdoc
     */
     subscribeModalEvent(eventType: VanyModalEvent, fn: () => void): XwReleasable|null {
      const eventBroker = eventBrokers.get(eventType);
      if (typeof eventBroker === 'undefined') return null;

      return eventBroker.expose().subscribe(fn);
    },
  };
}