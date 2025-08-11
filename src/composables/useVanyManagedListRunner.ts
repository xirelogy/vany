import {
  ref,
  nextTick,
  watch,
  type Ref,
} from 'vue';

import {
  xw,
  _cast,
  _used,
} from '@xirelogy/xwts';

import { VanyCodec, VanyCodecOptions } from '../codecs/VanyCodec';
import VanyDummyCodec from '../codecs/VanyDummyCodec';
import { VanyInvalidValueCodecError } from '../codecs/exceptions/VanyInvalidValueCodecError';
import { VanyTableRowKeyFunction } from '../types/VanyTableRowKeyFunction';

import {
  PrimitiveType,
  useVanySnapshotEqual,
} from './useVanySnapshotEqual';

const debug = xw.debugLog.defineLazy('Vany.[VanyManagedListRunner]');


/**
 * Base for template type
 */
type TBase = Record<string, any>;


/**
 * Create an empty form item
 * @returns Form item representing empty
 */
type CreateEmptyFormItemFunction<FT> = () => FT;

/**
 * Check if form item is valid (not-empty)
 * @param item Form item to be checked
 * @returns If item value
 */
type CheckFormItemFunction<FT> = (item: FT) => boolean;

/**
 * Create snapshot for given target form item
 * @param item Form item target
 * @returns Item snapshot
 */
type SnapFormItemFunction<FT extends TBase> = (item: TWithMeta<FT>) => PrimitiveType;


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
   * If current item in error
   */
  isError: boolean;
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
type TWithMeta<FT extends TBase> = FT & VanyListRunnerMetaHost;


/**
 * Exported type
 */
export type VanyListMeta<FT extends TBase> = TWithMeta<FT>;


/**
 * Runner options
 */
interface VanyManagedListRunnerOptions<FT extends TBase, MT> {
  /**
   * Initialize list
   */
  initModelItems: MT[];
  /**
   * Codec to handle translation between model value and form value
   */
  modelCodec?: VanyCodec<MT, FT>;
  /**
   * Function to create an empty (new) form item
   */
  createEmptyFormItem: CreateEmptyFormItemFunction<FT>;
  /**
   * Function to check if form item validity
   */
  checkFormItem: CheckFormItemFunction<FT>;
  /**
   * Function to check if form item new
   */
  newFormItem?: CheckFormItemFunction<FT>;
  /**
   * Function to create value snapshot for change detection
   */
  snapFormItem?: SnapFormItemFunction<FT>;
  /**
   * Watch for items updated (raw)
   * @param items Current items
   * @param isChanged If changes detected
   */
  watchRaw?: (items: TWithMeta<FT>[], isChanged: boolean) => void;
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
 * Options to VanyManagedListRunner's resetItems()
 */
interface VanyManagedListRunnerResetItemsOptions {
  /**
   * If preserve uncommit (new) items
   * @defaultValue false
   */
  preserve?: boolean;
}


/**
 * Runner instance
 */
interface VanyManagedListRunner<FT extends TBase, MT> {
  /**
   * Codec that can be attached to form control
   */
  readonly codec: VanyCodec<MT[], TWithMeta<FT>[]>;
  /**
   * All list items: (form level items)
   */
  formItems: Ref<TWithMeta<FT>[]>;
  /**
   * Reset items
   * @param items Items to be reset into
   * @param options
   */
  resetModelItems: (items: MT[], options?: VanyManagedListRunnerResetItemsOptions) => void;
  /**
   * Get items
   * @returns
   */
  getModelItems: () => Promise<MT[]>;
  /**
   * Add a (new) form item
   * @param item Item to be added
   * @returns Item added (with metadata)
   */
  addFormItem: (item: FT) => Promise<TWithMeta<FT>>;
  /**
   * Check if given form item deletable
   * @param item
   * @returns If deletable
   */
  isFormItemDeletable: (item: TWithMeta<FT>) => boolean;
  /**
   * Delete a form item
   * @param item Item to be deleted
   * @returns If item deleted
   */
  deleteFormItem: (item: TWithMeta<FT>) => Promise<boolean>;
  /**
   * Row key function for VanyTable
   */
  tableRowKeyFunction: VanyTableRowKeyFunction;
}


/**
 * Using VanyManagedListRunner composable
 * @param options
 * @returns
 * @template FT Form item type
 * @template MT Model item type
 */
export function useVanyManagedListRunner<FT extends TBase, MT = FT>(options: VanyManagedListRunnerOptions<FT, MT>): VanyManagedListRunner<FT, MT> {
  // Main storage
  const formItems = ref([]) as Ref<TWithMeta<FT>[]>;

  const _modelCodec = options?.modelCodec ?? _cast<VanyCodec<MT, FT>>(new VanyDummyCodec());
  const _hasNew = options?.hasNew ?? true;
  const _deep = options?.deep ?? 2;

  // Snapshot
  let _lastSnap: PrimitiveType[]|undefined = undefined;

  // Set metadata
  function setMeta(item: TWithMeta<FT>, isNew: boolean, isBlank?: boolean) {
    // Append meta
    item.$id = xw.random.lowerAlphanumString(8);
    item.$meta = {
      isNew: isNew,
      isBlank: isNew ? (isBlank ?? true) : false,
      isError: false,
    };
  }

  // Create an empty item with metadata
  function createEmptyWithMeta(): TWithMeta<FT> {
    const ret = options.createEmptyFormItem() as TWithMeta<FT>;
    setMeta(ret, true);
    return ret;
  }

  // Check item for new (uncommitted) item
  function checkIsNew(item: FT): boolean {
    // When 'newFormItem' not provided, alway assume not new
    if (!options.newFormItem) return false;

    return options.newFormItem(item);
  }

  // Adapt item with metadata
  function adaptWithMeta(item: FT, isNew?: boolean): TWithMeta<FT> {
    const _isNew = isNew ?? false;
    const ret = { ...item } as TWithMeta<FT>;
    setMeta(ret, _isNew, false);
    return ret;
  }

  // Find index for given item
  function findItemIndex(targetFormItem: TWithMeta<FT>): number|undefined {
    for (const [i, item] of formItems.value.entries()) {
      if (item.$id == targetFormItem.$id) return i;
    }
    return undefined;
  }

  // Accept items
  for (const modelItem of options.initModelItems) {
    const formItem = _modelCodec.format(modelItem) as FT;
    formItems.value.push(adaptWithMeta(formItem));
  }

  // Default new entry
  if (_hasNew) {
    formItems.value.push(createEmptyWithMeta());
  }

  // Reset items
  function resetModelItems(modelItems: MT[], options?: VanyManagedListRunnerResetItemsOptions): void {
    debug.r.log('resetModelItems()', modelItems);

    const _isPreserve = options?.preserve ?? false;
    const newItems = [];

    // Process incoming items
    for (const modelItem of modelItems) {
      const formItem = _modelCodec.format(modelItem) as FT;
      const isNew = checkIsNew(formItem);
      if (_isPreserve && isNew) continue;
      newItems.push(adaptWithMeta(formItem, isNew));
    }

    // All new items will be preserved (if selected)
    if (_isPreserve) {
      for (const oldFormItem of formItems.value) {
        if (!oldFormItem.$meta.isNew) continue;
        newItems.push(oldFormItem);
      }
    } else {
      // Rehandle 'new'
      if (_hasNew) {
        newItems.push(createEmptyWithMeta());
      }
    }

    // Replace
    formItems.value = newItems;
  }

  // Get items (without metadata)
  function getItemsWithoutMeta(): FT[] {
    const ret = [] as FT[];

    for (const formItem of formItems.value) {
      if (formItem.$meta.isNew && formItem.$meta.isBlank) continue;
      if (formItem.$meta.isError) continue;

      // Cast and delete
      const retItem = {...formItem} as FT;
      delete retItem.$id;
      delete retItem.$meta;

      ret.push(retItem);
    }

    return ret;
  }

  // Get model data
  async function getModelItems(): Promise<MT[]> {
    const ret = [] as MT[];

    for (const formItem of getItemsWithoutMeta()) {
      const modelItem = await xw.asAsyncTarget(_modelCodec.parse(formItem));
      if (!modelItem) continue;

      ret.push(modelItem);
    }

    return ret;
  }

  // Get the first index of a blank form-item
  function getFirstBlankFormItemIndex(): number|undefined {
    let i = -1;
    for (const formItem of formItems.value) {
      ++i;
      if (formItem.$meta.isBlank) return i;
    }
    return undefined;
  }

  // Add a form item
  async function addFormItem(item: FT): Promise<TWithMeta<FT>> {
    debug.r.log('addFormItem()', item);

    const metaItem = adaptWithMeta(item, true);
    const index = getFirstBlankFormItemIndex();

    if (index !== undefined) {
      formItems.value.splice(index, 0, metaItem);
    } else {
      formItems.value.push(metaItem);
    }

    return metaItem;
  }

  // Delete a form item
  async function deleteFormItem(item: TWithMeta<FT>): Promise<boolean> {
    debug.r.log('deleteFormItem()', item);

    const index = findItemIndex(item);
    if (index === undefined) return false;

    formItems.value.splice(index, 1);

    nextTick(() => {
      onWatch(formItems.value);
    });

    return true;
  }

  // Get form items snapshot
  function getFormItemsSnap(newFormItems: TWithMeta<FT>[]): PrimitiveType[]|undefined {
    if (!options.snapFormItem) return undefined;

    const ret = [];
    for (const newFormItem of newFormItems) {
      ret.push(options.snapFormItem(newFormItem));
    }

    return ret;
  }

  // Check if form item changed
  function checkFormItemsChanged(newFormItems: TWithMeta<FT>[]): boolean {
    const newSnap = getFormItemsSnap(newFormItems);
    if (newSnap === undefined) {
      _lastSnap = undefined;
      return false;
    }

    const isEqual = useVanySnapshotEqual(_lastSnap, newSnap);
    _lastSnap = newSnap;

    return !isEqual;
  }

  // Handle 'watched' changed
  async function onWatch(newFormItems: TWithMeta<FT>[]) {
    const isChanged = checkFormItemsChanged(newFormItems);
    options.watchRaw?.(newFormItems, isChanged);

    // Handle non-blank new
    nextTick(() => {
      for (const newFormItem of newFormItems) {
        if (newFormItem.$meta.isBlank) {
          // When blank -> hasData, item becomes valid
          if (newFormItem.$meta.isError) continue;

          const hasData = options.checkFormItem(newFormItem);
          if (!hasData) continue;
          debug.r.debug(`[${newFormItem.$id}] watched: new blank item now has data`);

          // Clear the 'blank' flag
          newFormItem.$meta.isBlank = false;

          // Create new empty record
          if (_hasNew) {
            formItems.value.push(createEmptyWithMeta());
          }
        }
      }
    });
  }

  // Watcher
  watch(() => formItems.value, onWatch, {
    deep: _deep,
  });

  // Create a list codec
  function createListCodec<MT = FT>(modelCodec: VanyCodec<MT, FT>): VanyCodec<MT[], TWithMeta<FT>[]> {
    return new class extends VanyCodec<MT[], TWithMeta<FT>[]> {
      /**
      * @inheritdoc
      */
      public async parse(items: TWithMeta<FT>[]|null, options?: VanyCodecOptions): Promise<MT[]|null> {
        _used(options);
        if (items === null) return null;

        const ret = [];
        for (const item of items) {
          if (item.$meta.isNew && item.$meta.isBlank) continue;
          if (item.$meta.isError) throw new VanyInvalidValueCodecError();

          const subItem = await xw.asAsyncTarget(modelCodec.parse(item));
          if (!subItem) throw new VanyInvalidValueCodecError();

          ret.push(subItem);
        }

        return ret;
      }

      /**
      * @inheritdoc
      */
      public format(items: MT[]|null, options?: VanyCodecOptions): TWithMeta<FT>[]|null {
        _used(options);
        if (items === null) return null;

        const ret = [];
        for (const item of items) {
          ret.push(adaptWithMeta(modelCodec.format(item) as FT));
        }

        return ret;
      }
    };
  }

  const _codec = createListCodec(_modelCodec);

  return {
    codec: _codec,
    formItems: formItems,
    resetModelItems,
    getModelItems,
    isFormItemDeletable: (item: TWithMeta<FT>) => {
      if (!item.$meta.isNew) return true;
      if (!item.$meta.isBlank) return true;
      return false;
    },
    tableRowKeyFunction: (row: any) => {
      return row.$id ?? '';
    },
    addFormItem,
    deleteFormItem,
  }
}
