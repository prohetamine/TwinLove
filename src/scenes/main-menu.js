import { users, referals, posts } from '../helpers/db.js'
import { TEXTS, BUTTONS } from './../assets/ui/ru.js'
import { nanoid } from 'nanoid'

const mainMenu = async ctx => {
  const text = ctx.update?.message?.text || ''

  if (text === TEXTS.profile_btn || text === 'Анкета 👤') {
    await ctx.reply(TEXTS.profile(ctx), BUTTONS.profile_menu)
    await ctx.enterScene('profile-menu')
    return
  }

  if (text === 'Дополнительно 💼') {
    await ctx.reply(TEXTS.home, BUTTONS.main_menu)
    return
  }

  if (text === TEXTS.chat_btn || text === 'Общий чат 💬' || text === 'Общий чат 📝' || text === 'Ламповый чат 📝') {
    await ctx.reply(TEXTS.chat, BUTTONS.chat_inline)
    return
  }

  if (text === TEXTS.referal_link_btn || text === 'Пригласить друзей 🤝' || text === 'Пригласить друзей 🔗' || text === 'Реферальная ссылка 🔗') {
    const referalHashId = ctx.user.system_referalHashId
    const _referals = (await referals.get(ctx.user.id)).ids
    const referalUsers = await users.all({ id: { $in: _referals } })
    const _posts = (await posts.all({ id: { $in: _referals } }))
      .map(({ ids }) => ids.length > 0 ? 1 : 0)
      .reduce((total, isPost) => total + isPost, 0)

    await ctx.reply(TEXTS.referal_link(referalHashId, referalUsers.length, _posts), BUTTONS.main_menu)
    return
  }

  if (text === TEXTS.rules_btn || text === 'Правила 🚩') {
    await ctx.reply(TEXTS.rules, {
      ...BUTTONS.main_menu,
      disable_web_page_preview: true
    })
    return
  }

  if (text === TEXTS.channel_btn || text === 'Все анкеты 👥') {
    await ctx.reply(TEXTS.channel, {
      ...BUTTONS.channel_inline
    })
    return
  }

  if (text === TEXTS.support_btn || text === 'Поддержка ⚠️') {
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
  
  await ctx.reply(TEXTS.help.replace(/\\/gi, ''))
}

export default mainMenu
