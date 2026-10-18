import replyWithHelp from '../../modules/reply-with-help.js'
import { TEXTS, BUTTONS } from '../../assets/ui/ru.js'
import { users, posts } from '../../helpers/db.js'

const writeMenu = async ctx => {
  const text = ctx.update?.message?.text || ''
  const isContactButton = text === TEXTS.contact_btn
  const isMediaButton = text === TEXTS.media_btn

  if (text === TEXTS.back_to_main_menu_btn) {
    await ctx.reply(TEXTS.home, BUTTONS.main_menu)
    await ctx.enterScene('main-menu')
    return
  } 

  if (isContactButton || isMediaButton) {
    const [_user = false] = await users.all({ system_callHashId: ctx.user.system_selectCallHashId })

    let user = _user

    if (!user) {
      const [_user = false] = await users.all({ id: parseInt(ctx.user.system_selectCallHashId) || -1 })
      user = _user
    }

    const _posts = await posts.get(ctx.user.id)

    if (_posts.ids.length > 0) {
      if (user) {
        if (user.system_block_status) {
          await ctx.reply(TEXTS[isContactButton ? 'contact_error' : 'media_error'], BUTTONS.contact_write_menu)
          return
        } 

        if (user.hidden) {
          await ctx.reply(TEXTS[isContactButton ? 'contact_hidden' : 'media_hidden'], BUTTONS.contact_write_menu)
          return
        }

        if (isContactButton) {
          if (
            user.privacyCity !== 0 &&
            (
              user.privacyCity === 1 
              ? !user.nighLocations.find(location => ctx.user.location === location)
              : user.location !== ctx.user.location
            )
          ) {
            await ctx.reply(TEXTS.contact_error_privacy(user.privacyCity), BUTTONS.contact_write_menu)     
            return
          }

          await ctx.reply(TEXTS.contact(user.id, user.system_username), BUTTONS.contact_write_menu)
        }

        if (isMediaButton) {
          if (user.privacyMedia[0] === 1) {
            if ((user.privacyMedia[1] && user.location !== '999|666') || user.privacyMedia[2]) {
              const isCity = user.location === ctx.user.location
                  , isApproveMedia = ctx.user.media.filter(m => !m.isReject && m.isApprove && m.isPeople).length > 0

              if (
                ((user.privacyMedia[1] && user.location !== '999|666') && !isCity) ||
                (user.privacyMedia[2] && !isApproveMedia)
              ) {
                await ctx.reply(TEXTS.media_error_privacy((user.privacyMedia[1] && !isCity), (user.privacyMedia[2] && !isApproveMedia)), BUTTONS.contact_write_menu)
                return
              }
            }
          }

          const isApproveMedia = user.media.filter(m => !m.isReject && m.isApprove)

          if (isApproveMedia.length === 0) {
            await ctx.reply(TEXTS.media_empty, BUTTONS.contact_write_menu)
          } else {
            try {
              await ctx.replyWithMediaGroup(isApproveMedia.map(({ fileId, isPhoto }) => {
                return ({
                  type: isPhoto 
                          ? 'photo' 
                          : 'video',
                  media: fileId 
                })
              }), BUTTONS.contact_write_menu)
            } catch (e) {
              await ctx.reply(TEXTS.media_empty, BUTTONS.contact_write_menu)
              console.log(e)
            }
          }
        }

        return
      }
    } else {
      delete _posts.ids[0]
      _posts.ids = _posts.ids.filter(id => id)
      await posts.set(ctx.user.id, _posts)

      await ctx.reply(TEXTS.error_profile_notfound, BUTTONS.contact_write_menu)
      return
    }

    await ctx.reply(TEXTS.home, BUTTONS.main_menu)
    await ctx.enterScene('main-menu')
    return
  }

  await replyWithHelp(ctx)
}

export default writeMenu
