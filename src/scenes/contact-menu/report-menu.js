import { nanoid } from 'nanoid'
import { TEXTS, BUTTONS } from '../../assets/ui/ru.js'
import { users } from '../../helpers/db.js'

const reportMenu = async ctx => {
  const text = ctx.update?.message?.text || ''

  if (text === TEXTS.back_to_main_menu_btn) {
    await ctx.reply(TEXTS.home, BUTTONS.main_menu)
    await ctx.enterScene('main-menu')
    return
  } 

  if (text === TEXTS.report_profile_btn || text === TEXTS.report_user_btn || text === 'Пожаловаться на анкету ⚠️' || text === 'Пожаловаться на поведение ⚠️') {
    ctx.user.system_supportHashId = nanoid(6).replace(/(_|-)/gi, 'Z')
    await users.set(ctx.user.id, ctx.user)
    await ctx.reply(TEXTS.support, BUTTONS.back_to_main_menu)
    await ctx.enterScene('support-menu')
    return
  }
  
  await ctx.reply(TEXTS.help.replace(/\\/gi, ''))
}

export default reportMenu
