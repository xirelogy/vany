import {
  _cast,
} from '@xirelogy/xwts';

import VanyServiceable from '../features/VanyServiceable';
import VanyServiceNegotiable from '../features/VanyServiceNegotiable';

/**
 * Service provider (for cross component/class internal service negotiation)
 */
export default class VanyServiceProvider {
  /**
   * All registered services
   */
  private _services = new Map<Symbol, VanyServiceable>();


  /**
   * Register a service
   * @param ident Service identity (to be used for negotiation)
   * @param service Service instance
   */
  public registerService(ident: Symbol, service: VanyServiceable): void {
    this._services.set(ident, service);
  }


  /**
   * Negotiator instance
   */
  public get negotiator(): VanyServiceNegotiable {
    const _that = this;
    return {
      /**
       * @inheritdoc
       */
      negotiate<T extends VanyServiceable = VanyServiceable>(ident: Symbol): T|null {
        return _cast<T|undefined>(_that._services.get(ident)) ?? null;
      },
    };
  }
}