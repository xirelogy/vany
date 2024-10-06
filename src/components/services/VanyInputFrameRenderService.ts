import { VanyValidatedResultFunction } from '../../types/VanyValidatedResultFunction';

type SimpleFunction = () => void;


/**
 * Render service for VanyInputFrame
 */
export default interface VanyInputFrameRenderService {
  /**
   * Handle focus event (from underlying input)
   * @param fn
   */
  onFocus(fn: SimpleFunction): void;

  /**
   * Handle blur event (from underlying input)
   * @param fn
   */
  onBlur(fn: SimpleFunction): void;

  /**
   * Handle form control validated
   * @param fn Handler function
   */
  onValidated(fn: VanyValidatedResultFunction): void;
}