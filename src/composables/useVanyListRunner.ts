import {
  ref,
  nextTick,
  watch,
  Ref,
} from 'vue';

import {
  xw,
  _cast,
  _used,
} from '@xirelogy/xwts';

import { VanyTableRowKeyFunction } from '../types/VanyTableRowKeyFunction';

const debug = xw.debugLog.defineLazy('Vany.[VanyListRunner]');


/**
 * Base for template type
 */
type TBase = Record<string, any>;


/**
 * Create an empty entry
 */
type CreateEmptyFunction<T> = () => T;

/**
 * Check if item is valid (not-empty)
 */
type CheckItemFunction<T> = (item: T) => boolean;

/**
 * Watch notification
 */
type WatchFunction<T> = (items: T[]) => void;


/**
 * Metadata declaration
 */
interface VanyListRunnerMeta {
  /**
   * If current item is new
   */
  isNew: boolean;
  /**
   * If current item is blank (when newly created)
   */
  isBlank: boolean;
  /**
   * Associated state object
   */
  state?: Record<string, any>;
}


/**
 * Metadata host declaration
 */
interface VanyListRunnerMetaHost {
  /**
   * Unique ID
   */
  $id: string;
  /**
   * Metadata
   */
  $meta: VanyListRunnerMeta;
}


/**
 * T with metadata
 */
type TWithMeta<T extends TBase> = T & VanyListRunnerMetaHost;


/**
 * Runner options
 */
interface VanyListRunnerOptions<T> {
  /**
   * Initialize list
   */
  init: T[];
  /**
   * Function to create an empty (new) item
   */
  createEmpty: CreateEmptyFunction<T>;
  /**
   * Function to check for item validity
   */
  checker: CheckItemFunction<T>;
  /**
   * When changes observed (watched)
   */
  watch?: WatchFunction<T>;
  /**
   * If feature to add new items available
   * @defaultValue true
   */
  hasNew?: boolean;
  /**
   * Depth of the list watch
   * @defaultValue 2
   */
  deep?: true|number;
}


/**
 * Options to VanyListRunner's resetItems()
 */
interface VanyListRunnerResetItemsOptions {
  /**
   * If preserve uncommit (new) items
   * @defaultValue false
   */
  preserve?: boolean;
}


/**
 * Runner instance
 */
interface VanyListRunner<T extends TBase> {
  /**
   * All list items
   */
  items: Ref<TWithMeta<T>[]>;
  /**
   * Reset items
   * @param items
   * @param options
   */
  resetItems: (items: T[], options?: VanyListRunnerResetItemsOptions) => void;
  /**
   * Get effective items
   * @returns
   */
  getItems: () => T[];
  /**
   * Check if given item deletable
   * @param item
   * @returns If deletable
   */
  isItemDeletable: (item: TWithMeta<T>) => boolean;
  /**
   * Row key function for VanyTable
   */
  tableRowKeyFunction: VanyTableRowKeyFunction;
  /**
   * Delete an item
   * @param item Item to be deleted
   * @returns If item deleted
   */
  deleteItem: (item: TWithMeta<T>) => Promise<boolean>;
}


/**
 * Using VanyListRunner composable
 * @param options
 * @returns
 */
export function useVanyListRunner<T extends TBase>(options: VanyListRunnerOptions<T>): VanyListRunner<T> {
  const items = ref([]) as Ref<TWithMeta<T>[]>;

  const _hasNew = options?.hasNew ?? true;
  const _deep = options?.deep ?? 2;

  // Create an empty item with metadata
  function createEmptyWithMeta(): TWithMeta<T> {
    const ret = options.createEmpty() as TWithMeta<T>;

    // Append meta
    ret.$id = xw.random.lowerAlphanumString(8);
    ret.$meta = {
      isNew: true,
      isBlank: true,
    };

    return ret;
  }

  // Adapt item with metadata
  function adaptWithMeta(item: T): TWithMeta<T> {
    const ret = { ...item } as TWithMeta<T>;

    // Append meta
    ret.$id = xw.random.lowerAlphanumString(8);
    ret.$meta = {
      isNew: false,
      isBlank: false,
    };

    return ret;
  }

  // Find index for given item
  function findItemIndex(targetItem: TWithMeta<T>): number|undefined {
    for (const [i, item] of items.value.entries()) {
      if (item.$id == targetItem.$id) return i;
    }
    return undefined;
  }

  // Accept items
  for (const initItem of options.init) {
    items.value.push(adaptWithMeta(initItem));
  }

  // Default new entry
  if (_hasNew) {
    items.value.push(createEmptyWithMeta());
  }

  // Reset items
  function resetItems(resetItems: T[], options?: VanyListRunnerResetItemsOptions): void {
    debug.r.debug('resetItems()', resetItems);

    const newItems = [];
    for (const resetItem of resetItems) {
      newItems.push(adaptWithMeta(resetItem));
    }

    if (options?.preserve ?? false) {
      for (const oldItem of items.value) {
        if (!oldItem.$meta.isNew) continue;
        newItems.push(oldItem);
      }
    } else {
      if (_hasNew) {
        newItems.push(createEmptyWithMeta());
      }
    }

    // Replace
    items.value = newItems;
  }

  // Get items
  function getItems(): T[] {
    const ret = [] as T[];

    for (const item of items.value) {
      if (item.$meta.isNew && item.$meta.isBlank) continue;
      ret.push(item);
    }

    return ret;
  }

  // Delete an item
  async function deleteItem(item: TWithMeta<T>): Promise<boolean> {
    debug.r.debug('deleteItem()', item);

    const index = findItemIndex(item);
    if (index === undefined) return false;

    items.value.splice(index, 1);
    return true;
  }

  // Watcher
  watch(() => items.value, (newItems) => {
    _used(newItems);
    nextTick(() => {
      for (const item of items.value) {
        if (!item.$meta.isBlank) continue;
        const hasData = options.checker(item);
        if (!hasData) continue;
        debug.r.debug(`[${item.$id}] watched: new blank item now has data`);

        // Clear the 'blank' flag
        item.$meta.isBlank = false;

        // Create new empty record
        if (_hasNew) {
          items.value.push(createEmptyWithMeta());
        }

        options.watch?.(items.value);
      }
    });
  }, {
    deep: _deep,
  });

  return {
    items: items,
    resetItems,
    getItems,
    isItemDeletable: (item: TWithMeta<T>) => {
      if (!item.$meta.isNew) return true;
      if (!item.$meta.isBlank) return true;
      return false;
    },
    tableRowKeyFunction: (row: any) => {
      return row.$id ?? '';
    },
    deleteItem,
  }
}