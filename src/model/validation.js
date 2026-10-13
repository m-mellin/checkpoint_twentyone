export function assertNonEmptyString (value, name) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${name} must be a non-empty string`)
  } 
}

export function assertValidDate (value, name) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new TypeError(`${name} must be a valid Date`)
  }
}

export function assertNumberIsFinite (value, name) {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number`)
  }
}

export function assertInstanceOf (value, type, name) {
  if (!(value instanceof type)) {
    throw new TypeError(`${name} must be of ${type.name}`)
  }
}