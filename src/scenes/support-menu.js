import { CHANNEL_LINK } from '../../configs/env.js'
import { TEXTS, BUTTONS } from '../assets/ui/ru.js'
import { posts, users } from '../helpers/db.js'
import textScreening from './../lib/text-screening.js'
import sleep from 'sleep-promise'

const supportMenu = async ctx => {  
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
    await ctx.reply(TEXTS.home, BUTTONS.main_menu)
    await ctx.enterScene('main-menu')
    return
  }

  if (text || photo || video || caption) {
    await ctx.reply(TEXTS.support_message_delivery, BUTTONS.back_to_main_menu)
  
    if (text) {      
      const support = await users.all({ 'system_isSupport': true })

      for (let x = 0; x < support.length; x++) {
        const from = ctx.update.message.from
        
        const [user = false] = await users.all({ 'system_callHashId': ctx.user.system_selectCallHashId })

        let postId = null
        if (user) {
          const _posts = await posts.get(user.id)
          if (_posts.ids.length > 0) {
            postId = _posts.ids.sort((a, b) => b - a)[0]
          }
        }

        const userData = `*${textScreening(from.first_name ? `${from.first_name} ` : '')}${textScreening(from.last_name ? `${from.last_name} ` : '')}*${from.username ? `\\| _@${textScreening(from.username)}_ ` : ``}\\(${from.id}\\)`
            , sysData = `*Support hash ID:* \\#${ctx.user.system_supportHashId}\n*Call action:* ${ctx.user.system_selectCallAction || 'none'}\n*Call ID:* ${ctx.user.system_selectCallHashId || 'none'}\n*Blocked status:* ${ctx.user.system_block_status ? ctx.user.system_block_message || '🔴' : (ctx.user.system_block_status ? '🔴' : '🟢')}${postId ? `\n*Post:* ${textScreening(CHANNEL_LINK)}/${postId}` : ''}`

        await ctx.telegram.sendMessage(support[x].id, `_Текст:_ ${textScreening(text)}\n——————\n${userData}\n\\- \\- \\- \\- \\-\n${sysData}`, BUTTONS.support_inline_menu(`${from.id}`))
        await sleep(5000)
      }
    } else {
      const { file_id } = photo ? photo.pop() : video

      const support = await users.all({ 'system_isSupport': true })
        
      for (let x = 0; x < support.length; x++) {
        const from = ctx.update.message.from

        const [user = false] = await users.all({ 'system_callHashId': ctx.user.system_selectCallHashId })

        let postId = null
        if (user) {
          const _posts = await posts.get(user.id)
          if (_posts.ids.length > 0) {
            postId = _posts.ids.sort((a, b) => b - a)[0]
          }
        }

        const userData = `*${textScreening(from.first_name ? `${from.first_name} ` : '')}${textScreening(from.last_name ? `${from.last_name} ` : '')}*${from.username ? `\\| _@${textScreening(from.username)}_ ` : ``}\\(${from.id}\\)`
            , sysData = `*Support hash ID:* \\#${ctx.user.system_supportHashId}\n*Call action:* ${ctx.user.system_selectCallAction || 'none'}\n*Call ID:* ${ctx.user.system_selectCallHashId || 'none'}\n*Blocked status:* ${ctx.user.system_block_status ? ctx.user.system_block_message || '🔴' : (ctx.user.system_block_status ? '🔴' : '🟢')}${postId ? `\n*Post:* ${textScreening(CHANNEL_LINK)}/${postId}` : ''}`

        await ctx.telegram[photo ? 'sendPhoto' : 'sendVideo'](support[x].id, file_id, {
          caption: `${caption.length !== 0 ? `_Текст:_ ${textScreening(caption)}\n` : ''}——————\n${userData}\n\\- \\- \\- \\- \\-\n${sysData}`,
          ...BUTTONS.support_inline_menu(`${from.id}`)
        })
        await sleep(5000)
      }
    }

    return
  }

  if (voice || video_note || animation || venue || sticker || location || invoice || game || dice || document || contact || audio || poll) {
    await ctx.reply(TEXTS.content_error, BUTTONS.back_to_main_menu)
    return
  }
}

export default supportMenu