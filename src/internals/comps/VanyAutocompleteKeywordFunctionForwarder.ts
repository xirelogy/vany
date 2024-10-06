import VanyFunctionForwarder from './VanyFunctionForwarder';

/**
 * A function forwarder for notifyKeyword()
 */
export default class VanyAutocompleteKeywordFunctionForwarder extends VanyFunctionForwarder<string, void> {
  /**
   * @constructor
   */
  constructor() {
    super(() => { });
  }
}