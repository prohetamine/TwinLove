import test from 'node:test'
import assert from 'node:assert/strict'
import { User } from '../src/helpers/models.js'
import editMenu from '../src/scenes/edit-menu.js'
import { nameMenu, nameInputMenu, normalizeProfileName } from '../src/scenes/edit-menu/name-menu.js'
import { BUTTONS, TEXTS } from '../src/assets/ui/ru.js'

const makeContext = text => {
  const replies = []
  const deleted = []
  const ctx = {
    user: { id: 42, name: '', scene: 'edit-menu' },
    update: { message: { text, from: { first_name: 'Имя из Telegram' } } },
    reply: async (message, options) => {
      replies.push({ message, options })
      return { message_id: replies.length }
    },
    deleteMessage: async id => { deleted.push(id) },
    enterScene: async scene => { ctx.user.scene = scene }
  }
  return { ctx, replies, deleted }
}

test('name can be taken from Telegram or typed manually', async () => {
  const { ctx, replies, deleted } = makeContext(TEXTS.edit_profile_name_btn)
  const saved = []
  const store = { set: async (id, patch) => saved.push({ id, patch }) }

  assert.equal(new User({ id: 42 }).name, '')
  await editMenu(ctx)
  assert.equal(ctx.user.scene, 'edit-name-menu')
  assert.match(replies.at(-1).message, /Имя из Telegram/)
  assert.doesNotMatch(replies.at(-1).message, /(?<!\\)\./u)

  ctx.update.message.text = TEXTS.edit_profile_name_telegram_btn
  await nameMenu(ctx, store)
  assert.deepEqual(saved.at(-1), { id: 42, patch: { name: 'Имя из Telegram' } })
  assert.equal(ctx.user.scene, 'edit-menu')
  assert.equal(replies.at(-1).message, TEXTS.edit)
  assert.equal(replies.at(-1).options, BUTTONS.edit_menu)
  assert.equal(deleted.length, 1)
  assert.equal(replies.at(-2).options.reply_markup.remove_keyboard, true)

  ctx.update.message.text = TEXTS.edit_profile_name_btn
  await editMenu(ctx)
  ctx.update.message.text = TEXTS.edit_profile_name_manual_btn
  await nameMenu(ctx, store)
  assert.equal(ctx.user.scene, 'edit-name-input-menu')

  ctx.update.message.text = '  Анна   Мария  '
  await nameInputMenu(ctx, store)
  assert.deepEqual(saved.at(-1), { id: 42, patch: { name: 'Анна Мария' } })
  assert.equal(ctx.user.scene, 'edit-menu')
  assert.equal(replies.at(-1).message, TEXTS.edit)
  assert.equal(replies.at(-1).options, BUTTONS.edit_menu)
  assert.equal(deleted.length, 2)

  ctx.update.message.text = TEXTS.edit_profile_name_btn
  await editMenu(ctx)
  ctx.update.message.text = TEXTS.edit_profile_name_clear_btn
  await nameMenu(ctx, store)
  assert.deepEqual(saved.at(-1), { id: 42, patch: { name: 'Анна Мария' } })
  assert.equal(replies.at(-1).message, TEXTS.edit_profile_name_required)
  assert.ok(BUTTONS.edit_profile_name_menu.reply_markup.keyboard.flat().every(button => button.text !== TEXTS.edit_profile_name_clear_btn))
  assert.equal(BUTTONS.edit_profile_name_menu.reply_markup.keyboard[0][0].text, 'Взять из Telegram')
  assert.equal(BUTTONS.edit_profile_name_menu.reply_markup.keyboard[0][0].icon_custom_emoji_id, '5379805155124363413')
  assert.equal(BUTTONS.edit_profile_name_menu.reply_markup.keyboard[1][0].icon_custom_emoji_id, '5380098716139038805')
})

test('name validation rejects empty, multiline, and long values', () => {
  assert.equal(normalizeProfileName('   '), '')
  assert.equal(normalizeProfileName('Анна\nМария'), '')
  assert.equal(normalizeProfileName('а'.repeat(41)), '')
  assert.equal(normalizeProfileName('а'.repeat(40)), 'а'.repeat(40))
})

test('selected name appears in the profile card', () => {
  const user = {
    name: 'Анна <3',
    text: 'Привет! Буду рада знакомству.',
    location: '999|666',
    privacyCity: 0,
    privacyMedia: [0, 0, 0]
  }
  assert.match(TEXTS.profile_generate(user), /^\*Анна <3\*\n/)
  assert.equal(BUTTONS.edit_menu.reply_markup.keyboard[1][0].text, TEXTS.edit_profile_name_btn)
  assert.deepEqual(BUTTONS.edit_menu.reply_markup.keyboard.slice(0, 5).map(row => row[0].text), [
    TEXTS.edit_profile_media_btn,
    TEXTS.edit_profile_name_btn,
    TEXTS.edit_profile_text_btn,
    TEXTS.edit_profile_gender_btn,
    TEXTS.edit_profile_location_btn
  ])
})
