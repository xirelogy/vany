import {
  inject,
} from 'vue';

import VanyAutocompleteKeywordFunctionForwarder from '../internals/comps/VanyAutocompleteKeywordFunctionForwarder';


/**
 * Injection key
 */
export const KEY = Symbol();


/**
 * State class
 */
export class AutocompleteState {
  /**
   * Keyword forwarder
   */
  readonly fwdNotifyKeyword: VanyAutocompleteKeywordFunctionForwarder;


  /**
   * @constructor
   * @param fwdNotifyKeyword
   */
  constructor(fwdNotifyKeyword: VanyAutocompleteKeywordFunctionForwarder) {
    this.fwdNotifyKeyword = fwdNotifyKeyword;
  }
}


/**
 * Create an autocomplete state
 * @param fwdNotifyKeyword
 * @returns
 */
export function createAutocompleteState(fwdNotifyKeyword: VanyAutocompleteKeywordFunctionForwarder): AutocompleteState {
  return new AutocompleteState(fwdNotifyKeyword);
}


/**
 * Use autocomplete state's forwarder of notify keyword
 * @returns
 */
export function useAutocompleteFwdNotifyKeyword(): VanyAutocompleteKeywordFunctionForwarder|null {
  const injected = inject<AutocompleteState|null>(KEY, null);
  if (injected === null) return null;

  return injected.fwdNotifyKeyword;
}
