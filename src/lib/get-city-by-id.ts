// Source of truth for get-city-by-id.js. Run `npm run build:typed` after editing.
import citys, { type City } from './citys.js'

const getCityById = (_id: string): City | undefined =>
  citys.find(({ id }) => id === _id)

export default getCityById
