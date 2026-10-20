import { spawn } from 'node:child_process'
import { createCanvas, loadImage } from 'canvas'
import axios from 'axios'
import cBlur from 'ctx-blur'
import { fileTypeFromBuffer } from 'file-type'
import sharp from 'sharp'

const MAX_MEDIA_BYTES = 20 * 1024 * 1024
const MAX_FRAME_BYTES = 32 * 1024 * 1024
const DOWNLOAD_TIMEOUT_MS = 120000
const DOWNLOAD_ATTEMPTS = 3

const videoFrame = data => new Promise((resolve, reject) => {
  const process = spawn('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-i', 'pipe:0',
    '-an', '-vf', 'thumbnail', '-frames:v', '1',
    '-f', 'image2pipe', '-vcodec', 'png', 'pipe:1'
  ])
  const chunks = []
  let size = 0
  let error = ''

  process.stdout.on('data', chunk => {
    size += chunk.length
    if (size > MAX_FRAME_BYTES) {
      process.kill()
      reject(new Error('Video preview is too large'))
      return
    }
    chunks.push(chunk)
  })
  process.stderr.on('data', chunk => { error += chunk.toString() })
  process.on('error', reject)
  process.on('close', code => {
    if (code !== 0 || size === 0) {
      reject(new Error(error || 'Unable to extract video frame'))
      return
    }
    resolve(Buffer.concat(chunks))
  })
  process.stdin.on('error', err => {
    if (err.code !== 'EPIPE') reject(err)
  })
  process.stdin.end(data)
})

export const createBlurMediaPreviewFromBuffer = async (data, mime = '') => {
  const source = mime.startsWith('video/') ? await videoFrame(data) : data
  const image = await loadImage(source)
  const width = Math.max(1, Math.floor(image.width / 10))
  const height = Math.max(1, Math.floor(image.height / 10))
  const canvas = createCanvas(width, height)
  const bigCanvas = createCanvas(image.width, image.height)

  canvas.getContext('2d').drawImage(image, 0, 0, width, height)
  const blurred = await new Promise((resolve, reject) => {
    cBlur({ sigma: 0.5, radius: 2 })(canvas, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })

  bigCanvas.getContext('2d').drawImage(blurred, 0, 0, image.width, image.height)
  return sharp(bigCanvas.toBuffer('image/png')).resize(200).toBuffer()
}

export const downloadMedia = async (url, request = axios.get) => {
  let lastError
  for (let attempt = 0; attempt < DOWNLOAD_ATTEMPTS; attempt++) {
    try {
      return await request(url, {
        responseType: 'arraybuffer',
        timeout: DOWNLOAD_TIMEOUT_MS,
        maxContentLength: MAX_MEDIA_BYTES
      })
    } catch (error) {
      lastError = error
    }
  }
  throw lastError
}

const createBlurMediaPreview = async url => {
  try {
    const response = await downloadMedia(url)
    const data = Buffer.from(response.data)
    const type = await fileTypeFromBuffer(data)
    const mime = type?.mime || response.headers['content-type'] || ''
    return await createBlurMediaPreviewFromBuffer(data, mime)
  } catch (error) {
    console.log('create-blur-media-preview', error)
    return false
  }
}

export default createBlurMediaPreview
