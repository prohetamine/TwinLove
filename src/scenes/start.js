import { TEXTS, BUTTONS } from './../assets/ui/ru.js'

const start = async ctx => {
  await ctx.reply(TEXTS.hello, BUTTONS.main_menu)
  await ctx.enterScene('main-menu')
}

export default start
