const selectProfileCardMedia = (media, isPreview) => media.filter(item =>
  item.isApprove === true && (isPreview || item.isPeople === true)
)

export default selectProfileCardMedia
