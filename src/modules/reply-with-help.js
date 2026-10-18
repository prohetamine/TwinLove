import { Input } from 'telegraf'
import { createHash, randomUUID } from 'node:crypto'
import { readFileSync, renameSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { IS_DEV } from '../../configs/env.js'
import { TEXTS } from '../assets/ui/ru.js'

const defaultImagePath = fileURLToPath(new URL('../assets/buttons.png', import.meta.url))
const defaultCachePath = fileURLToPath(new URL('../assets/cache.json', import.meta.url))
const helpText = TEXTS.help.replace(/\\/g, '')

const readCache = path => {
  try {
    const data = JSON.parse(readFileSync(path, 'utf8'))
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {}
  } catch {
    return {}
  }
}

export const createReplyWithHelp = ({
  imagePath = defaultImagePath,
  cachePath = defaultCachePath,
  cacheKey = IS_DEV ? 'dev' : 'prod'
} = {}) => {
  const imageHash = createHash('sha256').update(readFileSync(imagePath)).digest('hex')
  const savedImage = readCache(cachePath).buttons?.[cacheKey]
  let imageFileId = savedImage?.sha256 === imageHash ? savedImage.file_id : undefined

  const saveFileId = fileId => {
    try {
      const cache = readCache(cachePath)
      cache.buttons = {
        ...cache.buttons,
        [cacheKey]: { file_id: fileId, sha256: imageHash }
      }
      const temporaryPath = `${cachePath}.${process.pid}.${randomUUID()}.tmp`
      writeFileSync(temporaryPath, `${JSON.stringify(cache, null, 2)}\n`)
      renameSync(temporaryPath, cachePath)
    } catch {
      // The in-memory file ID still works if the cache file is read-only.
    }
  }

  return async ctx => {
    try {
      if (imageFileId) {
        try {
          await ctx.replyWithPhoto(imageFileId, { caption: helpText })
          return
        } catch {
          imageFileId = undefined
        }
      }

      const message = await ctx.replyWithPhoto(Input.fromLocalFile(imagePath), { caption: helpText })
      const fileId = message?.photo?.at(-1)?.file_id
      if (fileId) {
        imageFileId = fileId
        saveFileId(fileId)
      }
    } catch {
      await ctx.reply(helpText)
    }
  }
}

export default createReplyWithHelp()
