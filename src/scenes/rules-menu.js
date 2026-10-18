import { TEXTS, BUTTONS } from '../assets/ui/ru.js'
import sleep from 'sleep-promise'

const rulesMenu = async ctx => {
  const text = ctx.update?.message?.text || ''

  if (text === TEXTS.back_to_main_menu_btn) {
    await ctx.enterScene('main-menu')
    await ctx.reply(TEXTS.home, BUTTONS.main_menu)
    return
  }

  if (text === TEXTS.rules_confirm_btn) {
    ctx.user.system_rulesConfirm = true
    await ctx.enterScene('main-menu')
    await ctx.reply(TEXTS.home, BUTTONS.main_menu)
    return
  }

  if (text === TEXTS.rules_no_confirm_btn) {
    const { message_id } = await ctx.reply(TEXTS.edit_profile_update, BUTTONS.remove_menu)

    await sleep(1000)
    await ctx.deleteMessage(message_id)
    await sleep(500)

    ctx.user.system_rulesConfirm = false
    await ctx.enterScene('main-menu')
    await ctx.reply(TEXTS.home, BUTTONS.main_menu)
    return
  }

  await ctx.reply(TEXTS.rules, {
    ...BUTTONS.rules_menu,
    disable_web_page_preview: true
  })
}

export default rulesMenu
