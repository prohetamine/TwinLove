import replyWithHelp from '../modules/reply-with-help.js'
import { TEXTS, BUTTONS } from '../assets/ui/ru.js'

const editMenu = async ctx => {
  const text = ctx.update?.message?.text || ''

  if (text === TEXTS.back_to_menu_btn) {
    await ctx.reply(TEXTS.profile(ctx), BUTTONS.profile_menu)
    await ctx.enterScene('profile-menu')
    return
  }

  if (text === TEXTS.edit_profile_text_btn) {
    await ctx.reply(TEXTS.edit_profile_text, BUTTONS.edit_profile_text_menu)
    await ctx.reply(TEXTS.edit_profile_text_tmp)
    await ctx.enterScene('edit-text-menu')
    return
  }

  if (text === TEXTS.edit_profile_name_btn) {
    await ctx.reply(TEXTS.edit_profile_name(ctx.update?.message?.from?.first_name, ctx.user.name), BUTTONS.edit_profile_name_menu)
    await ctx.enterScene('edit-name-menu')
    return
  }

  if (text === TEXTS.edit_profile_gender_btn) {
    await ctx.reply(TEXTS.edit_profile_gender, BUTTONS.edit_profile_gender_menu(ctx.user.gender))
    await ctx.enterScene('edit-gender-menu')
    return
  }

  if (text === TEXTS.edit_profile_location_btn) {
    await ctx.reply(TEXTS.edit_profile_location, {
      ...BUTTONS.edit_profile_location_menu,
      disable_web_page_preview: true
    })
    await ctx.enterScene('edit-location-menu')
    return
  }

  if (text === TEXTS.edit_profile_media_btn) {
    await ctx.reply(TEXTS.edit_profile_media(5 - ctx.user.media.filter(m => !m.isReject).length), BUTTONS.edit_profile_media_menu)
    await ctx.enterScene('edit-media-menu')
    return
  }

  if (text === TEXTS.edit_profile_contact_btn) {
    const isUsername = !!ctx.update.message.from.username

    await ctx.reply(TEXTS.edit_profile_contact(isUsername), {
      disable_web_page_preview: true,
      ...BUTTONS.edit_profile_contact_menu(isUsername)
    })
    await ctx.enterScene('edit-contact-menu')
    return
  }

  if (text === TEXTS.edit_profile_notification_btn) {
    await ctx.reply(TEXTS.edit_profile_notification, {
      ...BUTTONS.edit_profile_notification_menu(ctx.user.newNotification),
      disable_web_page_preview: true
    })
    await ctx.enterScene('edit-notification-menu')
    return
  }

  if (text === TEXTS.edit_profile_visibility_btn) {
    await ctx.reply(TEXTS.edit_profile_visibility, BUTTONS.edit_profile_visibility_menu(ctx.user.hidden))
    await ctx.enterScene('edit-visibility-menu')
    return
  }

  if (text === TEXTS.edit_profile_autodelete_btn) {
    await ctx.reply(TEXTS.edit_profile_autodelete, BUTTONS.edit_profile_autodelete_menu(ctx.user.autoRemovePrevPost))
    await ctx.enterScene('edit-autodelete-menu')
    return
  }
  
  await replyWithHelp(ctx)
}

export default editMenu
