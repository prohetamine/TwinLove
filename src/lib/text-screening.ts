// Source of truth for text-screening.js. Run `npm run build:typed` after editing.
const symbols = ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!']

const textScreening = (text: string): string =>
  text.split('').map(symbol => symbols.includes(symbol) ? `\\${symbol}` : symbol).join('')

export default textScreening
