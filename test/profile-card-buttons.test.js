import test from 'node:test'
import assert from 'node:assert/strict'
import { BUTTONS } from '../src/assets/ui/ru.js'

test('profile action buttons use ordinary emoji in one row in previews and channel posts', () => {
  const previewRows = BUTTONS.profile_generate_inline({ isPreview: true, id: 'test' }).reply_markup.inline_keyboard
  const channelRows = BUTTONS.profile_generate_inline({ id: 'test' }).reply_markup.inline_keyboard

  assert.deepEqual(previewRows.map(row => row.map(button => button.text)), [['✍️', '👋', '⚠️']])
  assert.deepEqual(channelRows.map(row => row.map(button => button.text)), [['✍️', '👋', '⚠️']])
  assert.equal(previewRows[0][2].callback_data, 'r_test')
  assert.match(channelRows[0][2].url, /\?start=r_test$/)
})
