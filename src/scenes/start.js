import { TEXTS, BUTTONS } from './../assets/ui/ru.js'
import sendWelcomeSticker from '../modules/send-welcome-sticker.js'

const start = async ctx => {
  await sendWelcomeSticker(ctx)
  await ctx.reply(TEXTS.hello, BUTTONS.main_menu)
  await ctx.enterScene('main-menu')
}

export default start
