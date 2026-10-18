import { nanoid } from 'nanoid'

const createImportId = () => nanoid(24).replace(/(_|-)/gi, 'O')

export default createImportId