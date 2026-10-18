import * as DEV from './dev.env.js'
import * as PROD from './prod.env.js'

const IS_DEV = process.env.mode === 'dev'

const MONGODB_URL       = IS_DEV ? DEV.MONGODB_URL      : PROD.MONGODB_URL
    , BOT_TOKEN         = IS_DEV ? DEV.BOT_TOKEN        : PROD.BOT_TOKEN
    , BOT_LINK          = IS_DEV ? DEV.BOT_LINK         : PROD.BOT_LINK
    , CHANNEL_LINK      = IS_DEV ? DEV.CHANNEL_LINK     : PROD.CHANNEL_LINK
    , CHANNEL_ID        = IS_DEV ? DEV.CHANNEL_ID       : PROD.CHANNEL_ID
    , CHAT_LINK         = IS_DEV ?  DEV.CHAT_LINK       : PROD.CHAT_LINK
    , CHAT_ID           = IS_DEV ? DEV.CHAT_ID          : PROD.CHAT_ID
    , CHANNEL_LOG_ID    = IS_DEV ? DEV.CHANNEL_LOG_ID   : PROD.CHANNEL_LOG_ID

export {
  IS_DEV,
  MONGODB_URL,
  BOT_TOKEN,
  BOT_LINK,
  CHANNEL_LINK,
  CHANNEL_ID,
  CHAT_LINK,
  CHAT_ID,
  CHANNEL_LOG_ID,
}