import {
  Stringable,
  XwOneTimeRelease,
  XwReleasable,
} from '@xirelogy/xwts';

import { VanyCodecMessageContext } from './VanyCodecMessageContext';



// Structure to store context item in stack
interface ContextItem {
  id: number;
  context: VanyCodecMessageContext;
}


/**
 * Last used context ID
 */
let lastContextId = -1;


/**
 * List of items (stack)
 */
const items: ContextItem[] = [];


/**
 * Look for stored items according to ID
 * @param id
 * @returns
 */
function findItem(id: number): number|null {
  let i = -1;
  for (const item of items) {
    ++i;
    if (item.id == id) return i;
  }

  return null;
}


/**
 * Setup for VanyCodecMessageContext
 */
export class VanyCodecMessageContextSetup {
  /**
   * Enter into context
   * @param context
   * @returns
   */
  static enterContext(context: VanyCodecMessageContext): XwReleasable {
    ++lastContextId;
    const currentId = lastContextId;

    items.push({
      id: currentId,
      context: context,
    });

    return new XwOneTimeRelease(() => {
      const itemIndex = findItem(currentId);
      if (itemIndex !== null) items.splice(itemIndex, 1);
    });
  }


  /**
   * Use specific context to perform message handling/formatting
   * @param typeClass Message type class
   * @param payload Corresponding payload related to the message
   * @param fallbackFn Fallback function in absence of handler
   * @returns
   */
  static usingContext(typeClass: string, payload: any, fallbackFn: () => string|Stringable): string|Stringable {
    const _handler = this.currentContext?.findMessageHandler(typeClass, payload);
    if (!_handler) return fallbackFn();

    return _handler();
  }


  /**
   * Get current context
   */
  static get currentContext(): VanyCodecMessageContext|null {
    const itemsLength = items.length;
    if (itemsLength <= 0) return null;

    return items[itemsLength - 1].context;
  }
}