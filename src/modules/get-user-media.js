import { medias } from '../helpers/db.js'
import createBlurMediaPreview from '../lib/create-blur-media-preview.js'
import privacyMediaPreview from '../lib/privacy-media-preview.js'

const getUserMedia = async user => {
  try {
    const _medias = user.media
                      .filter(file => !file.isReject)
                      
    const mediaIds = _medias.map(m => m.id)

    const newMedias = []

    for (let x = 0; x < mediaIds.length; x++) {
      const media = await medias.get(user.media[x].id)
      
      if (!media.bluredFileId && (media.blured === undefined || media.blured?.length === 0)) {
        const { href } = await global.bot.telegram.getFileLink(_medias[x].fileId)
        
        const blured = await createBlurMediaPreview(href)

        if (blured) {
          media.blured = blured
        }
        
        await medias.set(media.id, media)
      }

      if (media.bluredFileId) {
        if ((!media.bluredPrivacyFileId || media.privacyHash !== (user.privacyMedia.join('') + '-' + (user.location === '999|666' ? 1 : 0))) && (media.bluredPrivacy === undefined || media.bluredPrivacy?.length === 0)) {
          media.privacyHash = user.privacyMedia.join('') + '-' + (user.location === '999|666' ? 1 : 0)
          media.bluredPrivacyFileId = ''
          const { href } = await global.bot.telegram.getFileLink(media.bluredFileId)
          
          const bluredPrivacy = await privacyMediaPreview(href, user.privacyMedia, user.location === '999|666')

          if (bluredPrivacy) {
            media.bluredPrivacy = bluredPrivacy
          }
        }
      } else {
        if (!(media.blured === undefined || media.blured?.length === 0)) {
          if ((!media.bluredPrivacyFileId || media.privacyHash !== (user.privacyMedia.join('') + '-' + (user.location === '999|666' ? 1 : 0))) && (media.bluredPrivacy === undefined || media.bluredPrivacy?.length === 0)) {
            media.privacyHash = user.privacyMedia.join('') + '-' + (user.location === '999|666' ? 1 : 0)
            media.bluredPrivacyFileId = ''

            const bluredPrivacy = await privacyMediaPreview(media.blured, user.privacyMedia, user.location === '999|666')

            if (bluredPrivacy) {
              media.bluredPrivacy = bluredPrivacy
            }
          }
        }
      }

      await medias.set(media.id, media)

      newMedias.push({
        ..._medias[x],
        ...media
      })
    }

    return newMedias 
  } catch (e) {
    console.log(e)
    return []
  }
}

export default getUserMedia