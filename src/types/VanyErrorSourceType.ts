interface GenericVanyComponentSource {
  /**
   * Class of object
   */
  vanyClass?: string;
  /**
   * Related element
   */
  el?: any;
}


export type VanyErrorSourceType = Partial<GenericVanyComponentSource>;