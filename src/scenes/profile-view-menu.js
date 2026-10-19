import replyWithHelp from '../modules/reply-with-help.js'
import { TEXTS, BUTTONS } from '../assets/ui/ru.js'
import getUserMedia from '../modules/get-user-media.js'
import sendProfileCard from '../modules/send-profile-card.js'
import { prepareMediaVariant, saveMediaVariantFileId } from '../modules/media-variants.js'
import { users } from '../helpers/db.js'

const profileViewMenu = async ctx => {
  const text = ctx.update?.message?.text || ''

  if (text === TEXTS.back_to_menu_btn) {
    await ctx.reply(TEXTS.profile(ctx), BUTTONS.profile_menu)
    await ctx.enterScene('profile-menu')
    return
  }

  if (text === TEXTS.my_profile_btn) {
    if (ctx.user.media.filter(m => !m.isReject).length > 0) {
      const { message_id } = await ctx.reply(TEXTS.view_wait_load_media, { ...BUTTONS.remove_menu, parse_mode: 'MarkdownV2' })
      await sendProfileCard(ctx.user)
      await ctx.deleteMessage(message_id)
    } else {
      await sendProfileCard(ctx.user)
    }

    await ctx.reply(TEXTS.view, BUTTONS.view_menu)
    return
  }
  
  if (text === TEXTS.my_media_btn) {
    const media = await getUserMedia(ctx.user)
    
    if (media.length === 0) {
      await ctx.reply(TEXTS.view_photo_empty, { parse_mode: 'MarkdownV2' })
    } else {
      const preparedMedia = (await Promise.all(media.map(async item => {
        try {
          const prepared = await prepareMediaVariant(
            item,
            item.isApprove ? 'original' : 'blurred',
            { telegram: ctx.telegram }
          )
          return prepared ? { item, prepared } : null
        } catch (error) {
          console.log('profile-view-menu media', error)
          return null
        }
      }))).filter(Boolean)

      if (preparedMedia.length === 0) {
        await ctx.reply(TEXTS.view_photo_empty, { parse_mode: 'MarkdownV2' })
      } else {
        try {
          const mediaData = preparedMedia.map(({ prepared }) => ({
            type: prepared.type,
            media: prepared.media
          }))
          const messages = mediaData.length === 1
            ? [await ctx[mediaData[0].type === 'photo' ? 'replyWithPhoto' : 'replyWithVideo'](mediaData[0].media)]
            : await ctx.replyWithMediaGroup(mediaData)

          await Promise.all(messages.map((message, index) =>
            saveMediaVariantFileId(
              ctx.user,
              preparedMedia[index].item,
              preparedMedia[index].prepared,
              message,
              users
            )
          ))
        } catch (e) {
          console.log(e)
        }

        if (media.find(file => !file.isApprove)) {
          await ctx.reply(TEXTS.view_photo_with_no_approve, { parse_mode: 'MarkdownV2' })
        }
      }
    }
    return
  }

  await replyWithHelp(ctx)
}

export default profileViewMenu
