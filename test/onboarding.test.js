import test from 'node:test'
import assert from 'node:assert/strict'
import age18confirmMenu from '../src/scenes/age18confirm-menu.js'
import rulesMenu from '../src/scenes/rules-menu.js'
import phoneMenu from '../src/scenes/phone-menu.js'
import onboardingStage from '../src/lib/onboarding-stage.js'
import routeOnboarding from '../src/modules/route-onboarding.js'
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

test('age and rules confirmation lead to the phone request, then a shared contact opens the main menu', async () => {
  const { ctx, replies } = makeContext(TEXTS.age18Confirm_btn_2)

  await age18confirmMenu(ctx)
  assert.equal(ctx.user.system_age18Confirm, true)
  assert.equal(ctx.user.scene, 'rules-menu')
  assert.equal(replies.at(-1).message, TEXTS.rules)
  assert.deepEqual(replies.at(-1).options.reply_markup, BUTTONS.rules_menu.reply_markup)

  ctx.update.message.text = TEXTS.rules_confirm_btn
  await rulesMenu(ctx)
  assert.equal(ctx.user.system_rulesConfirm, true)
  assert.equal(ctx.user.scene, 'phone-menu')
  assert.equal(replies.at(-1).message, TEXTS.phone_request)
  assert.deepEqual(replies.at(-1).options.reply_markup, BUTTONS.phone_menu.reply_markup)

  const saved = []
  ctx.update.message = { contact: { user_id: ctx.user.id, phone_number: '+44 7700 900123' } }
  await phoneMenu(ctx, { set: async (id, user) => saved.push({ id, phone: user.system_phoneNumber }) })
  assert.deepEqual(saved, [{ id: 1, phone: '+44 7700 900123' }])
  assert.equal(ctx.user.scene, 'main-menu')
  assert.equal(replies.at(-1).message, TEXTS.home)
  assert.equal(replies.at(-1).options.parse_mode, 'MarkdownV2')
  assert.deepEqual(replies.at(-1).options.reply_markup, BUTTONS.main_menu.reply_markup)
})

test('an existing user who already accepted rules must still share a phone number', async () => {
  const { ctx, replies } = makeContext(TEXTS.age18Confirm_btn_2, true)

  await age18confirmMenu(ctx)
  assert.equal(ctx.user.scene, 'phone-menu')
  assert.equal(replies.at(-1).message, TEXTS.phone_request)
})

test('return buttons explain that age and rules are required without bypassing onboarding', async () => {
  const returnButton = BUTTONS.rules_menu.reply_markup.keyboard.flat().find(button => button.text === TEXTS.back_to_main_menu_btn)
  assert.equal(returnButton.icon_custom_emoji_id, '5379787743326941514')

  const age = makeContext(TEXTS.back_to_main_menu_btn)
  await age18confirmMenu(age.ctx)
  assert.notEqual(age.ctx.user.scene, 'main-menu')
  assert.equal(age.replies.at(-1).message, TEXTS.onboarding_required)
  assert.deepEqual(age.replies.at(-1).options.reply_markup, BUTTONS.age18Confirm_menu.reply_markup)

  const rules = makeContext(TEXTS.back_to_main_menu_btn)
  await rulesMenu(rules.ctx)
  assert.notEqual(rules.ctx.user.scene, 'main-menu')
  assert.equal(rules.replies.at(-1).message, TEXTS.onboarding_required)
  assert.deepEqual(rules.replies.at(-1).options.reply_markup, BUTTONS.rules_menu.reply_markup)
})

test('the phone step rejects typed numbers and contacts from other users', async () => {
  const { ctx, replies } = makeContext('79991234567', true)
  const saved = []
  const store = { set: async () => saved.push(true) }
  assert.equal(BUTTONS.phone_menu.reply_markup.keyboard[0][0].request_contact, true)
  assert.equal(BUTTONS.phone_menu.reply_markup.keyboard[0][0].icon_custom_emoji_id, '5379762218336301013')

  await phoneMenu(ctx, store)
  assert.equal(ctx.user.system_phoneNumber, undefined)
  assert.equal(replies.at(-1).message, TEXTS.phone_request)

  ctx.update.message = { contact: { user_id: 2, phone_number: '+79991234567' } }
  await phoneMenu(ctx, store)
  assert.equal(ctx.user.system_phoneNumber, undefined)
  assert.equal(replies.at(-1).message, TEXTS.phone_other_contact)
  assert.deepEqual(saved, [])
})

test('the phone return button explains that the step is required', async () => {
  const { ctx, replies } = makeContext(TEXTS.phone_back_btn, true)

  await phoneMenu(ctx)

  assert.equal(ctx.user.system_rulesConfirm, true)
  assert.notEqual(ctx.user.scene, 'main-menu')
  assert.equal(replies.at(-1).message, TEXTS.onboarding_required)
  assert.deepEqual(replies.at(-1).options.reply_markup, BUTTONS.phone_menu.reply_markup)
  const returnButton = BUTTONS.phone_menu.reply_markup.keyboard.flat().find(button => button.text === TEXTS.phone_back_btn)
  assert.equal(returnButton.icon_custom_emoji_id, '5379787743326941514')
})

test('onboarding stage blocks access until age, rules and phone are present', () => {
  const user = { system_age18Confirm: false, system_rulesConfirm: false, system_phoneNumber: '' }
  assert.equal(onboardingStage(user), 'age18confirm-menu')
  user.system_age18Confirm = true
  assert.equal(onboardingStage(user), 'rules-menu')
  user.system_rulesConfirm = true
  assert.equal(onboardingStage(user), 'phone-menu')
  user.system_phoneNumber = '+79991234567'
  assert.equal(onboardingStage(user), null)
})

test('a chat deep link cannot bypass the phone step', async () => {
  const { ctx, replies } = makeContext('/start chat', true)
  ctx.user.system_age18Confirm = true
  ctx.user.scene = 'main-menu'
  ctx.replyWithSticker = async () => {}
  const registered = []

  const routed = await routeOnboarding(ctx, {
    registerReferral: async code => registered.push(code),
    users: {},
    referals: {}
  })

  assert.equal(routed, true)
  assert.deepEqual(registered, ['chat'])
  assert.equal(ctx.user.scene, 'phone-menu')
  assert.equal(replies.at(-1).message, TEXTS.phone_request)
})

test('an old inline button cannot bypass the phone step', async () => {
  const { ctx, replies } = makeContext('', true)
  ctx.user.system_age18Confirm = true
  ctx.user.scene = 'main-menu'
  ctx.update = { callback_query: { data: 'tip_refresh' } }
  let answered = false
  ctx.answerCbQuery = async () => { answered = true }

  const routed = await routeOnboarding(ctx, { registerReferral: async () => {}, users: {}, referals: {} })

  assert.equal(routed, true)
  assert.equal(answered, true)
  assert.equal(ctx.user.scene, 'phone-menu')
  assert.equal(replies.at(-1).message, TEXTS.phone_request)
})
