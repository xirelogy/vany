/**
 * A function forwarder's handler
 * @template TArg Function argument
 * @template TRet Return from function call
 */
export interface VanyForwardHandler<TArg, TRet> {
  /**
   * Specify handling function (receiver)
   * @param fn
   */
  handleUsing(fn: (arg: TArg) => TRet): void;
}