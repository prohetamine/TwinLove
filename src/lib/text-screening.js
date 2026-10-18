const symbols = ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!']

const textScreening = text => 
  text.split('').map(s => symbols.includes(s) ? `\\${s}` : s).join('')

export default textScreening