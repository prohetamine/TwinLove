import replyWithHelp from '../modules/reply-with-help.js'
import { users, referals, posts } from '../helpers/db.js'
import { TEXTS, BUTTONS } from './../assets/ui/ru.js'
import { nanoid } from 'nanoid'
import { referralView, referralMessageOptions } from '../modules/referral-links.js'

const mainMenu = async ctx => {
  const text = ctx.update?.message?.text || ''

  if (text === TEXTS.profile_btn) {
    await ctx.reply(TEXTS.profile(ctx), BUTTONS.profile_menu)
    await ctx.enterScene('profile-menu')
    return
  }

  if (text === TEXTS.chat_btn || text === 'Общий чат') {
    await ctx.reply(TEXTS.chat, BUTTONS.chat_inline)
    return
  }

  if (text === TEXTS.referal_link_btn) {
    await ctx.reply(await referralView(ctx.user, { referals, posts }), referralMessageOptions)
    return
  }

  if (text === TEXTS.rules_btn) {
    await ctx.reply(TEXTS.rules, {
      ...BUTTONS.main_menu,
      disable_web_page_preview: true
    })
    return
  }

  if (text === TEXTS.channel_btn) {
    await ctx.reply(TEXTS.channel, {
      ...BUTTONS.channel_inline
    })
    return
  }

  if (text === TEXTS.support_btn) {
    ctx.user.system_supportHashId = nanoid(6).replace(/(_|-)/gi, 'Z')
    ctx.user.system_selectCallAction = ''
    ctx.user.system_selectCallHashId = ''
    await users.set(ctx.user.id, ctx.user)
    await ctx.reply(TEXTS.support, {
      ...BUTTONS.back_to_main_menu
    })
    await ctx.enterScene('support-menu')
    return
  }
  
  await replyWithHelp(ctx)
}

export default mainMenu
