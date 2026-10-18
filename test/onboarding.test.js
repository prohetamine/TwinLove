import test from 'node:test'
import assert from 'node:assert/strict'
import age18confirmMenu from '../src/scenes/age18confirm-menu.js'
import rulesMenu from '../src/scenes/rules-menu.js'
import { TEXTS, BUTTONS } from '../src/assets/ui/ru.js'

const makeContext = (text, rulesConfirmed = false) => {
  const replies = []
  const ctx = {
    update: { message: { text } },
    user: { id: 1, system_age18Confirm: false, system_rulesConfirm: rulesConfirmed },
    enterScene: async scene => { ctx.user.scene = scene },
    reply: async (message, options) => { replies.push({ message, options }) }
  }

  return { ctx, replies }
}

test('age confirmation shows rules, then rule confirmation opens the main menu', async () => {
  const { ctx, replies } = makeContext(TEXTS.age18Confirm_btn_2)

  await age18confirmMenu(ctx)
  assert.equal(ctx.user.system_age18Confirm, true)
  assert.equal(ctx.user.scene, 'rules-menu')
  assert.equal(replies.at(-1).message, TEXTS.rules)
  assert.deepEqual(replies.at(-1).options.reply_markup, BUTTONS.rules_menu.reply_markup)

  ctx.update.message.text = TEXTS.rules_confirm_btn
  await rulesMenu(ctx)
  assert.equal(ctx.user.system_rulesConfirm, true)
  assert.equal(ctx.user.scene, 'main-menu')
  assert.equal(replies.at(-1).message, TEXTS.home)
  assert.deepEqual(replies.at(-1).options.reply_markup, BUTTONS.main_menu.reply_markup)
})

test('an existing user who already accepted rules gets the main menu after age confirmation', async () => {
  const { ctx, replies } = makeContext(TEXTS.age18Confirm_btn_2, true)

  await age18confirmMenu(ctx)
  assert.equal(ctx.user.scene, 'main-menu')
  assert.equal(replies.at(-1).message, TEXTS.home)
  assert.deepEqual(replies.at(-1).options.reply_markup, BUTTONS.main_menu.reply_markup)
})
