import { users } from '../helpers/db.js'
import { MEDIA, TEXTS, BUTTONS } from './../assets/ui/ru.js'
import { nanoid } from 'nanoid'

const mainMenu = async ctx => {
  const text = ctx.update?.message?.text || ''

  if (text === TEXTS.profile_btn) {
    await ctx.reply(TEXTS.profile(ctx), BUTTONS.profile_menu)
    await ctx.enterScene('profile-menu')
    return
  }

  if (text === TEXTS.other_btn) {
    await ctx.reply(TEXTS.other, BUTTONS.other_menu)
    await ctx.enterScene('other-menu')
    return
  }

  if (text === TEXTS.rules_btn) {
    await ctx.replyWithPhoto(MEDIA.rules_bg, {
      caption: TEXTS.rules,
      ...BUTTONS.main_menu,
      disable_web_page_preview: true
    })
    return
  }

  if (text === TEXTS.channel_btn) {
    await ctx.replyWithPhoto(MEDIA.channel_bg, {
      caption: TEXTS.channel, 
      ...BUTTONS.channel_inline
    })
    return
  }

  if (text === TEXTS.support_btn) {
    ctx.user.system_supportHashId = nanoid(6).replace(/(_|-)/gi, 'Z')
    ctx.user.system_selectCallAction = ''
    ctx.user.system_selectCallHashId = ''
    await users.set(ctx.user.id, ctx.user)
    await ctx.replyWithPhoto(MEDIA.support_bg, {
      caption: TEXTS.support, 
      ...BUTTONS.back_to_main_menu
    })
    await ctx.enterScene('support-menu')
    return
  }
  
  await ctx.replyWithPhoto(MEDIA.help, {
    caption: TEXTS.help.replace(/\\/gi, ''),
  })
}

export default mainMenu
