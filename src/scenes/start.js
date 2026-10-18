/* eslint-disable no-unused-vars */
import { MEDIA, TEXTS, BUTTONS } from './../assets/ui/ru.js'

const start = async ctx => {
  try {
    await ctx.replyWithVideoNote(MEDIA.logo, {
      duration: 2,
      length: 250,
      ...BUTTONS.main_menu
    })
  } catch (e) {
    try {
      await ctx.replyWithDocument(MEDIA.logo_gif, {
        filename: 'oninet.gif',
        ...BUTTONS.main_menu
      })
    } catch (e) {
      await ctx.reply('logo', {
        ...BUTTONS.main_menu
      })
    }
  }

  await ctx.reply(TEXTS.hello, BUTTONS.channel_start_inline)
  await ctx.enterScene('main-menu')
}

export default start