export default class VanyClassList {
  /**
   * All current values
   */
  private _values = new Map<string, string>();


  /**
   * @constructor
   * @param src Source
   */
  constructor(src: string) {
    const values = src.split(' ');
    for (const value of values) {
      if (value === '') continue;
      this._values.set(value, value);
    }
  }


  /**
   * Add a class to the list
   * @param className Target class name
   */
  add(className: string): void {
    if (className === '') return;
    this._values.set(className, className);
  }


  /**
   * Delete a class from the list
   * @param className Target class name
   */
  remove(className: string): boolean {
    return this._values.delete(className);
  }


  /**
   * Flatten
   * @returns
   */
  toString(): string {
    let ret = '';
    for (const key of this._values.keys()) {
      ret += ' ' + key;
    }
    return ret.substring(1);
  }
}