import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createCanvas } from 'canvas'
import sharp from 'sharp'
import { createBlurMediaPreviewFromBuffer, downloadMedia } from '../src/lib/create-blur-media-preview.js'
import { prepareMediaVariant, saveMediaVariantFileId } from '../src/modules/media-variants.js'

const media = {
  id: 'one', fileId: 'original-file-id', isPhoto: true,
  bluredFileId: '', bluredPrivacyFileId: '', privacyHash: ''
}

const telegram = { getFileLink: async fileId => ({ href: 'https://example.test/' + fileId }) }

const store = () => {
  const saved = { id: 42, media: [{ ...media }] }
  return {
    saved,
    get: async () => saved,
    set: async (_, patch) => Object.assign(saved, patch)
  }
}

test('blurred and privacy previews persist only Telegram file IDs', async () => {
  const preview = Buffer.from('temporary image')
  const repository = store()
  const user = { id: 42, media: [{ ...media }] }
  const blur = await prepareMediaVariant(user.media[0], 'blurred', {
    telegram, createBlur: async () => preview
  })
  assert.equal(blur.media.source, preview)
  await saveMediaVariantFileId(user, user.media[0], blur, { photo: [{ file_id: 'blur-id' }] }, repository)
  assert.equal(repository.saved.media[0].bluredFileId, 'blur-id')
  assert.equal(user.media[0].bluredFileId, 'blur-id')
  assert.equal(JSON.stringify(repository.saved).includes('temporary image'), false)
  assert.deepEqual(Object.values(repository.saved.media[0]).filter(Buffer.isBuffer), [])

  const privacy = await prepareMediaVariant(
    user.media[0], 'privacy',
    {
      telegram, privacyMedia: [1, 1, 0],
      createBlur: async () => { throw new Error('cached blur was ignored') },
      createPrivacy: async source => {
        assert.equal(source, 'https://example.test/blur-id')
        return preview
      }
    }
  )
  await saveMediaVariantFileId(user, user.media[0], privacy, { photo: [{ file_id: 'privacy-id' }] }, repository)
  assert.equal(repository.saved.media[0].bluredPrivacyFileId, 'privacy-id')
  assert.equal(repository.saved.media[0].privacyHash, '110-0')
  assert.deepEqual(Object.values(repository.saved.media[0]).filter(Buffer.isBuffer), [])
})

test('a removed photo is not restored while saving its preview ID', async () => {
  const repository = store()
  repository.saved.media = []
  const user = { id: 42, media: [{ ...media }] }
  await saveMediaVariantFileId(
    user, user.media[0], { cacheField: 'bluredFileId' },
    { photo: [{ file_id: 'blur-id' }] }, repository
  )
  assert.deepEqual(repository.saved.media, [])
  assert.equal(user.media[0].bluredFileId, '')
})

test('matching cached variants reuse file IDs without generating previews', async () => {
  const cached = {
    ...media, bluredFileId: 'blur-id',
    bluredPrivacyFileId: 'privacy-id', privacyHash: '110-0'
  }
  const fail = async () => { throw new Error('unexpected generation') }
  const options = { telegram, privacyMedia: [1, 1, 0], createBlur: fail, createPrivacy: fail }
  assert.equal((await prepareMediaVariant(cached, 'blurred', options)).media, 'blur-id')
  assert.equal((await prepareMediaVariant(cached, 'privacy', options)).media, 'privacy-id')
  assert.equal((await prepareMediaVariant(cached, 'original', options)).media, 'original-file-id')
})

test('image and video previews are generated in memory', async () => {
  const canvas = createCanvas(64, 64)
  canvas.getContext('2d').fillRect(0, 0, 64, 64)
  const imagePreview = await createBlurMediaPreviewFromBuffer(canvas.toBuffer('image/png'), 'image/png')
  assert.equal((await sharp(imagePreview).metadata()).format, 'png')

  const video = spawnSync('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-f', 'lavfi',
    '-i', 'color=c=red:s=64x64:d=1', '-c:v', 'mpeg4',
    '-movflags', 'frag_keyframe+empty_moov', '-f', 'mp4', 'pipe:1'
  ], { maxBuffer: 20 * 1024 * 1024 })
  assert.equal(video.status, 0, video.stderr.toString())
  const videoPreview = await createBlurMediaPreviewFromBuffer(video.stdout, 'video/mp4')
  assert.equal((await sharp(videoPreview).metadata()).format, 'png')
})

test('Telegram media download retries with a longer timeout', async () => {
  const calls = []
  const response = { data: Buffer.from('media'), headers: {} }
  const request = async (url, options) => {
    calls.push({ url, options })
    if (calls.length < 3) throw Object.assign(new Error('timeout'), { code: 'ECONNABORTED' })
    return response
  }

  assert.equal(await downloadMedia('https://example.test/media', request), response)
  assert.equal(calls.length, 3)
  assert.equal(calls[0].options.timeout, 120000)
  assert.equal(calls[0].options.maxContentLength, 20 * 1024 * 1024)
})
