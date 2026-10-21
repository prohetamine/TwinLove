import test from 'node:test'
import assert from 'node:assert/strict'
import registerReferral from '../src/modules/register-referral.js'
import { createReferralLink, deriveReferralCode, isReferralCode, referralStatsByCode, referralView } from '../src/modules/referral-links.js'
import { User } from '../src/helpers/models.js'
import { TEXTS, BUTTONS } from '../src/assets/ui/ru.js'

const makeRepositories = () => {
  const owners = [
    { id: 1, system_referalHashId: 'abcd1234' },
    { id: 2, system_referalHashId: 'efgh5678' },
    { id: 3, system_referalHashId: 'ijkl9012' }
  ]
  const records = new Map(owners.map(owner => [owner.id, { id: owner.id, ids: [] }]))
  let writes = 0

  return {
    db: {
      users: { all: async query => 'system_referalHashId' in query
        ? owners.filter(owner => owner.system_referalHashId === query.system_referalHashId)
        : owners.filter(owner => query.id.$in.includes(owner.id)) },
      referals: {
        get: async id => records.get(id),
        all: async query => [...records.values()].filter(record => {
          if ('ids' in query) return record.ids.includes(query.ids)
          if ('links.code' in query) return record.links?.some(link => link.code === query['links.code'])
          if ('links.ids' in query) return record.links?.some(link => link.ids.includes(query['links.ids']))
          return false
        }),
        set: async (id, record) => { records.set(id, record); writes++ }
      }
    },
    records,
    getWrites: () => writes
  }
}

test('a referral is counted once, even after opening the link again', async () => {
  const { db, records, getWrites } = makeRepositories()

  assert.equal(await registerReferral('abcd1234', 3, db), true)
  assert.equal(await registerReferral('abcd1234', 3, db), false)
  assert.equal(await registerReferral('efgh5678', 3, db), false)
  assert.deepEqual(records.get(1).ids, [3])
  assert.deepEqual(records.get(2).ids, [])
  assert.equal(getWrites(), 1)
})

test('a user cannot invite themselves or use an unknown referral code', async () => {
  const { db, getWrites } = makeRepositories()

  assert.equal(await registerReferral('abcd1234', 1, db), false)
  assert.equal(await registerReferral('none', 3, db), false)
  assert.equal(getWrites(), 0)
})

test('each added link keeps its own visits and published-profile count', async () => {
  const { db, records } = makeRepositories()
  const code = await createReferralLink({ id: 1, system_referalHashId: 'abcd1234' }, db)
  assert.equal(code.length, 8)
  assert.equal(await registerReferral(code, 3, db), true)
  assert.equal(await registerReferral('abcd1234', 3, db), false)
  assert.equal(await registerReferral('efgh5678', 3, db), false)
  assert.deepEqual(records.get(1).links[0].ids, [3])
  assert.deepEqual(records.get(1).ids, [])

  const view = await referralView({ id: 1, system_referalHashId: 'abcd1234' }, {
    referals: db.referals,
    posts: { all: async () => [{ id: 3, ids: [99] }] }
  })
  assert.match(view, /start=abcd1234`[\s\S]*Перешли по ссылке: 0/)
  assert.match(view, new RegExp(`start=${code}\`[\\s\\S]*Перешли по ссылке: 1[\\s\\S]*Опубликовали анкету: 1`))
  assert.match(view, /!\[📎\]\(tg:\/\/emoji\?id=5382138546431764504\) `https:\/\/[^`]+\?start=abcd1234`\n!\[👞\]/)
})

test('extra referral codes derive from one primary code in a stable sequence', async () => {
  const { db } = makeRepositories()
  const user = { id: 1, system_referalHashId: 'abcd1234' }
  const first = await createReferralLink(user, db)
  const second = await createReferralLink(user, db)

  assert.equal(first, deriveReferralCode('abcd1234', 1))
  assert.equal(second, deriveReferralCode('abcd1234', 2))
  assert.notEqual(first, second)
  assert.equal(first.length, 8)
  assert.equal(second.length, 8)
})

test('only eight-character referral codes are valid', () => {
  const user = new User({ id: 99 })

  assert.equal(user.system_referalHashId.length, 8)
  assert.equal(isReferralCode(user.system_referalHashId), true)
  assert.equal(isReferralCode('abcd'), false)
  assert.equal(isReferralCode('abcd1234'), true)
  assert.equal(isReferralCode('abcde'), false)
})

test('admin lookup finds an extra code and returns a useful result for unknown codes', async () => {
  const { db } = makeRepositories()
  const code = await createReferralLink({ id: 1, system_referalHashId: 'abcd1234' }, db)
  await registerReferral(code, 3, db)
  const posts = { all: async () => [{ id: 3, ids: [42] }] }

  assert.deepEqual(await referralStatsByCode(code, { ...db, posts }), { code, visits: 1, published: 1 })
  assert.match(TEXTS.referal_link(code, 1, 1), new RegExp(`start=${code}`))
  assert.match(TEXTS.referal_link(code, 1, 1), /!\[📎\]\(tg:\/\/emoji\?id=5382138546431764504\) `https:\/\/[^`]+`\n!\[👞\]/)
  assert.equal(await referralStatsByCode('none', { ...db, posts }), null)
  assert.equal(typeof TEXTS.referal_link_error, 'string')
})

test('the invite link is displayed without Markdown escapes inside its code span', () => {
  const message = TEXTS.referal_links([{ code: 'aB12cD34', visits: 3, published: 1 }])

  assert.match(message, /`https:\/\/[^`\\]+\?start=aB12cD34`/)
  assert.match(message, /Перешли по ссылке: 3/)
  assert.match(message, /Опубликовали анкету: 1/)
})

test('the invite button uses the TwinLove handshake icon', () => {
  const button = BUTTONS.main_menu.reply_markup.keyboard.flat().find(item => item.text === TEXTS.referal_link_btn)

  assert.deepEqual(button, { text: 'Пригласить друзей', icon_custom_emoji_id: '5379672612433601461' })
})
