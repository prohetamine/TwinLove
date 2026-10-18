import sleep from 'sleep-promise'
import { users } from '../../helpers/db.js'
import { MEDIA, TEXTS, BUTTONS } from '../../assets/ui/ru.js'
import getCityIdByLocation from '../../lib/get-city-id-by-location.js'
import getCityById from '../../lib/get-city-by-id.js'
import getCityByTitle from '../../lib/get-city-by-title.js'

const locationMenu = async ctx => {
  const text = ctx.update?.message?.text || ''
      , location = ctx.update?.message?.location || ''

  if (text === TEXTS.back_to_menu_btn) {
    await ctx.reply(TEXTS.edit, BUTTONS.edit_menu)
    await ctx.enterScene('edit-menu')
    return
  }

  if (text === TEXTS.edit_profile_location_btn_2) {
    await ctx.reply(TEXTS.edit_profile_location_anon, {
      ...BUTTONS.edit_profile_location_anon_menu,
      disable_web_page_preview: true
    })
    return
  }

  if (text === TEXTS.edit_profile_location_btn_3) {
    ctx.user.location = '999|666'
    await users.set(ctx.user.id, ctx.user)

    const { message_id } = await ctx.reply(TEXTS.edit_profile_update, BUTTONS.remove_menu)

    await sleep(1000)
    await ctx.deleteMessage(message_id)
    await sleep(500)

    await ctx.reply(TEXTS.edit, BUTTONS.edit_menu)
    await ctx.enterScene('edit-menu')
    return
  }

  if (location) {
    const citys = getCityIdByLocation(location, 5).map(cityId => getCityById(cityId))
    ctx.user.nighLocations = citys.map(city => city.id)
    await users.set(ctx.user.id, ctx.user)
    await ctx.reply(TEXTS.edit_profile_location_city, BUTTONS.edit_profile_location_city_menu(citys.map(city => `г. ${city.pureTitle}`)))
    return
  }

  if (text) {
    const city = ctx.user.nighLocations.find(id => id === getCityByTitle(text.replace(/(г. |📍)/gi, ''))?.id)

    if (city) {
      ctx.user.location = city
      await users.set(ctx.user.id, ctx.user)

      const { message_id } = await ctx.reply(TEXTS.edit_profile_update, BUTTONS.remove_menu)

      await sleep(1000)
      await ctx.deleteMessage(message_id)
      await sleep(500)

      await ctx.reply(TEXTS.edit, BUTTONS.edit_menu)
      await ctx.enterScene('edit-menu')
      return
    }
  }

  await ctx.replyWithPhoto(MEDIA.help, {
    caption: TEXTS.help.replace(/\\/gi, ''),
  })
}

export default locationMenu
