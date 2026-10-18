import { users, referals, posts } from '../helpers/db.js'
import { MEDIA, TEXTS, BUTTONS } from '../assets/ui/ru.js'

const otherMenu = async ctx => {
  const text = ctx.update?.message?.text || ''

  if (text === TEXTS.back_to_main_menu_btn) {
    await ctx.reply(TEXTS.home, BUTTONS.main_menu)
    await ctx.enterScene('main-menu')
    return
  } 

  if (text === TEXTS.donate_btn) {
    await ctx.reply(TEXTS.donate, BUTTONS.other_menu)
    return
  }

  if (text === TEXTS.chat_btn) {
    await ctx.reply(TEXTS.chat, BUTTONS.chat_inline)
    return
  }

  if (text === TEXTS.source_code_btn) {
    await ctx.replyWithPhoto(MEDIA.source_bg, {
      caption: TEXTS.source_code, 
      ...BUTTONS.other_menu
    })
    return
  }

  if (text === TEXTS.referal_link_btn) {
    const referalHashId = ctx.user.system_referalHashId
    
    const _referals = (await referals.get(ctx.user.id)).ids
    
    const referalUsers = await users.all({ 'id': { $in: _referals } })

    const _posts = (await posts.all({ id: { $in: _referals } })).map(({ ids }) => ids.length > 0 ? 1 : 0).reduce((ctx, isPost) => ctx + isPost, 0)

    await ctx.reply(TEXTS.referal_link(referalHashId, referalUsers.length, _posts), BUTTONS.other_menu)
    return
  }
  
  await ctx.replyWithPhoto(MEDIA.help, {
    caption: TEXTS.help.replace(/\\/gi, ''),
  })
}

export default otherMenu