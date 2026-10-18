/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import sleep from 'sleep-promise'
import { CHANNEL_ID } from '../../configs/env.js'
import { TEXTS, BUTTONS } from '../assets/ui/ru.js'
import { notifys, posts, users } from '../helpers/db.js'
import checkValid from '../modules/check-valid.js'
import getUserMedia from '../modules/get-user-media.js'
import getUserNotifys from '../modules/get-users-notify.js'
import sendProfileCard from '../modules/send-profile-card.js'
import moment from 'moment'

const profileMenu = async ctx => {
  const text = ctx.update?.message?.text || ''

  if (text === TEXTS.back_to_main_menu_btn) {
    await ctx.reply(TEXTS.home, BUTTONS.main_menu)
    await ctx.enterScene('main-menu')
    return
  }

  if (text === TEXTS.back_to_menu_btn) {
    await ctx.reply(TEXTS.profile(ctx), BUTTONS.profile_menu)
    await ctx.enterScene('profile-menu')
    return
  }

  if (text === TEXTS.edit_profile_btn) {
    await ctx.reply(TEXTS.edit, BUTTONS.edit_menu)
    await ctx.enterScene('edit-menu')
    return
  }

  if (text === TEXTS.view_profile_btn) {
    const isValid = checkValid(ctx)

    if (isValid) {   
      if (ctx.user.media.filter(m => !m.isReject).length > 0) {
        const { message_id } = await ctx.reply(TEXTS.view_wait_load_media, BUTTONS.remove_menu)
        await sendProfileCard(ctx.user)        
        await ctx.deleteMessage(message_id)
      } else {
        await sendProfileCard(ctx.user)
      }

      await ctx.reply(TEXTS.view, BUTTONS.view_menu)
      await ctx.enterScene('profile-view-menu')
    } else {
      await ctx.reply(TEXTS.profile(ctx), BUTTONS.profile_menu)
      await ctx.enterScene('profile-menu')
    }
    return
  }

  if (text === TEXTS.profile_publish_auto_btn) {
    ctx.user.system_publishModerationRequest = true
    await users.set(ctx.user.id, ctx.user)
    await ctx.reply(TEXTS.publish_profile_moderation_request, BUTTONS.profile_menu)
    await ctx.enterScene('profile-menu')
    return
  }

  if (text === TEXTS.pubish_profile_btn || text === TEXTS.profile_publish_confirm_request_btn) {
    const isValid = checkValid(ctx)

    if (isValid) {
      const _24hours = 1000 * 60 * 60 * 48

      if (parseInt(ctx.user.system_lastPostTime) > (Date.now() - _24hours)) {
        const timeout = parseInt(ctx.user.system_lastPostTime) - (Date.now() - _24hours)
        const minutes = moment.duration(parseInt(timeout / (60 * 1000)), 'minute').locale('ru').humanize()
            , textTime = moment.duration(_24hours / 60000, 'minute').locale('ru').humanize()

        await ctx.reply(TEXTS.publish_profile_timeout(minutes, textTime), BUTTONS.profile_menu)
        return
      }

      if (ctx.user.location === '999|666') {
        ctx.user.system_publishModerationRequest = true
        await users.set(ctx.user.id, ctx.user)
        await ctx.reply(TEXTS.publish_profile_moderation_request, BUTTONS.profile_menu)
        await ctx.enterScene('profile-menu')

        const admins = await users.all({ 'system_isAdmin': true })
        
        for (let x = 0; x < admins.length; x++) {
          const adminId = admins[x].id
          await sendProfileCard(ctx.user, adminId, true)
          await sleep(5000)
        }

        return
      }

      if (ctx.user.hidden) {
        await ctx.reply(TEXTS.edit_profile_visibility_stop)
        return
      }

      const { message_id } = await ctx.reply(TEXTS.view_wait_load_media, BUTTONS.remove_menu)
      const media = await getUserMedia(ctx.user)
      await ctx.deleteMessage(message_id)
      
      const isNotApprove = !!media.find(({ isApprove }) => !isApprove)

      if (isNotApprove && text === TEXTS.pubish_profile_btn) {
        await ctx.reply(TEXTS.publish_profile_request, BUTTONS.profile_publish_confirm_request_menu)
        return 
      }

      const messageId = await sendProfileCard(ctx.user, CHANNEL_ID)

      const _posts = await posts.get(ctx.user.id)

      if (ctx.user.autoRemovePrevPost) {
        for (let x = 0; x < _posts.ids.length; x++) {
          try {
            await ctx.telegram.deleteMessage(CHANNEL_ID, _posts.ids[x])
          } catch (e) {}
          _posts.ids = _posts.ids.filter(id => id !== _posts.ids[x]) 
        }
      }

      _posts.ids = [messageId, ..._posts.ids]
      await posts.set(ctx.user.id, _posts)

      const notify = await notifys.get(ctx.user.id)
      notify.ids = await getUserNotifys(ctx.user)
      await notifys.set(ctx.user.id, notify)

      ctx.user.system_publishModerationRequest = false
      ctx.user.system_publishModerationStatus = false
      ctx.user.system_lastPostTime = Date.now() - 0
      await users.set(ctx.user.id, ctx.user)

      await ctx.reply(TEXTS.publish_profile_complete, BUTTONS.profile_menu)
      await ctx.enterScene('profile-menu')
    } else {
      await ctx.reply(TEXTS.profile(ctx), BUTTONS.profile_menu)
      await ctx.enterScene('profile-menu')
    }
    return
  }

  await ctx.reply(TEXTS.help.replace(/\\/gi, ''))
}

export default profileMenu
