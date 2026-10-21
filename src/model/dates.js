/**
 * Miliseconds per day (24 hours * 60 minutes * 60 seconds * 1000 miliseconds)
 */
const MS_PER_DAY = 24 * 60 * 60 * 1000

/**
 * Returns the date with added days.
 *
 * @param {Date} date - The start date.
 * @param {number} days - Days to add.
 * @returns {Date} The new date.
 */
export function addDays(date, days) {
  const result = new Date(date)
  result.setUTCDate(result.getUTCDate() + days)

  return result
}

/**
 * Returns the date with added years.
 *
 * @param {Date} date - The start date.
 * @param {number} years - Years to add.
 * @returns {Date} The new date.
 */
export function addYears(date, years) {
  const year = date.getUTCFullYear() + years
  const month = date.getUTCMonth()
  const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()

  return new Date(Date.UTC(year, month, Math.min(date.getUTCDate(), lastDayOfMonth)))
}

/**
 * Returns the number of days between two dates.
 *
 * @param {Date} from - The earlier date.
 * @param {Date} to - The later date.
 * @returns {number} The number of days.
 */
export function daysBetween(from, to) {
  return Math.round((to.getTime() - from.getTime()) / MS_PER_DAY)
}
