export default class VanyStyleList {
  /**
   * All current values
   */
  private _values: string[] = [];


  /**
   * @constructor
   * @param src Source
   */
  constructor(src: string) {
    const values = src.split(';');
    for (const value of values) {
      if (value.trim() === '') continue;
      this._values.push(value.trim());
    }
  }


  /**
   * Add a style specification to the list
   * @param spec Style specification
   */
  add(spec: string): void {
    while (spec.endsWith(';')) {
      spec = spec.substring(0, spec.length - 1).trim();
    }
    if (spec.trim() === '') return;
    this._values.push(spec);
  }


  /**
   * Flatten
   * @returns
   */
  toString(): string {
    let ret = '';
    for (const value of this._values) {
      ret += value + ';';
    }
    return ret;
  }
}