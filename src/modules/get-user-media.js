const getUserMedia = async user => user.media.filter(file => !file.isReject)

export default getUserMedia
