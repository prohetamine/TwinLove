import test from 'node:test'
import assert from 'node:assert/strict'
import registerReferral from '../src/modules/register-referral.js'
import { TEXTS, BUTTONS } from '../src/assets/ui/ru.js'

const makeRepositories = () => {
  const owners = [
    { id: 1, system_referalHashId: 'abcd' },
    { id: 2, system_referalHashId: 'efgh' }
  ]
  const records = new Map(owners.map(owner => [owner.id, { id: owner.id, ids: [] }]))
  let writes = 0

  return {
    db: {
      users: { all: async ({ system_referalHashId }) => owners.filter(owner => owner.system_referalHashId === system_referalHashId) },
      referals: {
        get: async id => records.get(id),
        all: async ({ ids }) => [...records.values()].filter(record => record.ids.includes(ids)),
        set: async (id, record) => { records.set(id, record); writes++ }
      }
    },
    records,
    getWrites: () => writes
  }
}

test('a referral is counted once, even after opening the link again', async () => {
  const { db, records, getWrites } = makeRepositories()

  assert.equal(await registerReferral('abcd', 3, db), true)
  assert.equal(await registerReferral('abcd', 3, db), false)
  assert.equal(await registerReferral('efgh', 3, db), false)
  assert.deepEqual(records.get(1).ids, [3])
  assert.deepEqual(records.get(2).ids, [])
  assert.equal(getWrites(), 1)
})

test('a user cannot invite themselves or use an unknown referral code', async () => {
  const { db, getWrites } = makeRepositories()

  assert.equal(await registerReferral('abcd', 1, db), false)
  assert.equal(await registerReferral('none', 3, db), false)
  assert.equal(getWrites(), 0)
})

test('the invite link is displayed without Markdown escapes inside its code span', () => {
  const message = TEXTS.referal_link('aB12', 3, 1)

  assert.match(message, /`https:\/\/[^`\\]+\?start=aB12`/)
  assert.match(message, /Перешли по ссылке: 3/)
  assert.match(message, /Опубликовали анкету: 1/)
})

test('the invite button uses the TwinLove handshake icon', () => {
  const button = BUTTONS.main_menu.reply_markup.keyboard.flat().find(item => item.text === TEXTS.referal_link_btn)

  assert.deepEqual(button, { text: 'Пригласить друзей', icon_custom_emoji_id: '5379672612433601461' })
})
