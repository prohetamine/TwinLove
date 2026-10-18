import { users } from '../../helpers/db.js'
import { MEDIA, TEXTS, BUTTONS } from '../../assets/ui/ru.js'

const visibilityMenu = async ctx => {
  const text = ctx.update?.message?.text || ''

  if (text === TEXTS.back_to_menu_btn) {
    await ctx.reply(TEXTS.edit, BUTTONS.edit_menu)
    await ctx.enterScene('edit-menu')
    return
  }

  if (text) {
    const findIndex = [
      TEXTS.edit_profile_visibility_btn_1(-1),
      TEXTS.edit_profile_visibility_btn_2(-1),
    ].findIndex(btn => text.replace(/ — ✅/, '') === btn.replace(/ — ✅/, ''))

    if (findIndex !== -1) {
      ctx.user.hidden = findIndex !== 0
      await users.set(ctx.user.id, ctx.user)
      await ctx.reply(TEXTS.edit_profile_update, BUTTONS.edit_profile_visibility_menu(ctx.user.hidden))
      return
    }
  }

  await ctx.replyWithPhoto(MEDIA.help, {
    caption: TEXTS.help.replace(/\\/gi, ''),
  })
}

export default visibilityMenu
