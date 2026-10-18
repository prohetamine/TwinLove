import { users } from './helpers/db.js'
import sceneHandler from './lib/scene-handler.js'

import start from './scenes/start.js'
import mainMenu from './scenes/main-menu.js'
import profileMenu from './scenes/profile-menu.js'
import supportMenu from './scenes/support-menu.js'
import adminMenu from './scenes/admin-menu.js'
import editMenu from './scenes/edit-menu.js'
import textMenu from './scenes/edit-menu/text-menu.js'
import locationMenu from './scenes/edit-menu/location-menu.js'
import mediaMenu from './scenes/edit-menu/media-menu.js'
import contactMenu from './scenes/edit-menu/contact-menu.js'
import notificationMenu from './scenes/edit-menu/notification-menu.js'
import visibilityMenu from './scenes/edit-menu/visibility-menu.js'
import autodeleteMenu from './scenes/edit-menu/autodelete-menu.js'
import profileViewMenu from './scenes/profile-view-menu.js'
import age18confirmMenu from './scenes/age18confirm-menu.js'
import rulesMenu from './scenes/rules-menu.js'
import writeMenu from './scenes/contact-menu/write-menu.js'
import reportMenu from './scenes/contact-menu/report-menu.js'
import helloMenu from './scenes/contact-menu/hello-menu.js'

import callback_querys from './modules/callback_querys.js'
import commands from './modules/commands.js'
import ban from './modules/ban.js'
import tip from './modules/tip.js'
import logs from './modules/logs.js'
import { TEXTS } from './assets/ui/ru.js'

const mainLoop = async (ctx, next) => {
  if (!ctx && !next) {
    console.log('exit [mainLoop]')
    return
  }

  const userId = (ctx.update?.message || ctx.update?.callback_query)?.from?.id || false
      , isPrivateChat = (ctx.update?.message || ctx.update?.callback_query?.message)?.chat?.type === 'private' || false
      , username = (ctx.update?.message || ctx.update?.callback_query)?.from?.username || false

  if (!isPrivateChat) {
    console.log('is not private chat [mainLoop]')
    return
  }

  await logs(ctx)

  const user = await users.get(userId)

  if (!user) {
    console.log('user not found [mainLoop]')
    return  
  }

  ctx.user = user
  ctx.isAdmin = user.system_isAdmin
  ctx.isSupport = user.system_isSupport
  ctx.user.system_actionTime = Date.now()

  if (ctx.user.system_startTime === 0) {
    ctx.user.system_startTime = Date.now()
  }

  ctx.user.system_username = username || ''

  if (['bottom-internet', 'crypto-menu', 'other-menu'].includes(ctx.user.scene)) {
    ctx.user.scene = ctx.user.scene === 'bottom-internet' ? 'profile-menu' : 'main-menu'
    await users.set(ctx.user.id, ctx.user)
  }

  const text = ctx.update?.message?.text || ''
      , data = ctx.update?.callback_query?.data || ''

  if (text.match(/^\/start$/) || text.match(/^\/start from-channel/)) {
    ctx.user.scene = 'start'
    await users.set(ctx.user.id, ctx.user)
  } else {
    if (
      text !== TEXTS.rules_btn &&
      text !== 'Правила 🚩' &&
      ctx.user.scene !== 'support-menu'
    ) {
      if (ctx.user?.system_age18Confirm === false) {
        ctx.user.scene = 'age18confirm-menu'
        await users.set(ctx.user.id, ctx.user)
      } else {
        if (ctx.user?.system_rulesConfirm === false) {
          ctx.user.scene = 'rules-menu'
          await users.set(ctx.user.id, ctx.user)
        }
      }
    }
  }

  ctx.enterScene = async (label, { repeat = false } = { repeat: false }) => {
    ctx.user.scene = label
    await users.set(ctx.user.id, ctx.user)
    if (repeat) {
      await mainLoop(ctx, next)
    }
  }

  if (data) {
    await callback_querys(ctx)
    return
  }

  if (!text.match(/^\/start from-channel/) && !text.match(/^\/start$/) && text.match(/^\//)) {
    await commands(ctx)
    return
  }

  if (ctx.user.system_block_status && ctx.user.scene !== 'support-menu') {
    await ban(ctx)
    return
  }

  await tip(ctx)

  const sh = sceneHandler(ctx)

  await sh.add('start', start)
  await sh.add('age18confirm-menu', age18confirmMenu)
  await sh.add('rules-menu', rulesMenu)
  await sh.add('main-menu', mainMenu)
  await sh.add('profile-menu', profileMenu)
  await sh.add('support-menu', supportMenu)
  await sh.add('admin-menu', adminMenu)
  await sh.add('edit-menu', editMenu)
  await sh.add('edit-text-menu', textMenu)
  await sh.add('edit-location-menu', locationMenu)
  await sh.add('edit-media-menu', mediaMenu)
  await sh.add('edit-contact-menu', contactMenu)
  await sh.add('edit-notification-menu', notificationMenu)
  await sh.add('edit-visibility-menu', visibilityMenu)
  await sh.add('edit-autodelete-menu', autodeleteMenu)
  await sh.add('profile-view-menu', profileViewMenu)
  await sh.add('write-menu', writeMenu)
  await sh.add('hello-menu', helloMenu)
  await sh.add('report-menu', reportMenu)

  await sh.exec()
}

export default mainLoop
