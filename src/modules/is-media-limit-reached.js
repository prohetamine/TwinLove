const isMediaLimitReached = media => media.filter(item => !item.isReject).length >= 5

export default isMediaLimitReached
