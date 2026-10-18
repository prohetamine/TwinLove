// Source of truth for get-city-by-id.js. Run `npm run build:typed` after editing.
import citys from './citys.js';
const getCityById = (_id) => citys.find(({ id }) => id === _id);
export default getCityById;
