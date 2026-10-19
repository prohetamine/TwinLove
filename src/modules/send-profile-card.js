/* eslint-disable no-unused-vars */
import { TEXTS, BUTTONS } from '../assets/ui/ru.js'
import { users } from '../helpers/db.js'
import textScreening from '../lib/text-screening.js'
import getUserMedia from './get-user-media.js'
import { prepareMediaVariant, saveMediaVariantFileId } from './media-variants.js'
import { CHANNEL_ID } from '../../configs/env.js'

const sendProfileCard = async (user, argId = false, isAdmin = false) => {
  try {
    let media = await getUserMedia(user)

    media = media.filter(({ isApprove, isPeople }) => isApprove === true && isPeople === true)

    if (media.length === 0) {
      const { message_id } = await global.bot.telegram.sendMessage(
        argId || user.id,
        TEXTS.profile_generate(user, argId !== CHANNEL_ID) + (isAdmin ? `\n\n\\- \\- \\- \\- \\-\nUser data: ${user.system_username ? `_@${textScreening(user.system_username)}_ ` : ``}\\(${user.id}\\)` : ''),
        (
          isAdmin
            ? BUTTONS.profile_generate_moderation_inline(user.id)
            : BUTTONS.profile_generate_inline({ 
                isPreview: argId ? false : true, 
                isChannel: argId === CHANNEL_ID,
                id: user.system_callHashId
              })
        )
      )
      
      return message_id
    } else {
      try {
        const selected = media[parseInt(Math.random() * media.length)]
        const prepared = await prepareMediaVariant(
          selected,
          user.privacyMedia[0] ? 'privacy' : 'original',
          {
            telegram: global.bot.telegram,
            privacyMedia: user.privacyMedia,
            locationUnknown: user.location === '999|666'
          }
        )
        if (!prepared) throw new Error('Unable to prepare profile media')

        const sent = await global.bot.telegram[
          prepared.type === 'photo' ? 'sendPhoto' : 'sendVideo'
        ](
          argId || user.id,
          prepared.media,
          {
          caption: TEXTS.profile_generate(user, argId !== CHANNEL_ID) + (isAdmin ? `\n\n\\- \\- \\- \\- \\-\nUser data: ${user.system_username ? `_@${textScreening(user.system_username)}_ ` : ``}\\(${user.id}\\)` : ''),
          ...(
            isAdmin
              ? BUTTONS.profile_generate_moderation_inline(user.id)
              : BUTTONS.profile_generate_inline({ 
                  isPreview: argId ? false : true, 
                  isChannel: argId === CHANNEL_ID,
                  id: user.system_callHashId
                })
          )
        })

        try {
          await saveMediaVariantFileId(user, selected, prepared, sent, users)
        } catch (error) {
          console.log('send-profile-card media cache', error)
        }

        return sent.message_id
      } catch (e) {
        const { message_id } = await global.bot.telegram.sendMessage(
          argId || user.id,
          TEXTS.profile_generate(user, argId !== CHANNEL_ID) + (isAdmin ? `\n\n\\- \\- \\- \\- \\-\nUser data: ${user.system_username ? `_@${textScreening(user.system_username)}_ ` : ``}\\(${user.id}\\)` : ''),
          (
            isAdmin
              ? BUTTONS.profile_generate_moderation_inline(user.id)
              : BUTTONS.profile_generate_inline({ 
                  isPreview: argId ? false : true, 
                  isChannel: argId === CHANNEL_ID,
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
