// Source of truth for create-import-id.js. Run `npm run build:typed` after editing.
import { nanoid } from 'nanoid'

const createImportId = (): string => nanoid(24).replace(/(_|-)/gi, 'O')

export default createImportId
