import {
  Ref as MinRef,
} from '@xirelogy/vue-minimal';

import {
  xw,
  Stringable,
} from '@xirelogy/xwts';

import { VanyCurrentlyBusyError } from './exceptions/VanyCurrentlyBusyError';


/**
 * Shorthand for any pattern of a handler function, sync/async
 */
type AnyHandlerFunction = (() => void)|(() => Promise<void>);

/**
 * String processor function
 */
type StringProcessorFunction = (text: string) => string;


/**
 * Remove any title case of single word
 * @param word
 */
function _untitleWord(word: string): string {
  if (word.length < 1) return '';

  const upperWord = word.toUpperCase();
  const lowerWord = word.toLowerCase();

  if (word == lowerWord) return word; // Always maintain the lowercase
  if (word.length > 1 && word == upperWord) return word; // Always maintain the uppercase

  if (word[0] == lowerWord[0]) return word; // Maintain the 'pattern' when first letter is already lowercase

  // Otherwise use the lowercase version
  return lowerWord;
}


/**
 * Remove any title case of text
 * @param text
 * @param preprocFn Preprocessor function
 * @returns
 */
function _untitleText(text: string, preprocFn?: StringProcessorFunction): string {
  // Preprocess the text if applicable
  const _preprocFn = preprocFn ?? ((text: string) => text);
  const t = _preprocFn(text);

  // Split into words
  const words = t.trim().split(' ');

  // Process each word individually
  let r = '';
  for (const word of words) {
    if (word.length < 1) continue;
    r += ' ' + _untitleWord(word);
  }

  return r.substring(1);
}


/**
 * UI related helpers
 */
export default class VanyUi {
  /**
   * Maintain the busy flag while the given function is executing
   * @param flag Busy flag to be maintained
   * @param fn Target function
   * @param busyHandler Busy handler function
   * @returns Execution result from executing the target function
   */
  static async busyWhile<T>(flag: MinRef<boolean>, fn: () => Promise<T>, busyHandler?: AnyHandlerFunction): Promise<T> {
    const _busyHandler = busyHandler ?? (() => { throw new VanyCurrentlyBusyError(); });

    if (flag.value) await xw.asAsyncFn(_busyHandler);
    flag.value = true;

    try {
      return await fn();
    } finally {
      flag.value = false;
    }
  }


  /**
   * Remove any title case from given text
   * @param text
   * @returns
   */
  static untitleText(text: string|Stringable, preprocFn?: StringProcessorFunction): string|Stringable {
    if (typeof text === 'string') return _untitleText(text, preprocFn);

    return {
      toString() {
        return _untitleText(xw.normalizeString(text), preprocFn);
      },
    }
  }
}