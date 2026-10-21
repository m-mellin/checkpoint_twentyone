import { describe, it, expect } from 'vitest'
import { Nation } from './Nation.js'

function validData(changes = {}) {
  return {
    name: 'Sweden',
    countryCode: 'SWE',
    issuingCities: ['Stockholm', 'Uppsala'],
    maleFirstNames: ['Erik', 'Lars'],
    femaleFirstNames: ['Anna', 'Maria'],
    surnames: ['Andersson', 'Johansson'],
    ...changes
  }
}

describe('Nation', () => {
  describe('constructor with valid data', () => {
    it('returns every value through its getter', () => {
      const nation = new Nation(validData())

      expect(nation.name).toBe('Sweden')
      expect(nation.countryCode).toBe('SWE')
      expect(nation.issuingCities).toEqual(['Stockholm', 'Uppsala'])
      expect(nation.maleFirstNames).toEqual(['Erik', 'Lars'])
      expect(nation.femaleFirstNames).toEqual(['Anna', 'Maria'])
      expect(nation.surnames).toEqual(['Andersson', 'Johansson'])
    })
  })

  describe('lists', () => {
    it('keeps its own copy, changing the list does not change nation', () => {
      const surnames = ['Andersson']
      const nation = new Nation(validData({ surnames }))

      surnames.push('Johansson')

      expect(nation.surnames).toEqual(['Andersson'])
    })

    it('cannot be changed through getters', () => {
      const nation = new Nation(validData())

      expect(() => nation.surnames.push('Karlsson').toThrow(TypeError))
      expect(nation.surnames).toEqual(['Andersson', 'Johansson'])
    })
  })

  describe('validation', () => {
    it('throws a TypeError if name is not a non-empty string', () => {
      for (const invalid of ['', '   ', 42, undefined]) {
        expect(() => new Nation(validData({ name: invalid }))).toThrow(TypeError)
      }
    })

    it('throws a RangeError if countryCode is not three capital letters', () => {
      for (const invalid of ['', '   ', 4, 'SW', 'swe', 'SWED', undefined]) {
        expect(() => new Nation(validData({ countryCode: invalid }))).toThrow(RangeError)
      }
    })
  })
})
