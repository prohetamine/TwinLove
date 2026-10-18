import { users } from '../helpers/db.js'
import { TEXTS, BUTTONS } from '../assets/ui/ru.js'

const adminMenu = async ctx => {  
  const { 
    text = '', 
    photo, 
    video, 
    caption = '', 
    voice, 
    video_note, 
    animation, 
    venue, 
    sticker, 
    location, 
    invoice, 
    game, 
    dice, 
    document, 
    contact, 
    audio, 
    poll 
  } = ctx.update?.message || {}

  if (text === TEXTS.back_to_main_menu_btn || text === 'Назад в главное меню ⏪') {
    ctx.user.system_adminSelectId = 0
    await users.set(ctx.user.id, ctx.user)
    await ctx.reply(TEXTS.home, BUTTONS.main_menu)
    await ctx.enterScene('main-menu')
    return
  }

  if (text || photo || video || caption) {
    if (text) {      
      await ctx.telegram.sendMessage(ctx.user.system_adminSelectId, `Поддержка: ${text}`)
    } else {
      const { file_id } = photo ? photo.pop() : video
      await ctx.telegram[photo ? 'sendPhoto' : 'sendVideo'](ctx.user.system_adminSelectId, file_id, {
        caption: `Поддержка: ${caption || ''}`
      })
    }

    return
  }

  if (voice || video_note || animation || venue || sticker || location || invoice || game || dice || document || contact || audio || poll) {
    await ctx.reply(TEXTS.content_error, BUTTONS.back_to_main_menu)
    return
  }
}

export default adminMenu