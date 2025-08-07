// Declare type
export type PrimitiveType = null|string|boolean|number|PrimitiveObject|PrimitiveArray;
interface PrimitiveObject extends Record<string, PrimitiveType> { }
interface PrimitiveArray extends Array<PrimitiveType> { }


/**
 * Check for equality between LHS and RHS (recursive)
 * @param lhs Item on left hand side
 * @param rhs Item on right hand side
 * @returns If both items equal
 */
function isEqual(lhs: PrimitiveType, rhs: PrimitiveType): boolean {
  // Strict equal check
  if (lhs === rhs) {
    return true;
  }

  // If either is null or not an object, they aren't equal (already failed strict equality).
  // typeof null is 'object', so we need to handle it separately.
  if (lhs === null || typeof lhs !== 'object' || rhs === null || typeof rhs !== 'object') {
    return false;
  }

  // Perform array comparison
  if (Array.isArray(lhs) && Array.isArray(rhs)) {
    // Length check
    if (lhs.length !== rhs.length) {
      return false;
    }

    // Item check
    for (let i = 0; i < lhs.length; ++i) {
      if (!isEqual(lhs[i], rhs[i])) {
        return false;
      }
    }

    // Success
    return true;
  }

  // When one side is array, the other will not be, then they are not equal
  if (Array.isArray(lhs) || Array.isArray(rhs)) {
    return false;
  }

  // Object comparison
  const lhsKeys = Object.keys(lhs);
  const rhsKeys = Object.keys(rhs);

  if (lhsKeys.length !== rhsKeys.length) {
    return false;
  }

  for (const key of lhsKeys) {
    if (!rhsKeys.includes(key)) {
      return false;
    }
    if (!isEqual(lhs[key], rhs[key])) {
      return false;
    }
  }

  // Success
  return true;
}


/**
 * Check for equality between LHS and RHS
 * @param lhs Item on left hand side
 * @param rhs Item on right hand side
 * @returns If both items equal
 */
export function useVanySnapshotEqual(lhs: PrimitiveType|undefined, rhs: PrimitiveType|undefined): boolean {
  // Handle 'undefined'
  if (lhs === undefined && rhs === undefined) return true;
  if (lhs === undefined || rhs === undefined) return false;

  return isEqual(lhs, rhs);
}