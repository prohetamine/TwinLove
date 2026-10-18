/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import { users } from '../helpers/db.js'
import { TEXTS, BUTTONS } from '../assets/ui/ru.js'
import sleep from 'sleep-promise'

const kickOldMessage = { /* user id */ }

const callback_querys = async ctx => {
  const data = ctx.update?.callback_query?.data || ''
  
  if (data.match(/support_\d+/)) {
    try {
      const [, id] = data.split('_')
      ctx.user.system_adminSelectId = parseInt(id)
      await users.set(ctx.user.id, ctx.user)
      await ctx.telegram.answerCbQuery(ctx.update.callback_query.id, TEXTS.support_response)
      await ctx.reply(TEXTS.admin, BUTTONS.back_to_main_menu)
      await ctx.enterScene('admin-menu')
    } catch (e) {}
    return
  }

  if (data === 'tip_refresh') {
    for (;;) { // 400 not edited
      try {
        const tip = TEXTS.tips[parseInt(TEXTS.tips.length * Math.random())]
        await ctx.telegram.editMessageText(ctx.update.callback_query.message.chat.id, ctx.update.callback_query.message.message_id, 0, tip, BUTTONS.tips_inline_menu)
        await sleep(1000)
        break
      } catch (e) {}
    }
    return
  }

  if (data === 'tip_hidden') {
    ctx.user.system_tipHidden = true
    await users.set(ctx.user.id, ctx.user)
    await ctx.telegram.deleteMessage(ctx.update.callback_query.message.chat.id, ctx.update.callback_query.message.message_id)
    return
  }

  if (data.match(/(h_|w_|r_)/)) {
    await ctx.telegram.answerCbQuery(ctx.update.callback_query.id, TEXTS.demo)
    return
  }

  if (data.match(/(profileres_|profilerej_)/)) {
    const [type, id] = data.split('_')

    const user = await users.get(id)

    if (type === 'profileres') {
      user.system_publishModerationStatus = true
      await users.set(user.id, user)
      await ctx.deleteMessage()
    } else {
      user.system_publishModerationRequest = false
      user.system_publishModerationStatus = false
      await users.set(user.id, user)
      try {
        await ctx.telegram.sendMessage(user.id, TEXTS.publish_profile_moderation_reject_request, { parse_mode: 'MarkdownV2' })
      } catch (e) {}
      await ctx.deleteMessage()
    }

    await ctx.telegram.answerCbQuery(ctx.update.callback_query.id, TEXTS.publish_profile_moderation_ok)
    return
  }

  if (data.match(/(rej_|res_|people_|nopeople_)/)) {
    const [type, id, mediaId] = data.split('_')

    const user = await users.get(id)

    if (user) {
      if (!user.media.find(media => media.id === mediaId)) {
        await ctx.telegram.answerCbQuery(ctx.update.callback_query.id, TEXTS.edit_profile_media_not_found)
        await ctx.deleteMessage()
        return
      }

      if (type === 'people' || type === 'nopeople') {
        user.media = user.media.map(media => {
          if (media.id === mediaId) {
            return {
              ...media,
              isPeople: !(type === 'people')
            }
          }

          return media
        })

        await users.set(user.id, user)

        const currentMedia = user.media.find(media => media.id === mediaId)

        await ctx.telegram.editMessageReplyMarkup(
          ctx.update.callback_query.message.chat.id, 
          ctx.update.callback_query.message.message_id, 
          ctx.update.callback_query.id,
          BUTTONS.edit_profile_media_admin_approve_inline(user.id, currentMedia.id, currentMedia.isPeople).reply_markup
        )

        await ctx.telegram.answerCbQuery(ctx.update.callback_query.id, TEXTS.edit_profile_media_ok)
      }

      if (type === 'rej' || type === 'res') {
        user.media = user.media.map(media => {
          if (media.id === mediaId && type === 'rej') {
            return {
              ...media,
              isReject: true,
              isApprove: false
            }
          }

          if (media.id === mediaId && type === 'res') {
            return {
              ...media,
              isApprove: true,
              isReject: false
            }
          }

          return media
        })

        try {
          const currentMedia = user.media.find(media => media.id === mediaId)
          await ctx.telegram.sendMessage(user.id, type === 'rej' ? TEXTS.edit_profile_media_reject(null) : TEXTS.edit_profile_media_approve(null), {
            reply_to_message_id: currentMedia?.messageId
          })
        } catch (e) {
          try {
            await ctx.telegram.sendMessage(user.id, type === 'rej' ? TEXTS.edit_profile_media_reject(mediaId) : TEXTS.edit_profile_media_approve(mediaId))
          } catch (e) {}
        }

        await users.set(user.id, user)
        await ctx.deleteMessage()
      }    
    }
    return
  }

  if (data.match(/mediaprivacy_/)) {
    const [_, _access, _city, _media] = data.split('_')
    
    const access = parseInt(_access)
        , city = parseInt(_city)
        , media = parseInt(_media)
    
    ctx.user.privacyMedia = [access, city, media]

    try {
      await ctx.telegram.editMessageReplyMarkup(
        ctx.update.callback_query.message.chat.id, 
        ctx.update.callback_query.message.message_id, 
        ctx.update.callback_query.id,
        BUTTONS.edit_profile_media_privacy_inline_menu(ctx.user.privacyMedia).reply_markup
      )

      await users.set(ctx.user.id, ctx.user)

      if (kickOldMessage[ctx.user.id]) {
        try {
          await ctx.deleteMessage(kickOldMessage[ctx.user.id])
          await sleep(500)
        } catch (e) {}
        kickOldMessage[ctx.user.id] = null
      }

      const { message_id } = await ctx.reply(TEXTS.edit_profile_update, BUTTONS.edit_profile_media_menu)
      kickOldMessage[ctx.user.id] = message_id
    } catch (e) {
      await ctx.telegram.answerCbQuery(ctx.update.callback_query.id, TEXTS.edit_profile_media_privacy_error_select)
    }
    return
  }
}

export default callback_querys
