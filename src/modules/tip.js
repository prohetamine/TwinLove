import { TEXTS, BUTTONS } from '../assets/ui/ru.js'

const tip = async ctx => {
  if (
    !ctx.user.system_tipHidden && 
    Math.random() > 0.9 && 
    (
      ctx.user.scene === 'main-menu' ||
      ctx.user.scene === 'other-menu' ||
      ctx.user.scene === 'profile-menu'
    )
  ) {
    const tip = TEXTS.tips[parseInt(TEXTS.tips.length * Math.random())]
    await ctx.reply(tip, BUTTONS.tips_inline_menu)
  }
}

export default tip