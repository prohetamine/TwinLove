/* eslint-disable no-unused-vars */
import { TEXTS, BUTTONS } from '../assets/ui/ru.js'
import { medias, users } from '../helpers/db.js'
import textScreening from '../lib/text-screening.js'
import getUserMedia from './get-user-media.js'
import { CHANNEL_ID } from '../../configs/env.js'

const sendProfileCard = async (user, argId = false, isAdmin = false) => {
  try {
    let media = await getUserMedia(user)

    media = media.filter(({ isApprove, isPeople }) => isApprove === true && isPeople === true)
    await users.set(user.id, user)

    if (media.length === 0) {
      const { message_id } = await global.bot.telegram.sendMessage(
        argId || user.id,
        TEXTS.profile_generate(user, argId !== CHANNEL_ID) + (isAdmin ? `\n\n\\- \\- \\- \\- \\-\nUser data: ${user.system_username ? `_@${textScreening(user.system_username)}_ ` : ``}\\(${user.id}\\)` : ''),
        (
          isAdmin
            ? BUTTONS.profile_generate_moderation_inline(user.id)
            : BUTTONS.profile_generate_inline({ 
                isPreview: argId ? false : true, 
                id: user.system_callHashId
              })
        )
      )
      
      return message_id
    } else {
      try {
        const { isPhoto, isApprove, fileId, bluredFileId, blured, bluredPrivacy, bluredPrivacyFileId, id } = media[parseInt(Math.random() * media.length)]

        const file = user.privacyMedia[0] 
                      ? bluredPrivacyFileId || { source: bluredPrivacy }
                      : isApprove 
                          ? fileId
                          : bluredFileId || { source: blured }

        const { photo, video, message_id } = await global.bot.telegram[
          isApprove
            ? user.privacyMedia[0] 
                ? 'sendPhoto'
                : isPhoto 
                    ? 'sendPhoto' 
                    : 'sendVideo'
            : 'sendPhoto'
        ](
          argId || user.id,
          file, 
          {
          caption: TEXTS.profile_generate(user, argId !== CHANNEL_ID) + (isAdmin ? `\n\n\\- \\- \\- \\- \\-\nUser data: ${user.system_username ? `_@${textScreening(user.system_username)}_ ` : ``}\\(${user.id}\\)` : ''),
          ...(
            isAdmin
              ? BUTTONS.profile_generate_moderation_inline(user.id)
              : BUTTONS.profile_generate_inline({ 
                  isPreview: argId ? false : true, 
                  id: user.system_callHashId
                })
          )
        })

        if (video || photo) {
          const { file_id } = video || photo.pop()

          const media = await medias.get(id)

          if (user.privacyMedia[0]) {
            if (!bluredPrivacyFileId) {
              media.bluredPrivacyFileId = file_id
              media.bluredPrivacy = []
            }
          } else {
            if (!isApprove) {
              if (!bluredFileId) {
                media.bluredFileId = file_id
                media.blured = []
              }
            }
          }

          await medias.set(id, media)
        }

        return message_id
      } catch (e) {
        const { message_id } = await global.bot.telegram.sendMessage(
          argId || user.id,
          TEXTS.profile_generate(user, argId !== CHANNEL_ID) + (isAdmin ? `\n\n\\- \\- \\- \\- \\-\nUser data: ${user.system_username ? `_@${textScreening(user.system_username)}_ ` : ``}\\(${user.id}\\)` : ''),
          (
            isAdmin
              ? BUTTONS.profile_generate_moderation_inline(user.id)
              : BUTTONS.profile_generate_inline({ 
                  isPreview: argId ? false : true, 
                  id: user.system_callHashId
                })
          )
        )
        
        return message_id
      } 
    }
  } catch (e) {
    console.log(e)
    return false
  }
}

export default sendProfileCard
