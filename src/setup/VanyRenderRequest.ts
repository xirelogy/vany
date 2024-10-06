import {
  useSlots,
} from 'vue';


// Import types
type UseSlotsReturn = ReturnType<typeof useSlots>;


/**
 * Request to render (in vany)
 */
export default interface VanyRenderRequest {
  /**
   * Class name
   */
  vanyClass: string;
  /**
   * Incoming raw attributes
   */
  attrs: Record<string, any>;
  /**
   * Included slots
   */
  slots: UseSlotsReturn;
}