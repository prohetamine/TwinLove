import citys from './citys.js'

const getCityByTitle = _title => 
  citys.find(({ pureTitle }) => {
    return pureTitle.trim().toLowerCase() === _title.trim().toLowerCase()
  })

export default getCityByTitle