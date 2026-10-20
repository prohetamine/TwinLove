import replyWithHelp from '../../modules/reply-with-help.js'
import sleep from 'sleep-promise'
import { TEXTS, BUTTONS } from '../../assets/ui/ru.js'

export const normalizeProfileName = value => {
  if (typeof value !== 'string' || /[\r\n]/.test(value)) return ''
  const name = value.trim().replace(/\s+/g, ' ')
  const length = Array.from(name).length
  return length >= 2 && length <= 20 ? name : ''
}

const saveName = async (ctx, userStore, name) => {
  ctx.user.name = name
  await userStore.set(ctx.user.id, { name })
  const { message_id } = await ctx.reply(TEXTS.edit_profile_update, { ...BUTTONS.remove_menu, parse_mode: 'MarkdownV2' })
  await sleep(1000)
  await ctx.deleteMessage(message_id)
  await sleep(500)
  await ctx.reply(TEXTS.edit, BUTTONS.edit_menu)
  await ctx.enterScene('edit-menu')
}

export const nameMenu = async (ctx, userStore) => {
  const text = ctx.update?.message?.text || ''

  if (text === TEXTS.back_to_menu_btn) {
    await ctx.reply(TEXTS.edit, BUTTONS.edit_menu)
    await ctx.enterScene('edit-menu')
    return
  }

  if (text === TEXTS.edit_profile_name_telegram_btn || text === '✈️ Взять из Telegram') {
    const name = normalizeProfileName(ctx.update?.message?.from?.first_name)
    if (!name) {
      await ctx.reply(TEXTS.edit_profile_name_telegram_missing, BUTTONS.edit_profile_name_menu)
      return
    }
    await saveName(ctx, userStore, name)
    return
  }

  if (text === TEXTS.edit_profile_name_manual_btn) {
    await ctx.reply(TEXTS.edit_profile_name_input, BUTTONS.edit_profile_name_input_menu)
    await ctx.enterScene('edit-name-input-menu')
    return
  }

  if (text === TEXTS.edit_profile_name_clear_btn) {
    await ctx.reply(TEXTS.edit_profile_name_required, BUTTONS.edit_profile_name_menu)
    return
  }

  await replyWithHelp(ctx)
}

export const nameInputMenu = async (ctx, userStore) => {
  const text = ctx.update?.message?.text || ''

  if (text === TEXTS.back_to_menu_btn) {
    await ctx.reply(TEXTS.edit_profile_name(ctx.update?.message?.from?.first_name, ctx.user.name), BUTTONS.edit_profile_name_menu)
    await ctx.enterScene('edit-name-menu')
    return
  }

  const name = normalizeProfileName(text)
  if (!name) {
    await ctx.reply(TEXTS.edit_profile_name_invalid, BUTTONS.edit_profile_name_input_menu)
    return
  }

  await saveName(ctx, userStore, name)
}
