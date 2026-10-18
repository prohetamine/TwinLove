import citys from './citys.js'

const RADIAN = Math.PI / 180.0
const RADIUS = 6371
const DIAMETER = 2 * RADIUS

const toRadians = (degrees) => {
    return RADIAN * degrees
}

const calculateDistance$1 = (a, b) => {
	const dLat = b.latitude - a.latitude
	const dLon = b.longitude - a.longitude
  	const aTmp = Math.sin(0.5 * dLat)
  	const bTmp = Math.sin(0.5 * dLon)
	const cTmp = aTmp * aTmp + bTmp * bTmp * Math.cos(a.latitude) * Math.cos(b.latitude)
	return DIAMETER * Math.atan2(Math.sqrt(cTmp), Math.sqrt(1.0 - cTmp))
}

const calculateDistance$2 = (a, b) => {
  	const aTmp = { latitude: toRadians(a.latitude), longitude: toRadians(a.longitude) }
  	const bTmp = { latitude: toRadians(b.latitude), longitude: toRadians(b.longitude) }
  	return calculateDistance$1(aTmp, bTmp)
}

const getCityIdByLocation = (location, count = 5) => {
  const { latitude, longitude } = location
  
  const _citys = citys.sort(
                      (a, b) => 
                        calculateDistance$2({ latitude: a.latitude, longitude: a.longitude }, { latitude, longitude }) - 
                        calculateDistance$2({ latitude: b.latitude, longitude: b.longitude }, { latitude, longitude })
                    )
                    .slice(0, 10)
                    .sort((b, a) => a.population - b.population)
                    .map(({ id }) => id)
                    .slice(0, count)

  return _citys.length === 0 ? [9999999999] : _citys 
}

export default getCityIdByLocation