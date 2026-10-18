import test from 'node:test'
import assert from 'node:assert/strict'
import textScreening from '../src/lib/text-screening.js'
import createImportId from '../src/lib/create-import-id.js'

test('textScreening escapes Telegram MarkdownV2 characters without changing text', () => {
  assert.equal(
    textScreening('Привет_[ты](друг)!'),
    String.raw`Привет\_\[ты\]\(друг\)\!`
  )
  assert.equal(textScreening('Любовь ❤️\nВстречи'), 'Любовь ❤️\nВстречи')
})

test('createImportId returns distinct URL-safe 24-character IDs', () => {
  const ids = Array.from({ length: 100 }, () => createImportId())

  assert.equal(new Set(ids).size, ids.length)
  for (const id of ids) {
    assert.match(id, /^[A-Za-z0-9]{24}$/)
  }
})
