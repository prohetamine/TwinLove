import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { once } from 'node:events'
import { Telegram } from 'telegraf'
import buildRichProfileCard from '../src/modules/build-rich-profile-card.js'
import sendRichProfileCard, { richPhotoFileIds } from '../src/modules/send-rich-profile-card.js'
import selectProfileCardMedia from '../src/modules/select-profile-card-media.js'
import { BUTTONS } from '../src/assets/ui/ru.js'

const user = {
  name: 'Анна <3',
  text: 'Привет! Буду рада знакомству.',
  location: '999|666',
  privacyCity: 0
}

test('preview includes all three media items before the profile text', () => {
  const preview = buildRichProfileCard(user, [
    { type: 'photo', fileId: 'photo_1' },
    { type: 'video', fileId: 'video_2' },
    { type: 'photo', fileId: 'photo_3' }
  ])

  assert.equal(preview.media.length, 3)
  assert.match(preview.html, /<tg-slideshow><img src="tg:\/\/photo\?id=media_0"\/><video src="tg:\/\/video\?id=media_1"><\/video><img src="tg:\/\/photo\?id=media_2"\/><\/tg-slideshow>/)
  assert.ok(preview.html.indexOf('<tg-slideshow>') < preview.html.indexOf('Анна'))
  assert.match(preview.html, /<h1>Анна &lt;3<\/h1><p>/)
  assert.match(preview.html, /<p>Привет! Буду рада знакомству\.<\/p>/)
  assert.match(preview.html, /<\/p><p>&nbsp;<\/p><p><b>Анонимный/)
  assert.match(preview.html, /Анонимный 🏴‍☠️ 📍<\/b>.*<\/p><p>&nbsp;<\/p><p><a href=/)
})

test('plain bio keeps line breaks and escapes user HTML', () => {
  const card = buildRichProfileCard({ ...user, text: 'Первая строка\n<вторая> & друзья' }, [])
  assert.match(card.html, /<p>Первая строка<br>&lt;вторая&gt; &amp; друзья<\/p>/)
})

test('new privacy image is attached to the first Rich Message and its file ID can be cached', async () => {
  const preview = buildRichProfileCard(user, [{ type: 'photo', fileId: 'attach://preview_0' }])
  let call
  const sent = await sendRichProfileCard({
    chatId: 42,
    richMessage: preview,
    replyMarkup: { inline_keyboard: [[{ text: '✍️', callback_data: 'w_42' }]] },
    uploads: [{ name: 'preview_0', source: Buffer.from('image bytes') }],
    telegram: {
      callApi: async (method, payload) => {
        call = { method, payload }
        return { message_id: 10, rich_message: { blocks: [{ photo: [{ file_id: 'cached_photo' }] }] } }
      }
    }
  })

  assert.equal(call.method, 'sendRichMessage')
  assert.equal(JSON.parse(call.payload.rich_message).media[0].media.media, 'attach://preview_0')
  assert.equal(call.payload.preview_0.source.toString(), 'image bytes')
  assert.equal(call.payload.preview_0.filename, 'preview_0.png')
  assert.deepEqual(richPhotoFileIds(sent), ['cached_photo'])
})

test('Telegraf sends rich media as multipart using its Bot API client', async () => {
  let request
  const server = createServer(async (req, res) => {
    const chunks = []
    for await (const chunk of req) chunks.push(chunk)
    request = { path: req.url, type: req.headers['content-type'], body: Buffer.concat(chunks).toString() }
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ ok: true, result: { message_id: 12 } }))
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  try {
    const telegram = new Telegram('test-token', { apiRoot: `http://127.0.0.1:${server.address().port}` })
    const result = await sendRichProfileCard({
      telegram,
      chatId: 42,
      richMessage: buildRichProfileCard(user, [{ type: 'photo', fileId: 'attach://preview_0' }]),
      replyMarkup: { inline_keyboard: [] },
      uploads: [{ name: 'preview_0', source: Buffer.from('image bytes') }]
    })
    assert.equal(result.message_id, 12)
    assert.match(request.path, /sendRichMessage$/)
    assert.match(request.type, /multipart\/form-data/)
    assert.match(request.body, /attach:\/\/preview_0/)
    assert.match(request.body, /filename="preview_0.png"/)
    assert.match(request.body, /image bytes/)
  } finally {
    server.close()
    await once(server, 'close')
  }
})

test('channel and moderation cards include every approved eligible medium', () => {
  const media = [
    { id: 'one', isApprove: true, isPeople: true },
    { id: 'two', isApprove: true, isPeople: false },
    { id: 'three', isApprove: true, isPeople: true },
    { id: 'four', isApprove: false, isPeople: true }
  ]
  assert.deepEqual(selectProfileCardMedia(media, true).map(item => item.id), ['one', 'two', 'three'])
  assert.deepEqual(selectProfileCardMedia(media, false).map(item => item.id), ['one', 'three'])

  const adminCard = buildRichProfileCard({ ...user, id: 42, system_username: 'test_user' }, [
    { type: 'photo', fileId: 'photo_1' },
    { type: 'photo', fileId: 'photo_3' }
  ], { isAdmin: true })
  assert.match(adminCard.html, /User data: @test_user \(42\)/)
  assert.equal(adminCard.media.length, 2)
  assert.equal(BUTTONS.profile_generate_moderation_inline(42).reply_markup.inline_keyboard[0].length, 2)
  assert.deepEqual(BUTTONS.profile_generate_inline({ isChannel: true, id: 'test' }).reply_markup.inline_keyboard[0].map(button => button.text), ['✍️', '👋', '⚠️'])
})
