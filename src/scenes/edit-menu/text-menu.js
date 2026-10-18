import { users } from '../../helpers/db.js'
import sleep from 'sleep-promise'
import { TEXTS, BUTTONS } from '../../assets/ui/ru.js'

const textMenu = async ctx => {
  const text = ctx.update?.message?.text || ''

  if (text === TEXTS.back_to_menu_btn || text === 'Назад в меню ⏪') {
    await ctx.reply(TEXTS.edit, BUTTONS.edit_menu)
    await ctx.enterScene('edit-menu')
    return
  }

  if (text.length < 20) {
    await ctx.reply(TEXTS.edit_profile_text_error_length, BUTTONS.edit_profile_text_menu)
    return
  }

  if (text.length > 800) {
    await ctx.reply(TEXTS.edit_profile_text_error_length_long, BUTTONS.edit_profile_text_menu)
    return
  }

  ctx.user.text = text
                    .replace(/42777/gi, 'No')
                    .replace(/t\.me/gi, 'No')
                    .replace(/(http:\/\/|https:\/\/)/gi, 'No')
  
  await users.set(ctx.user.id, ctx.user)

  const { message_id } = await ctx.reply(TEXTS.edit_profile_update, BUTTONS.remove_menu)

  await sleep(1000)
  await ctx.deleteMessage(message_id)
  await sleep(500)

  await ctx.reply(TEXTS.edit, BUTTONS.edit_menu)
  await ctx.enterScene('edit-menu')
}

export default textMenu
