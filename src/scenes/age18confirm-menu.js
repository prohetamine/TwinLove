import { TEXTS, BUTTONS } from '../assets/ui/ru.js'
import sleep from 'sleep-promise'

const age18confirmMenu = async ctx => {
  const text = ctx.update?.message?.text || ''

  if (text === TEXTS.back_to_main_menu_btn) {
    await ctx.enterScene('main-menu')
    await ctx.reply(TEXTS.home, BUTTONS.main_menu)
    return
  }

  if (text === TEXTS.age18Confirm_btn_1) {
    const { message_id } = await ctx.reply(TEXTS.edit_profile_update, { ...BUTTONS.remove_menu, parse_mode: 'MarkdownV2' })

    await sleep(1000)
    await ctx.deleteMessage(message_id)
    await sleep(500)

    ctx.user.system_age18Confirm = false
    ctx.user.system_block_message = TEXTS.banned_rule_age
    ctx.user.system_block_status = true
    ctx.user.system_block_auto = true
    await ctx.enterScene('main-menu')
    await ctx.reply(TEXTS.home, BUTTONS.main_menu)
    return
  }

  if (text === TEXTS.age18Confirm_btn_2) {
    ctx.user.system_age18Confirm = true

    if (ctx.user.system_rulesConfirm) {
      await ctx.enterScene('main-menu')
      await ctx.reply(TEXTS.home, BUTTONS.main_menu)
    } else {
      await ctx.enterScene('rules-menu')
      await ctx.reply(TEXTS.rules, {
        ...BUTTONS.rules_menu,
        disable_web_page_preview: true
      })
    }
    return
  }

  await ctx.reply(TEXTS.age18Confirm, BUTTONS.age18Confirm_menu)
}

export default age18confirmMenu
