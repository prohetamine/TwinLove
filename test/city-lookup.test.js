import test from 'node:test'
import assert from 'node:assert/strict'
import getCityById from '../src/lib/get-city-by-id.js'
import getCityByTitle from '../src/lib/get-city-by-title.js'

test('city lookup resolves a known ID and a trimmed, case-insensitive name', () => {
  const byId = getCityById('5|1')
  const byTitle = getCityByTitle('  МОСКВА  ')

  assert.equal(byId?.pureTitle, 'Москва')
  assert.equal(byTitle?.id, byId?.id)
})

test('city lookup returns undefined for unknown values', () => {
  assert.equal(getCityById('99999|99999'), undefined)
  assert.equal(getCityByTitle('Несуществующий город'), undefined)
})
