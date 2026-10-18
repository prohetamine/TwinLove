import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
    , __dirname = dirname(__filename)

const citys = Object.values(
  fs.readFileSync(join(__dirname, '../assets/citys.txt'), 'utf8')
    .match(/.+/gi)
    .map(line => JSON.parse(line))
    .map(line => ({
      id: line.countryId + '|' + line.cityId,
      title: `г. ${line.cityRu || line.city}`,
      pureTitle: `${line.cityRu || line.city}`,
      hash: (line.cityRu || line.city).replace(/(\.|`|\/|_|-| |'|\?)/gi, '_').toLowerCase().split('_').join('_').trim(),
      latitude: line.lat,
      longitude: line.lon,
      population: line.population,
      flag: line.flag
    }))
    .reduce((ctx, elem) => {
      ctx[elem.title] = elem
      return ctx
    }, {})
)

export default citys