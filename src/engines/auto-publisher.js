/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import { posts, users, notifys } from '../helpers/db.js'
import sleep from 'sleep-promise'
import sendProfileCard from '../modules/send-profile-card.js'
import { CHANNEL_ID, CHANNEL_LOG_ID, IS_DEV } from '../../configs/env.js'
import getUserNotifys from '../modules/get-users-notify.js'
import { TEXTS } from '../assets/ui/ru.js'
import getPublicationCooldownRemaining from '../modules/get-publication-cooldown-remaining.js'

const autoPublisher = async () => {
  for (;;) {
    try {
      const _users = await users.all({ 
        system_publishModerationRequest: true,
        system_block_status: false,
        hidden: false
      })

      for (let x = 0; x < _users.length; x++) {
        const user = _users[x]

        if (!user.system_phoneNumber || !user.name?.trim()) continue
  
        if (getPublicationCooldownRemaining(user.system_lastPostTime) > 0) {
          continue
        }
  
        const isAllApprove = !user.media.find(({ isApprove }) => !isApprove)
            , isModeration = user.location === '999|666' ? user.system_publishModerationStatus : true
  
        if (isAllApprove && isModeration) {
          let messageId = false
          for (let r = 0; r < 10; r++) {
            try {
              messageId = await sendProfileCard(user, CHANNEL_ID)
              
              if (messageId) {
                const _posts = await posts.get(user.id)
    
                if (user.autoRemovePrevPost) {
                  for (let x = 0; x < _posts.ids.length; x++) {
                    try {
                      await global.bot.telegram.deleteMessage(CHANNEL_ID, _posts.ids[x])
                    } catch (e) {}
                    _posts.ids = _posts.ids.filter(id => id !== _posts.ids[x]) 
                  }
                }
          
                _posts.ids = [messageId, ..._posts.ids]
                await posts.set(user.id, _posts)
      
                const notify = await notifys.get(user.id)
                notify.ids = await getUserNotifys(user)
                await notifys.set(user.id, notify)
      
                user.system_lastPostTime = Date.now() - 0
                user.system_publishModerationRequest = false
                user.system_publishModerationStatus = false
                await users.set(user.id, user)
                await sleep(10000)
                try {
                  await global.bot.telegram.sendMessage(CHANNEL_LOG_ID, `auto-publisher [${x+1}/${_users.length}] [good] >>> ${user.id} => ${CHANNEL_ID}`)
                } catch (e) {}
                break
              }
            } catch (e) {
              console.log(e)
              await sleep(60000)
            }
          }
          
          if (messageId) {
            try {
              await global.bot.telegram.sendMessage(user.id, TEXTS.publish_profile_complete, { parse_mode: 'MarkdownV2' })
            } catch (e) {}
          }
          
          await sleep(60000 * (IS_DEV ? 1 : 15))
        }
      }
    
      await sleep(60000 * (IS_DEV ? 1 : 5))
    } catch (e) {
      console.log('autopublisher', e)
      await sleep(60000 * 10)
    }
  }
}

export default autoPublisher
