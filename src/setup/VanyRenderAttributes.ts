import VanyClassList from '../internals/VanyClassList';
import VanyStyleList from '../internals/VanyStyleList';
import { VueClassAttribute } from '../internals/compat-vue';


/**
 * Import and filter values
 * @param values 
 * @param dropClass
 * @returns
 */
function _importAttrs(values: Record<string, any>, dropClass: boolean) {
  const ret = {} as Record<string, any>;
  for (const key in values) {
    if (dropClass && key == 'class') continue;
    ret[key] = values[key];
  }

  return ret;
}


/**
 * Expand class specification
 * @param spec 
 * @returns
 */
function _expandClassSpec(spec: VueClassAttribute): string[] {
  const ret = [];
  if (Array.isArray(spec)) {
    for (const subSpec of spec) {
      for (const expandedSpec of _expandClassSpec(subSpec)) {
        ret.push(expandedSpec);
      }
    }
  } else if (typeof spec === 'string') {
    for (const subSpec of spec.split(' ')) {
      ret.push(subSpec.trim());
    }
  } else if (typeof spec === 'object') {
    for (const key in spec) {
      if (!spec[key]) continue;
      for (const subKey of key.split(' ')) {
        ret.push(subKey.trim());
      }
    }
  }

  return ret;
}


/**
 * Attributes for vany rendering
 */
export default class VanyRenderAttributes {
  /**
   * Actual values
   */
  values: Record<string, any>;

  
  /**
   * @constructor
   * @param values Initial values
   * @param dropClass If 'class'es are dropped
   */
  constructor(values?: Record<string, any>, dropClass?: boolean) {
    this.values = _importAttrs(values ?? {}, dropClass ?? true);
  }


  /**
   * Delete attributes of given keys
   * @param keys Keys to be deleted
   */
  dropAttrs(keys: string[]): void {
    for (const key of keys) {
      delete this.values[key];
    }
  }


  /**
   * Add values to the class attribute
   * @param classNames Class values to be merged in
   */
  mergeAttrsClass(classNames: string[]): void {
    const classList = new VanyClassList(this.values['class'] ?? '');
    for (const className of classNames) {
      classList.add(className);
    }

    const finalValue = classList.toString();
    if (finalValue.length > 0) {
      this.values['class'] = finalValue;
    } else {
      delete this.values['class'];
    }
  }


  /**
   * Add values to the class attribute
   * @param classSpec Class specification for class values to be merged in
   */
  mergeAttrsClassSpec(classSpec: VueClassAttribute): void {
    this.mergeAttrsClass(_expandClassSpec(classSpec));
  }


  /**
   * Add style specification to the style attribute
   * @param spec Style specifications to be merged in
   */
  mergeAttrsStyle(specs: string[]): void {
    const styleList = new VanyStyleList(this.values['style'] ?? '');
    for (const spec of specs) {
      styleList.add(spec);
    }

    const finalValue = styleList.toString();
    if (finalValue.length > 0) {
      this.values['style'] = finalValue;
    } else {
      delete this.values['style'];
    }
  }
}