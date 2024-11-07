/**
 * ID extraction function
 */
type IdFunction<T, K> = (item: T) => K|null|undefined;

/**
 * Translation function
 */
type TranslateFunction<MT, FT> = (modelItem: MT|null, formItem: FT) => MT;


/**
 * Options to VanyListMerger
 */
interface VanyListMergerOptions<MT, FT, K> {
  /**
   * Model item's ID extraction function
   */
  getModelId: IdFunction<MT, K>;
  /**
   * Form item's ID extraction function
   */
  getFormId: IdFunction<FT, K>;
  /**
   * Value translation function
   */
  translate: TranslateFunction<MT, FT>;
}


/**
 * List merger function
 */
type VanyListMergerFunction<MT, FT> = (modelItems: MT[], formItems: FT[]) => MT[];


/**
 * List merging function
 * @param options
 * @returns
 */
export function useVanyListMerger<MT, FT, K = string>(options: VanyListMergerOptions<MT, FT, K>): VanyListMergerFunction<MT, FT> {

  return (modelItems: MT[], formItems: FT[]): MT[] => {
    // Map the model items
    const modelMap = new Map<K, MT>();
    for (const modelItem of modelItems) {
      const modelId = options.getModelId(modelItem);
      if (!modelId) continue;
      modelMap.set(modelId, modelItem);
    }

    // Process and translate the form items
    const ret = [] as MT[];
    for (const formItem of formItems) {
      const formId = options.getFormId(formItem);
      const modelItem = formId ? modelMap.get(formId) : undefined;
      ret.push(options.translate(modelItem ?? null, formItem));
    }

    // Complete
    return ret;
  };

}