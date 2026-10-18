import replyWithHelp from '../../modules/reply-with-help.js'
import { users } from '../../helpers/db.js'
import { TEXTS, BUTTONS } from '../../assets/ui/ru.js'

const notificationMenu = async ctx => {
  const text = ctx.update?.message?.text || ''

  if (text === TEXTS.back_to_menu_btn) {
    await ctx.reply(TEXTS.edit, BUTTONS.edit_menu)
    await ctx.enterScene('edit-menu')
    return
  }

  if (text) {
    const findIndex = [
      TEXTS.edit_profile_notification_btn_1(-1),
      TEXTS.edit_profile_notification_btn_2(-1),
      TEXTS.edit_profile_notification_btn_3(-1),
      TEXTS.edit_profile_notification_btn_4(-1)
    ].findIndex(btn => text === btn)

    if (findIndex !== -1) {
      ctx.user.newNotification = findIndex
    
      await users.set(ctx.user.id, ctx.user)

      await ctx.reply(TEXTS.edit_profile_update, {
        ...BUTTONS.edit_profile_notification_menu(ctx.user.newNotification),
        disable_web_page_preview: true
      })
      return
    }
  }

  await replyWithHelp(ctx)
}

export default notificationMenu
