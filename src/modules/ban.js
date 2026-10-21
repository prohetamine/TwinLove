import { TEXTS, BUTTONS } from '../assets/ui/ru.js'
import { users } from '../helpers/db.js'
import { nanoid } from 'nanoid'

const ban = async ctx => {
  const text = ctx.update?.message?.text || ''

  if (text === TEXTS.support_btn || text === '/support') {
    ctx.user.system_supportHashId = nanoid(6).replace(/(_|-)/gi, 'Z')
    ctx.user.system_selectCallAction = ''
    ctx.user.system_selectCallHashId = ''
    await users.set(ctx.user.id, ctx.user)
    await ctx.reply(TEXTS.support, BUTTONS.back_to_main_menu)
    await ctx.enterScene('support-menu')
    return
  }

  if (ctx.update?.callback_query) await ctx.answerCbQuery?.()
  await ctx.reply(TEXTS.blocked(ctx.user), { ...BUTTONS.remove_menu, parse_mode: 'MarkdownV2' })
}

export default ban
