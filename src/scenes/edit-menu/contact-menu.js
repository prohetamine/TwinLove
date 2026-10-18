import replyWithHelp from '../../modules/reply-with-help.js'
import { users } from '../../helpers/db.js'
import { TEXTS, BUTTONS } from '../../assets/ui/ru.js'

const contactMenu = async ctx => {
  const text = ctx.update?.message?.text || ''

  if (text === TEXTS.back_to_menu_btn) {
    await ctx.reply(TEXTS.edit, BUTTONS.edit_menu)
    await ctx.enterScene('edit-menu')
    return
  }

  if (text === TEXTS.edit_profile_contact_confirm_btn) {
    const isUsername = !!ctx.update.message.from.username

    await ctx.reply(isUsername ? TEXTS.edit_profile_contact(isUsername) : TEXTS.edit_profile_contact_error, {
      disable_web_page_preview: true,
      ...BUTTONS.edit_profile_contact_menu(isUsername)
    })
    return
  }

  if (text === TEXTS.edit_profile_privacy_btn) {
    await ctx.reply(TEXTS.edit_profile_contact_privacy, BUTTONS.edit_profile_contact_privacy_menu(ctx.user.privacyCity))
    return
  }

  if (text) {
    const findIndex = [
      TEXTS.edit_profile_contact_privacy_btn_1(-1),
      TEXTS.edit_profile_contact_privacy_btn_2(-1),
      TEXTS.edit_profile_contact_privacy_btn_3(-1)
    ].findIndex(btn => text.replace(/ — ✅/, '') === btn.replace(/ — ✅/, ''))

    if (findIndex !== -1) {
      ctx.user.privacyCity = findIndex
    
      await users.set(ctx.user.id, ctx.user)

      const isUsername = !!ctx.update.message.from.username

      await ctx.reply(TEXTS.edit_profile_update, {
        disable_web_page_preview: true,
        ...BUTTONS.edit_profile_contact_menu(isUsername)
      })
      return
    }
  }
  
  await replyWithHelp(ctx)
}

export default contactMenu
