import { IS_DEV } from '../../configs/env.js'

export const PUBLICATION_COOLDOWN_MS = 1000 * 60 * 60 * 48

const getPublicationCooldownRemaining = (lastPostTime, now = Date.now(), isDev = IS_DEV) => {
  if (isDev) return 0

  return Math.max(0, Number(lastPostTime) + PUBLICATION_COOLDOWN_MS - now)
}

export default getPublicationCooldownRemaining
