import {
  Stringable,
} from '@xirelogy/xwts';


/**
 * Signature for a handle function
 */
type HandleFunction = () => string|Stringable;


/**
 * Context to format VanyCodec related message
 */
export interface VanyCodecMessageContext {
  /**
   * Try to find handle function to format a message
   * @param typeClass Message type class
   * @param payload Corresponding payload related to the message
   * @returns Handler function, if found
   */
  findMessageHandler(typeClass: string, payload: any): HandleFunction|null;
}