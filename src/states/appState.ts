import {
  inject,
} from 'vue';

import {
  type VanyErrorSourceType,
} from '../types/VanyErrorSourceType';


/**
 * Injection key
 */
export const KEY = Symbol();


/**
 * Function signature: raise error (directly)
 */
type RaiseErrorFunction = (source: VanyErrorSourceType, err: Error) => void;

/**
 * Function signature: Process context as error source
 */
type ContextSourceFunction<T> = (context: T) => VanyErrorSourceType;

/**
 * Function signature: raise error with context
 */
type ContextErrorFunction<T> = (context: T, err: Error) => void;


/**
 * State class
 */
export class AppState {
  /**
   * Error function
   */
  readonly raiseError: RaiseErrorFunction;


  /**
   * @constructor
   * @param raiseError
   */
  constructor(raiseErrorFn: RaiseErrorFunction) {
    this.raiseError = raiseErrorFn;
  }
}


/**
 * Create an app state
 * @param raiseErrorFn
 * @returns
 */
export function createAppState(raiseErrorFn: RaiseErrorFunction): AppState {
  return new AppState(raiseErrorFn);
}


/**
 * Use app state's raise error function
 * @param sourceFn
 * @returns
 */
export function useAppStateRaiseError<T>(sourceFn: ContextSourceFunction<T>): ContextErrorFunction<T> {
  const injected = inject<AppState|null>(KEY, null);
  if (injected === null) return () => { }; // Fallback to a dummy function

  return (context: T, err: Error) => {
    const source = sourceFn(context);
    injected.raiseError(source, err);
  };
}