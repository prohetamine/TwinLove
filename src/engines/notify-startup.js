/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
import { notifyCompletes, posts, users } from '../helpers/db.js'
import sleep from 'sleep-promise'
import { BUTTONS, TEXTS } from '../assets/ui/ru.js'
import { CHANNEL_LOG_ID } from '../../configs/env.js'

const notifyStartUp = async () => {
  for (;;) {
    const _users = await users.all({ 
      system_block_status: false, 
      $or: [
        { 
          system_actionTime: { $lt: Date.now() - 86400000 } 
        }, 
        { 
          system_actionTime: { $exists: false } 
        }
      ] 
    })

    try {
      for (let x = 0; x < _users.length; x++) {
        const user = _users[x]

        const [isNotify = false] = await notifyCompletes.all({ id: user.id, ids: { $in: [111] } })

        if (isNotify) {
          continue
        }

        const post = await posts.get(user.id)
        
        if (post.ids.length === 0) {
          for (let r = 0; r < 10; r++) {
            try {
              if (
                user.location !== '0|0' &&
                user.text.length > 20 &&
                user.text.length < 800
              ) {
                await global.bot.telegram.sendMessage(user.id, TEXTS.fulled_not_publish, BUTTONS.channel_inline)
              } else {
                await global.bot.telegram.sendMessage(user.id, TEXTS.not_fulled_not_publish, BUTTONS.channel_inline)
              }
              try {
                await global.bot.telegram.sendMessage(CHANNEL_LOG_ID, `notify-startup [${r+1}/${x+1}/${_users.length}] [good] >>> ${user.id}`)
              } catch (e) {}
              break
            } catch (err) {
              if (err.toString().match('429')) {
                await sleep(60000)
              }

              if (err.toString().match('403')) {
                try {
                  await global.bot.telegram.sendMessage(CHANNEL_LOG_ID, `notify-startup [${r+1}/${x+1}/${_users.length}] [bad] >>> ${user.id}`)
                } catch (e) {} 
                user.newNotification = 0
                await users.set(user.id, user)
                break
              }
            }
          }

          const notifyComplete = await notifyCompletes.get(user.id)
          notifyComplete.ids.push(111)
          await notifyCompletes.set(user.id, notifyComplete)
          
          if (user.newNotification !== 0) {
            await sleep(60000 * 5)
          }
        }
      }

      await sleep(60000 * 3)
    } catch (e) {
      console.log(e)
      await sleep(60000 * 10)
    }
  }
}

export default notifyStartUp