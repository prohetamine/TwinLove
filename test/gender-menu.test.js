import test from 'node:test'
import assert from 'node:assert/strict'
import { User } from '../src/helpers/models.js'
import genderMenu from '../src/scenes/edit-menu/gender-menu.js'
import editMenu from '../src/scenes/edit-menu.js'
import { BUTTONS, TEXTS } from '../src/assets/ui/ru.js'

test('gender is optional and accepts only supported values in the user model', () => {
  const user = new User({ id: 1 })
  assert.equal(user.gender, '')

  user.gender = 'male'
  assert.equal(user.validateSync(), undefined)
  user.gender = 'female'
  assert.equal(user.validateSync(), undefined)
  user.gender = 'invalid'
  assert.ok(user.validateSync()?.errors.gender)
})

test('gender menu saves and clears the choice without leaving the edit flow', async () => {
  const saved = []
  const replies = []
  const ctx = {
    user: { id: 42, gender: '' },
    update: { message: { text: TEXTS.edit_profile_gender_female_btn } },
    reply: async (message, options) => replies.push({ message, options })
  }
  const store = { set: async (id, patch) => saved.push({ id, patch }) }

  await genderMenu(ctx, store)
  assert.equal(ctx.user.gender, 'female')
  assert.deepEqual(saved.at(-1), { id: 42, patch: { gender: 'female' } })
  assert.equal(replies.at(-1).options.reply_markup.keyboard[1][0].icon_custom_emoji_id, '5379730349678965304')

  ctx.update.message.text = TEXTS.edit_profile_gender_unspecified_btn
  await genderMenu(ctx, store)
  assert.equal(ctx.user.gender, '')
  assert.deepEqual(saved.at(-1), { id: 42, patch: { gender: '' } })
})

test('the edit menu opens gender choices', async () => {
  const replies = []
  const ctx = {
    user: { gender: 'male' },
    update: { message: { text: TEXTS.edit_profile_gender_btn } },
    reply: async (message, options) => replies.push({ message, options }),
    enterScene: async scene => { ctx.user.scene = scene }
  }

  await editMenu(ctx)
  assert.equal(ctx.user.scene, 'edit-gender-menu')
  assert.equal(replies.at(-1).message, TEXTS.edit_profile_gender)
  assert.equal(replies.at(-1).options.reply_markup.keyboard[0][0].icon_custom_emoji_id, '5379730349678965304')
})

test('gender is not included in generated profile text', () => {
  const user = { text: 'Привет! Буду рад знакомству.', location: '5|1', privacyCity: 0 }
  const visiblePart = gender => TEXTS.profile_generate({ ...user, gender }).split('\n||Теги:')[0]
  assert.equal(visiblePart('male'), visiblePart('female'))
  assert.equal(visiblePart('male'), visiblePart(''))
  const genderButton = BUTTONS.edit_menu.reply_markup.keyboard.flat().find(button => button.text === TEXTS.edit_profile_gender_btn)
  assert.equal(genderButton.icon_custom_emoji_id, '5379672612433601461')
})
