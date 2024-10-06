/**
 * A callable interface
 */
export default interface VanyCallable<TArg, TRet> {
  /**
   * Make a call
   * @param arg 
   * @returns
   */
  call(arg: TArg): TRet;
}