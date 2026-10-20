import replyWithHelp from '../../modules/reply-with-help.js'
import sleep from 'sleep-promise'
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
  const { message_id } = await ctx.reply(TEXTS.edit_profile_update, { ...BUTTONS.remove_menu, parse_mode: 'MarkdownV2' })
  await sleep(1000)
  await ctx.deleteMessage(message_id)
  await sleep(500)
  await ctx.reply(TEXTS.edit, BUTTONS.edit_menu)
  await ctx.enterScene('edit-menu')
}

export default genderMenu
