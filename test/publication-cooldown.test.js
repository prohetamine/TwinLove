import test from 'node:test'
import assert from 'node:assert/strict'
import getPublicationCooldownRemaining, { PUBLICATION_COOLDOWN_MS } from '../src/modules/get-publication-cooldown-remaining.js'

test('dev publishing has no time limit, including immediately after a post', () => {
  const now = 1_000_000

  assert.equal(getPublicationCooldownRemaining(now, now, true), 0)
  assert.equal(getPublicationCooldownRemaining(now + 1_000, now, true), 0)
})

test('production keeps the 48-hour publishing limit', () => {
  const now = 1_000_000

  assert.equal(getPublicationCooldownRemaining(now, now, false), PUBLICATION_COOLDOWN_MS)
  assert.equal(getPublicationCooldownRemaining(now - PUBLICATION_COOLDOWN_MS, now, false), 0)
})
