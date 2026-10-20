import test from 'node:test'
import assert from 'node:assert/strict'
import { User } from '../src/helpers/models.js'
import genderMenu from '../src/scenes/edit-menu/gender-menu.js'
import editMenu from '../src/scenes/edit-menu.js'
import { BUTTONS, TEXTS } from '../src/assets/ui/ru.js'
import buildRichProfileCard from '../src/modules/build-rich-profile-card.js'

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

test('gender menu saves the choice and returns to the edit menu', async () => {
  const saved = []
  const replies = []
  const ctx = {
    user: { id: 42, gender: '' },
    update: { message: { text: TEXTS.edit_profile_gender_female_btn } },
    reply: async (message, options) => replies.push({ message, options }),
    enterScene: async scene => { ctx.user.scene = scene }
  }
  const store = { set: async (id, patch) => saved.push({ id, patch }) }

  await genderMenu(ctx, store)
  assert.equal(ctx.user.gender, 'female')
  assert.deepEqual(saved.at(-1), { id: 42, patch: { gender: 'female' } })
  assert.equal(ctx.user.scene, 'edit-menu')
  assert.equal(replies.at(-1).message, TEXTS.edit)
  assert.equal(replies.at(-1).options, BUTTONS.edit_menu)

  ctx.update.message.text = TEXTS.edit_profile_gender_male_btn
  await genderMenu(ctx, store)
  assert.equal(ctx.user.gender, 'male')
  assert.equal(ctx.user.scene, 'edit-menu')
  assert.equal(replies.at(-1).options, BUTTONS.edit_menu)

  ctx.update.message.text = TEXTS.edit_profile_gender_unspecified_btn
  await genderMenu(ctx, store)
  assert.equal(ctx.user.gender, '')
  assert.deepEqual(saved.at(-1), { id: 42, patch: { gender: '' } })
  assert.equal(ctx.user.scene, 'edit-menu')
  assert.equal(replies.at(-1).options, BUTTONS.edit_menu)
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

test('profile cards show the chosen gender symbol before the name', () => {
  const user = { name: 'Саша', text: 'Привет! Буду рад знакомству.', location: '999|666', privacyCity: 0 }
  for (const [gender, prefix] of [['male', '♂ '], ['female', '♀ '], ['', '']]) {
    const profile = { ...user, gender }
    assert.match(TEXTS.profile_generate(profile), new RegExp(`^\\*${prefix}Саша\\*\\n`))
    assert.match(buildRichProfileCard(profile, []).html, new RegExp(`^<h1>${prefix}Саша<\\/h1>`))
  }
  assert.doesNotMatch(buildRichProfileCard({ ...user, name: '', gender: 'female' }, []).html, /<h1>/)
  const genderButton = BUTTONS.edit_menu.reply_markup.keyboard.flat().find(button => button.text === TEXTS.edit_profile_gender_btn)
  assert.equal(genderButton.icon_custom_emoji_id, '5379672612433601461')
})
