import { describe, it, expect } from 'vitest'
import { Person, Sex } from './Person.js'
import { Nation } from './Nation.js'

const SWEDEN = new Nation({ name: 'Sweden', countryCode: 'SWE' })

function validData(changes = {}) {
  return {
    firstName: 'Erik',
    surname: 'Andersson',
    heightInCm: 185,
    nationality: SWEDEN,
    dateOfBirth: new Date(Date.UTC(1993, 2, 25)),
    birthplace: 'Uppsala',
    sex: Sex.MALE,
    appearance: 'M0',
    ...changes
  }
}

describe('Person', () => {
  describe('constructor with valid data', () => {
    it('returns every value through its getter', () => {
      const data = validData()
      const person = new Person(data)

      expect(person.firstName).toBe('Erik')
      expect(person.surname).toBe('Andersson')
      expect(person.heightInCm).toBe(185)
      expect(person.nationality).toBe(SWEDEN)
      expect(person.dateOfBirth).toEqual(data.dateOfBirth)
      expect(person.birthplace).toBe('Uppsala')
      expect(person.sex).toBe('M')
      expect(person.appearance).toBe('M0')
    })
  })

  describe('validation', () => {
    it.each(['firstName', 'surname', 'birthplace', 'appearance'])(
      'throws a TypeError if %s is not a non-empty string',
      (field) => {
        for (const invalidData of ['', '   ', 55, undefined]) {
          expect(() => new Person(validData({ [field]: invalidData }))).toThrow(TypeError)
        }
      }
    )

    it.each(['1990-05-17', new Date('not a date'), undefined])(
      'throws a TypeError if dateOfBirth is %s',
      (dateOfBirth) => {
        expect(() => new Person(validData({ dateOfBirth }))).toThrow(TypeError)
      }
    )

    it.each([NaN, Infinity, '180'])(
      'throws a TypeError if heightInCm is %s',
      (heightInCm) => {
        expect(() => new Person(validData({ heightInCm }))).toThrow(TypeError)
      }
    )

    it('throws a TypeError if nationality is not a Nation', () => {
      const fakeNation = { name: 'Sweden', countryCode: 'SWE' }

      expect(() => new Person(validData({ nationality: fakeNation }))).toThrow(TypeError)
    })

    it('throws a RangeError if sex is not Sex.MALE or Sex.FEMALE', () => {
      expect(() => new Person(validData({ sex: 'X' }))).toThrow(RangeError)
    })
  })
})
