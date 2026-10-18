// First sticker from https://t.me/addstickers/TwinLove
const WELCOME_STICKER_ID = 'CAACAgIAAxUAAWrUTqcz7wGCcjcECyV0OCPsBSz2AAKxpwACg2OgSvnXPIirqSOEPQQ'

const sendWelcomeSticker = async ctx => {
  try {
    await ctx.replyWithSticker(WELCOME_STICKER_ID)
    return true
  } catch {
    // A sticker failure must not block onboarding.
  }

  return false
}

export default sendWelcomeSticker
