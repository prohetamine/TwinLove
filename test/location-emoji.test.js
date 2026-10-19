import test from 'node:test'
import assert from 'node:assert/strict'
import { TEXTS, BUTTONS } from '../src/assets/ui/ru.js'

test('location buttons keep their actions with the custom icon', () => {
  const editButton = BUTTONS.edit_menu.reply_markup.keyboard.flat().find(button => button.text === TEXTS.edit_profile_location_btn)
  const locationButton = BUTTONS.edit_profile_location_menu.reply_markup.keyboard[0][0]
  const cityButton = BUTTONS.edit_profile_location_city_menu(['г. Москва']).reply_markup.keyboard[0][0]

  assert.equal(editButton.icon_custom_emoji_id, '5379990525912853171')
  assert.equal(locationButton.icon_custom_emoji_id, '5379990525912853171')
  assert.equal(locationButton.request_location, true)
  assert.equal(cityButton.text, 'г. Москва')
  assert.equal(cityButton.icon_custom_emoji_id, '5379990525912853171')
})

test('own profile previews omit the pin while other private and channel cards keep it', () => {
  const user = { text: 'Привет!', location: '999|666' }

  assert.doesNotMatch(TEXTS.profile_generate(user, true, true), /📍|tg:\/\/emoji\?id=5379990525912853171/)
  assert.match(TEXTS.profile_generate(user, true, true), /tg:\/\/emoji\?id=5381905325412625519/)
  assert.match(TEXTS.profile_generate(user), /tg:\/\/emoji\?id=5379990525912853171/)
  assert.doesNotMatch(TEXTS.profile_generate(user, false), /tg:\/\/emoji/)
  assert.match(TEXTS.profile_generate(user, false), /📍/)
  assert.match(TEXTS.profile_generate(user, false), /🏴‍☠️/)
})

test('anonymous location buttons use the custom icon and retain their action text', () => {
  const anonymousButton = BUTTONS.edit_profile_location_menu.reply_markup.keyboard[1][0]
  const confirmButton = BUTTONS.edit_profile_location_anon_menu.reply_markup.keyboard[0][0]

  assert.equal(anonymousButton.text, TEXTS.edit_profile_location_btn_2)
  assert.equal(confirmButton.text, TEXTS.edit_profile_location_btn_3)
  assert.equal(anonymousButton.icon_custom_emoji_id, '5381905325412625519')
  assert.equal(confirmButton.icon_custom_emoji_id, '5381905325412625519')
})
