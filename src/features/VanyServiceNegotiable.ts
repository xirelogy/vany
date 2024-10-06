import VanyServiceable from './VanyServiceable';

/**
 * May negotiate for service interface
 */
export default interface VanyServiceNegotiable {
  /**
   * Negotiate for a service interface
   * @param ident Corresponding identity
   * @returns Service interface, if successfully negotiated
   */
  negotiate<T extends VanyServiceable = VanyServiceable>(ident: Symbol): T|null;
}