import {
  nextTick,
} from 'vue';


type ResolveFunction = () => void;


/**
 * Create a busy queue (execute queued request in order)
 * @returns
 */
export function useVanyBusyQueue() {
  // If currently busy
  let isBusy = false;
  // Pending items awaiting unbusy state
  const pendings = [] as ResolveFunction[];


  /**
   * Enter busy state when allowed
   */
  function enterBusy(): Promise<void> {
    return new Promise((resolve) => {
      if (!isBusy) {
        // If not yet busy, mark and enter
        isBusy = true;
        resolve();
      } else {
        // If busy, queue up
        pendings.push(resolve);
      }
    });
  }


  /**
   * Exit from busy state
   */
  function exitBusy() {
    if (pendings.length <= 0) {
      // Nothing in queue, unmark and exit
      isBusy = false;
    } else {
      // Something in queue, handover to next
      const resolve = pendings.shift();
      nextTick(resolve);
    }
  }


  return {
    /**
     * Queue to run payload when not busy
     * @param fn Running function
     * @returns Result of running function
     */
    async queue<T>(fn: () => Promise<T>): Promise<T> {
      try {
        await enterBusy();
        return await fn();
      } finally {
        exitBusy();
      }
    }
  };
}