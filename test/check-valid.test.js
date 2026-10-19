import test from 'node:test'
import assert from 'node:assert/strict'
import checkValid from '../src/modules/check-valid.js'

const validContext = () => ({
  user: {
    location: '1|2',
    text: 'а'.repeat(20),
    system_block_status: false,
    system_age18Confirm: true,
    system_rulesConfirm: true,
    system_phoneNumber: '+79991234567'
  },
  update: { message: { from: { username: 'twinlove_user' } } }
})

test('a complete, eligible profile can be published at both text limits', () => {
  const ctx = validContext()
  assert.equal(checkValid(ctx), true)

  ctx.user.text = 'а'.repeat(800)
  assert.equal(checkValid(ctx), true)
})

test('text outside the allowed length cannot be published', () => {
  const ctx = validContext()
  ctx.user.text = 'а'.repeat(19)
  assert.equal(checkValid(ctx), false)

  ctx.user.text = 'а'.repeat(801)
  assert.equal(checkValid(ctx), false)
})

test('publication requires a location, age, rules, phone number, and username', () => {
  const cases = [
    ctx => { ctx.user.location = '0|0' },
    ctx => { ctx.user.system_age18Confirm = false },
    ctx => { ctx.user.system_rulesConfirm = false },
    ctx => { ctx.user.system_phoneNumber = '' },
    ctx => { ctx.update.message.from.username = '' },
    ctx => { ctx.user.system_block_status = true }
  ]

  for (const change of cases) {
    const ctx = validContext()
    change(ctx)
    assert.equal(checkValid(ctx), false)
  }
})
