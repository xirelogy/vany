import { VanyForwardHandler } from '../../types/VanyForwardHandler';

/**
 * A function forwarder
 * @template TArg Function argument
 * @template TRet Return from function call
 */
export default class VanyFunctionForwarder<TArg, TRet> implements VanyForwardHandler<TArg, TRet> {
  /**
   * Handling function
   */
  private _handleFn: (arg: TArg) => TRet;


  /**
   * @constrcutor
   * @param defaultFn Default handler function if not specify
   */
  constructor(defaultFn: (arg: TArg) => TRet) {
    this._handleFn = defaultFn;
  }


  /**
   * Call the function
   * @param arg
   * @returns
   */
  call(arg: TArg): TRet {
    return this._handleFn(arg);
  }


  /**
   * @inheritdoc
   */
  handleUsing(fn: (arg: TArg) => TRet): void {
    this._handleFn = fn;
  }
}
