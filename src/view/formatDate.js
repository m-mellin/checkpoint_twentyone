/**
 * Formats a date the way it is printed in the game, for example "1971.03.12".
 *
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date.
 */
export function formatDate(date) {
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const year = String(date.getUTCFullYear())

  return `${year}.${month}.${day}`
}