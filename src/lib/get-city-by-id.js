import citys from './citys.js'

const getCityById = _id => 
  citys.find(({ id }) => id === _id)

export default getCityById