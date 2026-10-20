import test from 'node:test'
import assert from 'node:assert/strict'
import isMediaLimitReached from '../src/modules/is-media-limit-reached.js'

test('five active media items prevent another upload', () => {
  const activeMedia = Array.from({ length: 5 }, (_, index) => ({ id: `media-${index}`, isReject: false }))

  assert.equal(isMediaLimitReached(activeMedia), true)
  assert.equal(isMediaLimitReached(activeMedia.slice(0, 4)), false)
  assert.equal(isMediaLimitReached([...activeMedia.slice(0, 4), { id: 'rejected', isReject: true }]), false)
})
