/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import replyWithHelp from '../modules/reply-with-help.js'
import sleep from 'sleep-promise'
import { CHANNEL_ID } from '../../configs/env.js'
import { TEXTS, BUTTONS } from '../assets/ui/ru.js'
import { notifys, posts, users } from '../helpers/db.js'
import checkValid from '../modules/check-valid.js'
import getUserMedia from '../modules/get-user-media.js'
import getUserNotifys from '../modules/get-users-notify.js'
import sendProfileCard from '../modules/send-profile-card.js'
import moment from 'moment'
import getPublicationCooldownRemaining, { PUBLICATION_COOLDOWN_MS } from '../modules/get-publication-cooldown-remaining.js'

const profileMenu = async ctx => {
  const text = ctx.update?.message?.text || ''
  const isPublishButton = text === TEXTS.pubish_profile_btn || text === 'Опубликовать ⬆️'
  const isPublishConfirmButton = text === TEXTS.profile_publish_confirm_request_btn || text === 'Все равно опубликовать ⬆️'
  const isAutoPublishButton = text === TEXTS.profile_publish_auto_btn || text === 'Опубликовать автоматически ⏳⬆️'

  if (text === TEXTS.back_to_main_menu_btn || text === 'Назад в главное меню ⏪') {
    await ctx.reply(TEXTS.home, BUTTONS.main_menu)
    await ctx.enterScene('main-menu')
    return
  }

  if (text === TEXTS.back_to_menu_btn || text === 'Назад в меню ⏪') {
    await ctx.reply(TEXTS.profile(ctx), BUTTONS.profile_menu)
    await ctx.enterScene('profile-menu')
    return
  }

  if (text === TEXTS.edit_profile_btn || text === 'Редактировать 📝') {
    await ctx.reply(TEXTS.edit, BUTTONS.edit_menu)
    await ctx.enterScene('edit-menu')
    return
  }

  if (text === TEXTS.view_profile_btn || text === 'Показать 👁') {
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

  if (isAutoPublishButton) {
    ctx.user.system_publishModerationRequest = true
    await users.set(ctx.user.id, ctx.user)
    await ctx.reply(TEXTS.publish_profile_moderation_request, BUTTONS.profile_menu)
    await ctx.enterScene('profile-menu')
    return
  }

  if (isPublishButton || isPublishConfirmButton) {
    const isValid = checkValid(ctx)

    if (isValid) {
      const timeout = getPublicationCooldownRemaining(ctx.user.system_lastPostTime)

      if (timeout > 0) {
        const minutes = moment.duration(parseInt(timeout / (60 * 1000)), 'minute').locale('ru').humanize()
            , textTime = moment.duration(PUBLICATION_COOLDOWN_MS / 60000, 'minute').locale('ru').humanize()

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

      if (isNotApprove && isPublishButton) {
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

  await replyWithHelp(ctx)
}

export default profileMenu
