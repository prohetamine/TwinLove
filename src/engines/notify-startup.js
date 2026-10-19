import { notifyCompletes, posts, users } from '../helpers/db.js'
import { BUTTONS, TEXTS } from '../assets/ui/ru.js'
import { CHANNEL_LOG_ID } from '../../configs/env.js'
import { createProfileReminderScheduler } from '../lib/profile-reminder-scheduler.js'

const scheduler = createProfileReminderScheduler({
  getUser: id => users.get(id),
  listUsers: () => users.all({
    system_startTime: { $gt: 0 },
    $or: [
      { system_lastPostTime: 0 },
      { system_lastPostTime: { $exists: false } }
    ]
  }),
  hasPublished: async id => (await posts.get(id)).ids.length > 0,
  hasReminder: async id => (await notifyCompletes.get(id)).ids.includes(111),
  sendReminder: async user => {
    const completed = user.location !== '0|0' && user.text.length > 20 && user.text.length < 800
    const message = completed ? TEXTS.fulled_not_publish : TEXTS.not_fulled_not_publish
    try {
      await global.bot.telegram.sendMessage(user.id, message, BUTTONS.channel_inline)
    } catch (error) {
      if (error.response?.error_code !== 403) throw error
      return
    }
    try {
      await global.bot.telegram.sendMessage(CHANNEL_LOG_ID, `notify-startup [good] >>> ${user.id}`)
    } catch (error) {
      console.error('Reminder log failed', error)
    }
  },
  markReminder: async id => {
    const completed = await notifyCompletes.get(id)
    if (!completed.ids.includes(111)) {
      completed.ids.push(111)
      await notifyCompletes.set(id, completed)
    }
  }
})

export const scheduleProfileReminder = user => scheduler.schedule(user)

const notifyStartUp = () => scheduler.restore()

export default notifyStartUp
