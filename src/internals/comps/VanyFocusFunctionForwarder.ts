import VanyFunctionForwarder from './VanyFunctionForwarder';

/**
 * A function forwarder for focus()
 */
export default class VanyFocusFunctionForwarder extends VanyFunctionForwarder<void, Promise<boolean>> {
  /**
   * @constructor
   */
  constructor() {
    super(async () => {
      return false;
    });
  }
}