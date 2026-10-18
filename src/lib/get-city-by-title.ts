// Source of truth for get-city-by-title.js. Run `npm run build:typed` after editing.
import citys, { type City } from './citys.js'

const getCityByTitle = (_title: string): City | undefined =>
  citys.find(({ pureTitle }) => {
    return pureTitle.trim().toLowerCase() === _title.trim().toLowerCase()
  })

export default getCityByTitle
