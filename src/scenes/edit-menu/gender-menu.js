import replyWithHelp from '../../modules/reply-with-help.js'
import { TEXTS, BUTTONS } from '../../assets/ui/ru.js'

const GENDER_BY_BUTTON = new Map([
  [TEXTS.edit_profile_gender_male_btn, 'male'],
  [TEXTS.edit_profile_gender_female_btn, 'female'],
  [TEXTS.edit_profile_gender_unspecified_btn, '']
])

const genderMenu = async (ctx, userStore) => {
  const text = ctx.update?.message?.text || ''

  if (text === TEXTS.back_to_menu_btn) {
    await ctx.reply(TEXTS.edit, BUTTONS.edit_menu)
    await ctx.enterScene('edit-menu')
    return
  }

  if (!GENDER_BY_BUTTON.has(text)) {
    await replyWithHelp(ctx)
    return
  }

  ctx.user.gender = GENDER_BY_BUTTON.get(text)
  await userStore.set(ctx.user.id, { gender: ctx.user.gender })
  await ctx.reply(TEXTS.edit_profile_update, BUTTONS.edit_profile_gender_menu(ctx.user.gender))
}

export default genderMenu
