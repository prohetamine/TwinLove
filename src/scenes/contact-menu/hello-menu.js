import replyWithHelp from '../../modules/reply-with-help.js'
import { TEXTS, BUTTONS } from '../../assets/ui/ru.js'
import { invites, invitesLike, posts, users } from '../../helpers/db.js'

const helloMenu = async ctx => {
  const text = ctx.update?.message?.text || ''

  if (text === TEXTS.back_to_main_menu_btn) {
    await ctx.reply(TEXTS.home, BUTTONS.main_menu)
    await ctx.enterScene('main-menu')
    return
  } 

  if (text === TEXTS.long_hello_btn) {
    const [_user = false] = await users.all({ system_callHashId: ctx.user.system_selectCallHashId })

    let user = _user

    if (!user) {
      const [_user = false] = await users.all({ id: parseInt(ctx.user.system_selectCallHashId) || -1 })
      user = _user
    }

    const _posts = await posts.get(ctx.user.id)

    if (_posts.ids.length > 0) {
      if (user) {
        const invite = await invites.get(ctx.user.id)
  
        if (user.system_block_status) {
          await ctx.reply(TEXTS.hello_error, BUTTONS.contact_hello_menu)        
          return
        } 

        if (user.hidden) {
          await ctx.reply(TEXTS.hello_hidden, BUTTONS.contact_hello_menu)        
          return
        }

        if (invite.ids.find(id => user.id === id)) {
          await ctx.reply(TEXTS.hello_hand_used, BUTTONS.contact_hello_menu)
        } else {
          invite.ids.push(user.id)
          await ctx.reply(TEXTS.hello_hand_confirmed, BUTTONS.contact_hello_menu)
          try {
            await ctx.telegram.sendMessage(user.id, TEXTS.hello_hand, BUTTONS.show_in_channel(_posts.ids[0]))
          } catch (e) {
            console.log(e)
          }
          await invites.set(ctx.user.id, invite)
        }
        return
      }
    } else {
      delete _posts.ids[0]
      _posts.ids = _posts.ids.filter(id => id)
      await posts.set(ctx.user.id, _posts)

      await ctx.reply(TEXTS.error_profile_notfound, BUTTONS.contact_hello_menu)
      return
    }

    await ctx.reply(TEXTS.home, BUTTONS.main_menu)
    await ctx.enterScene('main-menu')
    return
  }

  if (text === TEXTS.like_btn) {
    const [_user = false] = await users.all({ system_callHashId: ctx.user.system_selectCallHashId })

    let user = _user

    if (!user) {
      const [_user = false] = await users.all({ id: parseInt(ctx.user.system_selectCallHashId) || -1 })
      user = _user
    }

    const _posts = await posts.get(ctx.user.id)

    if (_posts.ids.length > 0) {
      if (user) {
        const invite = await invitesLike.get(ctx.user.id)
  
        if (user.system_block_status) {
          await ctx.reply(TEXTS.hello_like_error, BUTTONS.contact_hello_menu)        
          return
        } 

        if (user.hidden) {
          await ctx.reply(TEXTS.hello_like_hidden, BUTTONS.contact_hello_menu)        
          return
        }

        if (invite.ids.find(id => user.id === id)) {
          await ctx.reply(TEXTS.hello_like_used, BUTTONS.contact_hello_menu)
        } else {
          invite.ids.push(user.id)
          await ctx.reply(TEXTS.hello_like_confirmed, BUTTONS.contact_hello_menu)
          try {
            await ctx.telegram.sendMessage(user.id, TEXTS.hello_like, BUTTONS.show_in_channel(_posts.ids[0]))
          } catch (e) {
            console.log(e)
          }
          await invitesLike.set(ctx.user.id, invite)
        }
        return
      }
    } else {
      delete _posts.ids[0]
      _posts.ids = _posts.ids.filter(id => id)
      await posts.set(ctx.user.id, _posts)

      await ctx.reply(TEXTS.error_profile_notfound, BUTTONS.contact_hello_menu)
      return
    }

    await ctx.reply(TEXTS.home, BUTTONS.main_menu)
    await ctx.enterScene('main-menu')
    return
  }
  
  await replyWithHelp(ctx)
}

export default helloMenu