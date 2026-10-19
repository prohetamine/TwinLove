import { TEXTS, BUTTONS } from '../assets/ui/ru.js'
import { users } from '../helpers/db.js'
import textScreening from '../lib/text-screening.js'
import getUserMedia from './get-user-media.js'
import { prepareMediaVariant, saveMediaVariantFileId } from './media-variants.js'
import { CHANNEL_ID } from '../../configs/env.js'
import buildRichProfileCard from './build-rich-profile-card.js'
import sendRichProfileCard, { richPhotoFileIds } from './send-rich-profile-card.js'
import selectProfileCardMedia from './select-profile-card-media.js'

const sendProfileCard = async (user, argId = false, isAdmin = false) => {
  try {
    const isPreview = !argId
    const recipient = argId || user.id
    const media = selectProfileCardMedia(await getUserMedia(user), isPreview)
    const buttons = isAdmin
      ? BUTTONS.profile_generate_moderation_inline(user.id)
      : BUTTONS.profile_generate_inline({
        isPreview,
        isChannel: argId === CHANNEL_ID,
        id: user.system_callHashId
      })

    if (media.length === 0) {
      const adminDetails = isAdmin
        ? `\n\n\\- \\- \\- \\- \\-\nUser data: ${user.system_username ? `_@${textScreening(user.system_username)}_ ` : ''}\\(${user.id}\\)`
        : ''
      const sent = await global.bot.telegram.sendMessage(
        recipient,
        TEXTS.profile_generate(user, isAdmin) + adminDetails,
        buttons
      )
      return sent.message_id
    }

    const preparedMedia = await Promise.all(media.map(item => prepareMediaVariant(
      item,
      user.privacyMedia[0] ? 'privacy' : 'original',
      {
        telegram: global.bot.telegram,
        privacyMedia: user.privacyMedia,
        locationUnknown: user.location === '999|666'
      }
    )))
    if (preparedMedia.some(prepared => !prepared)) {
      throw new Error('Unable to prepare profile media')
    }

    const uploads = []
    const richMedia = preparedMedia.map((prepared, index) => {
      const fileId = typeof prepared.media === 'string'
        ? prepared.media
        : `attach://profile_${index}`
      if (typeof prepared.media !== 'string') {
        uploads.push({ name: `profile_${index}`, source: prepared.media.source })
      }
      return { type: prepared.type, fileId }
    })
    const sent = await sendRichProfileCard({
      telegram: global.bot.telegram,
      chatId: recipient,
      richMessage: buildRichProfileCard(user, richMedia, { isAdmin }),
      replyMarkup: buttons.reply_markup,
      uploads
    })

    const returnedFileIds = richPhotoFileIds(sent)
    for (const [index, prepared] of preparedMedia.entries()) {
      if (!prepared.cacheField || !returnedFileIds[index]) continue
      try {
        await saveMediaVariantFileId(
          user,
          media[index],
          prepared,
          { photo: [{ file_id: returnedFileIds[index] }] },
          users
        )
      } catch (error) {
        console.log('send-profile-card media cache', error)
      }
    }
    return sent.message_id
  } catch (error) {
    console.log('send-profile-card', error)
    return false
  }
}

export default sendProfileCard
