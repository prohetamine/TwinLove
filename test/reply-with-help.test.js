import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createReplyWithHelp } from '../src/modules/reply-with-help.js'

const makeFiles = t => {
  const directory = mkdtempSync(join(tmpdir(), 'twinlove-help-'))
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  const imagePath = join(directory, 'buttons.png')
  const cachePath = join(directory, 'cache.json')
  writeFileSync(imagePath, 'first image')
  return { imagePath, cachePath, cacheKey: 'dev' }
}

test('the first help image upload saves its file_id and later replies reuse it after restart', async t => {
  const options = makeFiles(t)
  const sent = []
  const ctx = {
    replyWithPhoto: async (input, captionOptions) => {
      sent.push(input)
      assert.match(captionOptions.caption, /Такой команды нет/)
      assert.match(captionOptions.caption, /\/start/)
      return { photo: [{ file_id: 'small-id' }, { file_id: 'large-id' }] }
    }
  }

  await createReplyWithHelp(options)(ctx)
  assert.equal(typeof sent[0], 'object')
  assert.equal(readFileSync(options.cachePath, 'utf8').includes('"file_id": "large-id"'), true)

  await createReplyWithHelp(options)(ctx)
  assert.equal(sent[1], 'large-id')
})

test('a changed image is uploaded again and a failed file_id retries the local file', async t => {
  const options = makeFiles(t)
  const send = createReplyWithHelp(options)
  await send({ replyWithPhoto: async () => ({ photo: [{ file_id: 'old-id' }] }) })

  writeFileSync(options.imagePath, 'updated image')
  const sent = []
  await createReplyWithHelp(options)({
    replyWithPhoto: async input => {
      sent.push(input)
      return { photo: [{ file_id: 'new-id' }] }
    }
  })
  assert.equal(typeof sent[0], 'object')

  const retried = []
  await createReplyWithHelp(options)({
    replyWithPhoto: async input => {
      retried.push(input)
      if (typeof input === 'string') throw new Error('expired file_id')
      return { photo: [{ file_id: 'replacement-id' }] }
    }
  })
  assert.equal(retried[0], 'new-id')
  assert.equal(typeof retried[1], 'object')
})

test('the /start hint still appears if the image cannot be sent', async t => {
  const options = makeFiles(t)
  let reply

  await createReplyWithHelp(options)({
    replyWithPhoto: async () => { throw new Error('photo unavailable') },
    reply: async text => { reply = text }
  })

  assert.match(reply, /\/start/)
})
