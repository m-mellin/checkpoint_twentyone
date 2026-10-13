/**
 * Throws if the value is not a string with at least one non-space character.
 *
 * @param {unknown} value - The value to check.
 * @param {string} name - The name of the value, used in the error message.
 * @throws {TypeError} If the value is not a non-empty string.
 */
export function assertNonEmptyString (value, name) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${name} must be a non-empty string`)
  } 
}

/**
 * Throws if the value is not a Date, or is a Date that does not represent a real point in time.
 *
 * @param {unknown} value - The value to check.
 * @param {string} name - The name of the value, used in the error message.
 * @throws {TypeError} If the value is not a valid Date.
 */
export function assertValidDate (value, name) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new TypeError(`${name} must be a valid Date`)
  }
}

/**
 * Throws if the value is not a finite number. NaN and Infinity are not accepted.
 *
 * @param {unknown} value - The value to check.
 * @param {string} name - The name of the value, used in the error message.
 * @throws {TypeError} If the value is not a finite number.
 */
export function assertNumberIsFinite (value, name) {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number`)
  }
}

/**
 * Throws if the value is not an instance of the given class.
 *
 * @param {unknown} value - The value to check.
 * @param {new (...args: any[]) => unknown} type - The class the value must be an instance of.
 * @param {string} name - The name of the value, used in the error message.
 * @throws {TypeError} If the value is not an instance of the class.
 */
export function assertInstanceOf (value, type, name) {
  if (!(value instanceof type)) {
    throw new TypeError(`${name} must be an instance of ${type.name}`)
  }
}
