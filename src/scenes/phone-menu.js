import { TEXTS, BUTTONS } from '../assets/ui/ru.js'

const savePhoneNumber = async (id, user) => {
  const { User } = await import('../helpers/models.js')
  const result = await User.updateOne({ id }, { $set: { system_phoneNumber: user.system_phoneNumber } })
  if (result.matchedCount !== 1) throw new Error('Cannot save phone number for an unknown user')
  const { users } = await import('../helpers/db.js')
  await users.set(id, user)
}

const phoneMenu = async (ctx, userStore) => {
  const contact = ctx.update?.message?.contact

  if (contact) {
    if (contact.user_id !== ctx.user.id || !contact.phone_number?.trim()) {
      await ctx.reply(TEXTS.phone_other_contact, BUTTONS.phone_menu)
      return
    }

    const phoneNumber = contact.phone_number.trim()
    const store = userStore?.set || savePhoneNumber
    await store(ctx.user.id, { ...ctx.user, system_phoneNumber: phoneNumber })
    ctx.user.system_phoneNumber = phoneNumber
    await ctx.enterScene('main-menu')
    await ctx.reply(TEXTS.home, BUTTONS.main_menu)
    return
  }

  await ctx.reply(TEXTS.phone_request, BUTTONS.phone_menu)
}

export default phoneMenu
