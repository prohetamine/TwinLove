import replyWithHelp from '../../modules/reply-with-help.js'
import { users } from '../../helpers/db.js'
import sleep from 'sleep-promise'
import { TEXTS, BUTTONS } from '../../assets/ui/ru.js'
import { nanoid } from 'nanoid'
import textScreening from '../../lib/text-screening.js'

const fixMediaGroup = { /* user save timer id */ }

const mediaMenu = async ctx => {
  const { 
    text = '', 
    photo = null, 
    video = null, 
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
      
  if (text === TEXTS.back_to_menu_btn) {
    await ctx.reply(TEXTS.edit, BUTTONS.edit_menu)
    await ctx.enterScene('edit-menu')
    return
  }

  if (text === TEXTS.edit_profile_privacy_btn) {
    await ctx.reply(TEXTS.edit_profile_media_privacy, BUTTONS.edit_profile_media_privacy_inline_menu(ctx.user.privacyMedia))
    return
  }

  if (text === TEXTS.edit_profile_media_btn_2) {
    ctx.user.media = []
    await users.set(ctx.user.id, ctx.user)
    await ctx.reply(TEXTS.edit_profile_media_remove(5 - ctx.user.media.filter(m => !m.isReject).length), BUTTONS.edit_profile_media_menu)
    return
  }

  if (photo || video) {
    const file = video || photo.pop()

    if (file.file_id) {
      if (file.file_size <= 15728640) {
        const media = {
          messageId: ctx.update.message.message_id,
          id: nanoid(6).replace(/( |_|-)/gi, 'f'),
          fileId: file.file_id,
          isPhoto: photo ? true : false,
          isApprove: false,
          isReject: false,
          isPeople: true
        }

        ctx.user.media = [
          media,
          ...ctx.user.media.filter(m => !m.isReject)
        ].slice(0, 5)

        await users.set(ctx.user.id, ctx.user)

        await ctx.reply(TEXTS.edit_profile_media_additional, {
          reply_to_message_id: ctx.update.message.message_id,
          ...BUTTONS.edit_profile_media_menu
        })

        if (fixMediaGroup[ctx.user.id]) {
          clearTimeout(fixMediaGroup[ctx.user.id])
        }

        fixMediaGroup[ctx.user.id] = setTimeout(async () => {     
          if (5 - ctx.user.media.filter(m => !m.isReject).length) {
            await ctx.reply(TEXTS.edit_profile_media_question(5 - ctx.user.media.filter(m => !m.isReject).length), BUTTONS.edit_profile_media_menu)
          }
        }, 1000)

        const admins = await users.all({ 'system_isAdmin': true })

        for (let x = 0; x < admins.length; x++) {
          const { id } = admins[x]
          const from = ctx.update.message.from
          const userData = `*${textScreening(from.first_name ? `${from.first_name} ` : '')}${textScreening(from.last_name ? `${from.last_name} ` : '')}*${from.username ? `\\| _@${textScreening(from.username)}_ ` : ``}\\(${from.id}\\)`

          await ctx.telegram[media.isPhoto ? 'sendPhoto' : 'sendVideo'](id, media.fileId, {
            caption: userData, 
            ...BUTTONS.edit_profile_media_admin_approve_inline(ctx.user.id, media.id, media.isPeople)
          })
          
          await sleep(5000)
        }
      } else {
        await ctx.reply(TEXTS.edit_profile_media_error, {
          reply_to_message_id: ctx.update.message.message_id,
          ...BUTTONS.edit_profile_media_menu
        })
      }
    }

    return
  }

  if (voice || video_note || animation || venue || sticker || location || invoice || game || dice || document || contact || audio || poll) {
    await ctx.reply(TEXTS.content_error_media, BUTTONS.edit_profile_media_menu)
    return
  }

  await replyWithHelp(ctx)
}

export default mediaMenu
