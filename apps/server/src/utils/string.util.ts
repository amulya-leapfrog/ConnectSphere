/**
 * Converts a given snake_case string to camelCase.
 *
 * @param {string} str - The snake_case string to be converted.
 * @returns {string} - The converted camelCase string.
 *
 * @example
 * // Returns 'thisIsCamelCase'
 * snakeToCamelCase('this_is_camel_case');
 */
export function snakeToCamelCase(str: string): string {
  if (typeof str !== 'string') {
    return str;
  }

  return str.replace(/([-_]\w)/g, (g) => g[1].toUpperCase());
}

/**
 * Converts a given camelCase string to snake_case.
 *
 * @param {string} str - The camelCase string to be converted.
 * @returns {string} - The converted snake_case string.
 *
 * @example
 * // Returns 'this_is_snake_case'
 * camelToSnakeCase('thisIsSnakeCase');
 */
export function camelToSnakeCase(str: string): string {
  if (typeof str !== 'string') {
    return str;
  }

  return str.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}
