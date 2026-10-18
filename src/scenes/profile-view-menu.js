import replyWithHelp from '../modules/reply-with-help.js'
import { TEXTS, BUTTONS } from '../assets/ui/ru.js'
import getUserMedia from '../modules/get-user-media.js'
import sendProfileCard from '../modules/send-profile-card.js'

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
      await ctx.reply(TEXTS.view_photo_empty)
    } else {
      const mediaData = media.map(({ fileId, blured, bluredFileId, isPhoto, isApprove }) => {
        return ({
          type: isApprove
                  ? isPhoto 
                          ? 'photo' 
                          : 'video'
                  : 'photo',
          media: (isApprove ? fileId : bluredFileId) || { source: blured }
        })
      }).filter(m => typeof(m.media) === 'string' ? m.media : m.media.source)

      if (mediaData.length === 0) {
        await ctx.reply(TEXTS.view_photo_empty)
      } else {
        try {
          await ctx.replyWithMediaGroup(mediaData)
        } catch (e) {
          console.log(e)
        }

        if (media.find(file => !file.isApprove)) {
          await ctx.reply(TEXTS.view_photo_with_no_approve)
        }
      }
    }
    return
  }

  await replyWithHelp(ctx)
}

export default profileViewMenu
