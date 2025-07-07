/**
 * Name function
 */
type NameFunction = (suffix: string) => string|null|undefined;


/**
 * Create a function
 * @param prefix
 * @returns
 */
export function useVanyPrefixedName(prefix: string|null|undefined): NameFunction {
  return (suffix: string) => {
    // When prefix null/undefined, there is no result
    if (prefix === null) return null;
    if (prefix === undefined) return undefined;

    // Empty prefix, use suffix directly
    if (prefix.trim() === '') return suffix;

    // Concat prefix and suffix using dot
    return `${prefix}.${suffix}`;
  };
}