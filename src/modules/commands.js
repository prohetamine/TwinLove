/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import { users, posts, referals } from '../helpers/db.js'
import { TEXTS, BUTTONS } from '../assets/ui/ru.js'
import { nanoid } from 'nanoid'
import sleep from 'sleep-promise'
import { CHANNEL_ID } from '../../configs/env.js'
import registerReferral from './register-referral.js'
import start from '../scenes/start.js'

const commands = async ctx => {
  const text = ctx.update?.message?.text || ''

  const [command, ...payload_] = text.split(' ')
      , payload = payload_.join(' ')

  if (command === '/start' && payload === 'geo') {
    await ctx.reply(TEXTS.edit_profile_location_help, {
      disable_web_page_preview: true,
      parse_mode: 'MarkdownV2'
    })
    return
  }

  if (command === '/start' && payload === 'privacycity') {
    await ctx.reply(TEXTS.edit_profile_contact_privacy_help, BUTTONS.main_menu)
    await ctx.enterScene('main-menu')
    return
  }

  if (command === '/start' && payload === 'dating18') {
    await ctx.reply(TEXTS.rules_dating18, {
      disable_web_page_preview: true,
      parse_mode: 'MarkdownV2'
    })
    return
  }

  if (command === '/start' && payload === 'nonotify') {
    await ctx.reply(TEXTS.edit_profile_notification_help, { parse_mode: 'MarkdownV2' })
    return
  }

  if (command === '/start' && payload === 'vsj') {
    await ctx.reply(TEXTS.rules_vsj, { parse_mode: 'MarkdownV2' })
    return
  }

  if (command === '/start' && payload === 'hello') {
    await ctx.reply(TEXTS.hello_action)
    return
  }

  if (command === '/start' && payload === 'anon') {
    await ctx.reply(TEXTS.edit_profile_location_anon_help, BUTTONS.main_menu)
    await ctx.enterScene('main-menu')
    return
  }

  if (command === '/rules' || (command === '/start' && payload === 'rules')) {
    await ctx.reply(TEXTS.rules, {
      ...BUTTONS.main_menu,
      disable_web_page_preview: true
    })
    await ctx.enterScene('main-menu')
    return
  } 

  if (text === '/channel' || (command === '/start' && payload === 'channel')) {
    await ctx.reply(TEXTS.channel, {
      ...BUTTONS.channel_inline
    })
    await ctx.enterScene('main-menu')
    return
  }

  if (text === '/support' || (command === '/start' && payload === 'support')) {
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

  if (text === '/next') {
    await ctx.reply(TEXTS.hello_next, BUTTONS.main_menu)
    await ctx.enterScene('main-menu')
    return 
  }

  if (text === '/next2') {
    await ctx.reply(TEXTS.hello_next_2, BUTTONS.main_menu)
    await ctx.enterScene('main-menu')
    return 
  }

  if (text === '/next3') {
    await ctx.reply(TEXTS.hello_next_3, BUTTONS.main_menu)
    await ctx.enterScene('main-menu')
    return 
  }

  if (text === '/chat' || (command === '/start' && payload === 'chat')) {
    await ctx.reply(TEXTS.chat, BUTTONS.chat_inline)
    await ctx.enterScene('main-menu')
    return
  }

  if (command === '/start' && payload.length === 4) {
    const id = ctx.update.message.from.id
    await registerReferral(payload, id, { users, referals })

    await start(ctx)
    return
  }

  if (ctx.isAdmin && command === '/ref' && payload.match(/.{4,8}/)) {
    const referalHashId = payload

    const [user = false] = await users.all({ 'system_referalHashId': referalHashId })
    
    if (user) {
      const referals = (await referals.get(user.id)).ids
      const referalUsers = await users.all({ 'id': { $in: referals } })

      const _posts = (await posts.all({ id: { $in: referals } })).map(({ ids }) => ids.length > 0 ? 1 : 0).reduce((ctx, isPost) => ctx + isPost, 0)
      
      await ctx.reply(TEXTS.referal_link(referalHashId, referalUsers.length, _posts), BUTTONS.main_menu)
    } else {
      await ctx.reply(TEXTS.referal_link_error, BUTTONS.main_menu)
    }
    return
  }

  if ((ctx.isAdmin || ctx.isSupport) && (command === '/ban' || command === '/unban')) {
    const [command, id_, ...message_] = text.split(' ')
    const id = parseInt(id_)
    const message =  (message_ || []).join(' ')

    if (command === '/ban') {
      const user = await users.get(id)
      user.system_block_message = message
      user.system_block_status = true
      user.system_block_auto = false
      await users.set(user.id, user)
      await ctx.reply(TEXTS.ban)
      return
    }

    if (command === '/unban') {
      const user = await users.get(id)
      user.system_block_message = ''
      user.system_block_status = false
      user.system_block_auto = false
      await users.set(user.id, user)
      await ctx.reply(TEXTS.unban)
      return
    }
  }

  if ((ctx.isAdmin || ctx.isSupport) && command === '/delete') {
    const [command, id_] = text.split(' ')
    const id = parseInt(id_)

    const post = await posts.get(id)
    for (let x = 0; x < post.ids.length; x++) {
      for (let y = 0; y < 3; y++) {
        try {
          await global.bot.telegram.deleteMessage(CHANNEL_ID, post.ids[x])
          break
        } catch (e) {
          console.log(e)
          await ctx.reply(TEXTS.error_delete(post.ids[x]))
          post.ids = post.ids.filter((_, i) => i !== x)
          await posts.set(post.id, post)
          await sleep(1000 * 60 * 5)
          break
        }
      }
      await sleep(60 * 1000)
    }

    await posts.set(post.id, post)
    await ctx.reply(TEXTS.delete)
    return
  }

  if (command === '/start' && payload.match(/^(r_|h_|w_)/)) {
    const [type, callHashId] = payload.split('_')
    
    const [_isUser = false] = await users.all({ system_callHashId: callHashId })

    let isUser = _isUser

    if (!isUser) {
      const [_isUser = false] = await users.all({ id: parseInt(callHashId) || -1 })
      isUser = _isUser
    }

    if (isUser) {
      ctx.user.system_selectCallHashId = callHashId
      ctx.user.system_selectCallAction = type === 'w' 
                                        ? 'write' 
                                        : type === 'r' 
                                            ? 'report' 
                                            : 'hello'
      await users.set(ctx.user.id, ctx.user)

      if (type === 'w') {
        await ctx.reply(TEXTS.write_btn, BUTTONS.contact_write_menu)
        await ctx.enterScene('write-menu')
      }

      if (type === 'h') {
        await ctx.reply(TEXTS.hello_btn, BUTTONS.contact_hello_menu)
        await ctx.enterScene('hello-menu')
      }

      if (type === 'r') {
        await ctx.reply(TEXTS.report_btn, BUTTONS.contact_report_menu)
        await ctx.enterScene('report-menu')
      }
    } else {
      await ctx.reply(TEXTS.home, BUTTONS.main_menu)
      await ctx.enterScene('main-menu')
    }
    return
  }

  if (ctx.isAdmin && command === '/reload') {
    await ctx.reply(TEXTS.reload)
    process.exit()
  }

  if ((ctx.isAdmin || ctx.isSupport) && command === '/status') {
    await ctx.reply(TEXTS.status)
    process.exit()
  }

  if ((ctx.isAdmin || ctx.isSupport) && command === '/commands') {
    await ctx.reply(TEXTS.mod_info)
    return
  }

  if (
    command === '/setadmin' ||
    command === '/unadmin' ||
    command === '/setsupport' ||
    command === '/unsupport'
  ) {
    if (ctx.isAdmin) {
      const [command, id_] = text.split(' ')
        , id = parseInt(id_)

      const [isExistsUser = false] = await users.all({ id })
      
      if (isExistsUser) {
        const user = await users.get(id)

        if (command === '/setadmin') {
          user.system_isAdmin = true
          await ctx.reply(TEXTS.admin_bot)
          try {
            await global.bot.telegram.sendMessage(id, TEXTS.admin_bot)
            await global.bot.telegram.sendMessage(id, TEXTS.mod_info)
          } catch (e) {}
        }
      
        if (command === '/unadmin') {
          user.system_isAdmin = false
          await ctx.reply(TEXTS.un_admin_bot)
        }
      
        if (command === '/setsupport') {
          user.system_isSupport = true
          await ctx.reply(TEXTS.support_bot)
          try {
            await global.bot.telegram.sendMessage(id, TEXTS.support_bot)
            await global.bot.telegram.sendMessage(id, TEXTS.mod_info)
          } catch (e) {}
        }
      
        if (command === '/unsupport') {
          user.system_isSupport = false
          await ctx.reply(TEXTS.un_support_bot)
        }

        await users.set(id, user) 
      } else {
        await ctx.reply(TEXTS.not_user_set_admin)
      }
    } else {
      await ctx.reply(TEXTS.not_user_set_admin)
    }
    return
  }
}

export default commands
