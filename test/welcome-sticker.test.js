import test from 'node:test'
import assert from 'node:assert/strict'
import start from '../src/scenes/start.js'
import { TEXTS, BUTTONS } from '../src/assets/ui/ru.js'

const makeContext = replyWithSticker => {
  const events = []
  const ctx = {
    telegram: { getStickerSet: () => { throw new Error('Sticker set must not be fetched on /start') } },
    replyWithSticker: async stickerId => {
      events.push(['sticker', stickerId])
      if (replyWithSticker) await replyWithSticker(stickerId)
    },
    reply: async (text, options) => { events.push(['text', text, options]) },
    enterScene: async scene => { events.push(['scene', scene]) },
    user: { system_age18Confirm: false, system_rulesConfirm: false, system_phoneNumber: '' }
  }

  return { ctx, events }
}

test('start sends the saved TwinLove sticker before the welcome text', async () => {
  const { ctx, events } = makeContext()

  await start(ctx)

  assert.equal(events[0][0], 'sticker')
  assert.match(events[0][1], /^CAACAg[A-Za-z0-9_-]+$/)
  assert.deepEqual(events.slice(1), [
    ['text', TEXTS.hello, { parse_mode: 'MarkdownV2' }],
    ['scene', 'age18confirm-menu'],
    ['text', TEXTS.age18Confirm, BUTTONS.age18Confirm_menu]
  ])
})

test('start still shows the welcome text if sending the sticker fails', async () => {
  const { ctx, events } = makeContext(async () => { throw new Error('unavailable') })

  await start(ctx)

  assert.deepEqual(events.slice(1), [
    ['text', TEXTS.hello, { parse_mode: 'MarkdownV2' }],
    ['scene', 'age18confirm-menu'],
    ['text', TEXTS.age18Confirm, BUTTONS.age18Confirm_menu]
  ])
})
