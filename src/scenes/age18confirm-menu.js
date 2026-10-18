import { users } from '../helpers/db.js'
import { TEXTS, BUTTONS } from '../assets/ui/ru.js'
import sleep from 'sleep-promise'

const age18confirmMenu = async ctx => {
  const text = ctx.update?.message?.text || ''

  if (text === TEXTS.back_to_main_menu_btn) {
    await ctx.reply(TEXTS.home, BUTTONS.main_menu)
    await ctx.enterScene('main-menu')
    return
  }

  if (text === TEXTS.age18Confirm_btn_1) {
    const { message_id } = await ctx.reply(TEXTS.edit_profile_update, BUTTONS.remove_menu)

    await sleep(1000)
    await ctx.deleteMessage(message_id)
    await sleep(500)

    ctx.user.system_age18Confirm = false
    ctx.user.system_block_message = TEXTS.banned_rule_age
    ctx.user.system_block_status = true
    ctx.user.system_block_auto = true
    await users.set(ctx.user.id, ctx.user)

    await ctx.reply(TEXTS.home, BUTTONS.main_menu)
    await ctx.enterScene('main-menu')
    return
  }

  if (text === TEXTS.age18Confirm_btn_2) {
    const { message_id } = await ctx.reply(TEXTS.edit_profile_update, BUTTONS.remove_menu)

    await sleep(1000)
    await ctx.deleteMessage(message_id)
    await sleep(500)

    ctx.user.system_age18Confirm = true
    await users.set(ctx.user.id, ctx.user)

    await ctx.reply(TEXTS.home, BUTTONS.main_menu)
    await ctx.enterScene('main-menu')
    return
  }

  await ctx.reply(TEXTS.age18Confirm, BUTTONS.age18Confirm_menu)
}

export default age18confirmMenu