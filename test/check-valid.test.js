import test from 'node:test'
import assert from 'node:assert/strict'
import checkValid from '../src/modules/check-valid.js'
import { TEXTS } from '../src/assets/ui/ru.js'

const validContext = () => ({
  user: {
    location: '1|2',
    name: 'Анна',
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

  ctx.user.text = undefined
  assert.equal(checkValid(ctx), false)
})

test('publication and preview require a chosen name', () => {
  const ctx = validContext()
  ctx.user.name = ''
  assert.equal(checkValid(ctx), false)
  assert.match(TEXTS.profile(ctx), /Имя/)

  ctx.user.name = '   '
  assert.equal(checkValid(ctx), false)

  ctx.user.name = 'Анна'
  assert.equal(checkValid(ctx), true)
})

test('the profile menu does not call saved text empty when another section is missing', () => {
  const ctx = validContext()
  ctx.user.location = '0|0'
  const message = TEXTS.profile(ctx)

  assert.match(message, /Страна и город/)
  assert.doesNotMatch(message, /Текст анкеты/)
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
