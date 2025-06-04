import VanyFunctionForwarder from './VanyFunctionForwarder';

/**
 * A function forwarder for notifyControlKeyDown()/notifyControlKeyUp()
 */
export default class VanyAutocompleteKeyboardEventFunctionForwarder extends VanyFunctionForwarder<KeyboardEvent, void> {
  /**
   * @constructor
   */
  constructor() {
    super(() => { });
  }
}