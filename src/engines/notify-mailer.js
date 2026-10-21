/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
import { notifyCompletes, posts, notifys, users } from '../helpers/db.js'
import sleep from 'sleep-promise'
import { BUTTONS, TEXTS } from '../assets/ui/ru.js'
import { CHANNEL_LOG_ID } from '../../configs/env.js'

const notifyMailer = async () => {
  for (;;) {
    try {
      const _notifys = await notifys.all({ ids: { $exists: true, $not: { $size: 0 } } })
      
      for (let x = 0; x < _notifys.length; x++) {
        const notify = _notifys[x]

        const ids = notify.ids.sort(() => Math.random() - Math.random())

        for (let u = 0; u < ids.length; u++) {
          const [id, type] = ids[u]

          const [isNotify = false] = await notifyCompletes.all({ id, ids: { $in: [notify.id] } })

          const { newNotification, system_block_status, system_phoneNumber } = await users.get(id)

          if (!isNotify && newNotification !== 0 && system_block_status === false && system_phoneNumber) {
            let isDelivered = false

            for (let x = 0; x < 100; x++) {
              try {
                const { ids: _posts } = await posts.get(notify.id)

                if (_posts.length > 0) {
                  const postId = _posts[0]

                  await global.bot.telegram.sendMessage(id, TEXTS.post_in_city(type), BUTTONS.show_in_channel(postId))
                  await sleep(15000)
                  try {
                    await global.bot.telegram.sendMessage(CHANNEL_LOG_ID, `notify-mailer [${x+1}/${u+1}/${ids.length}] [good] >>> ${notify.id} => ${id}`)
                  } catch (e) {}
                }

                const notifyComplete = await notifyCompletes.get(id)
                notifyComplete.ids.push(notify.id)
                await notifyCompletes.set(id, notifyComplete)
                
                isDelivered = true
                break
              } catch (err) {
                if (err.toString().match('429')) {
                  await sleep(60000)
                }

                if (err.toString().match('403') || err.toString().match('chat not found')) {
                  try {
                    await global.bot.telegram.sendMessage(CHANNEL_LOG_ID, `notify-mailer [${x+1}/${u+1}/${ids.length}] [bad] >>> ${notify.id} => ${id}`)
                  } catch (e) {} 
                  isDelivered = false
                  break
                }
              }
            }

            if (!isDelivered) {
              const user = await users.get(id)
              user.newNotification = 0
              await users.set(id, user)
            }
          }

          notify.ids = notify.ids.filter(([_id]) => _id !== id)
          await notifys.set(notify.id, notify)

          if (!isNotify && newNotification !== 0 && system_block_status === false && system_phoneNumber) {
            await sleep(10000 * 1)
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

export default notifyMailer
