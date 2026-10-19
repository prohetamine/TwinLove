import createBlurMediaPreview from '../lib/create-blur-media-preview.js'
import privacyMediaPreview from '../lib/privacy-media-preview.js'

const photoFileId = message => message?.photo?.at(-1)?.file_id

export const prepareMediaVariant = async (media, variant, {
  telegram,
  privacyMedia = [0, 0, 0],
  locationUnknown = false,
  createBlur = createBlurMediaPreview,
  createPrivacy = privacyMediaPreview
}) => {
  if (!['original', 'blurred', 'privacy'].includes(variant)) {
    throw new Error('Unknown media variant')
  }
  if (variant === 'original') {
    return { type: media.isPhoto ? 'photo' : 'video', media: media.fileId }
  }

  if (variant === 'blurred' && media.bluredFileId) {
    return { type: 'photo', media: media.bluredFileId }
  }

  const privacyHash = privacyMedia.join('') + '-' + (locationUnknown ? 1 : 0)
  if (variant === 'privacy' && media.bluredPrivacyFileId && media.privacyHash === privacyHash) {
    return { type: 'photo', media: media.bluredPrivacyFileId }
  }

  const blurSource = media.bluredFileId && variant === 'privacy'
    ? (await telegram.getFileLink(media.bluredFileId)).href
    : await createBlur((await telegram.getFileLink(media.fileId)).href)

  if (!blurSource) return null
  if (variant === 'blurred') {
    return { type: 'photo', media: { source: blurSource }, cacheField: 'bluredFileId' }
  }
  const preview = await createPrivacy(blurSource, privacyMedia, locationUnknown)
  if (!preview) return null
  return {
    type: 'photo',
    media: { source: preview },
    cacheField: 'bluredPrivacyFileId',
    privacyHash
  }
}

export const saveMediaVariantFileId = async (user, media, prepared, message, userStore) => {
  if (!prepared.cacheField) return
  const fileId = photoFileId(message)
  if (!fileId) throw new Error('Telegram did not return a photo file_id')

  const currentUser = await userStore.get(user.id)
  const currentMedia = currentUser?.media?.find(item => item.id === media.id)
  if (!currentMedia) return

  currentMedia[prepared.cacheField] = fileId
  if (prepared.privacyHash) currentMedia.privacyHash = prepared.privacyHash
  const localMedia = user.media?.find(item => item.id === media.id)
  if (localMedia && localMedia !== currentMedia) {
    localMedia[prepared.cacheField] = fileId
    if (prepared.privacyHash) localMedia.privacyHash = prepared.privacyHash
  }
  await userStore.set(user.id, { media: currentUser.media })
}
