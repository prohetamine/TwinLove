import profileReminderDue, { profileReminderAt } from './profile-reminder-due.js'

export const createProfileReminderScheduler = ({
  getUser,
  listUsers,
  hasPublished,
  hasReminder,
  sendReminder,
  markReminder,
  onError = console.error,
  now = Date.now,
  setTimer = setTimeout,
  clearTimer = clearTimeout
}) => {
  const timers = new Map()

  const run = async id => {
    timers.delete(id)
    try {
      const current = await getUser(id)
      if (!current) return

      const currentDueAt = profileReminderAt(current)
      if (currentDueAt !== null && currentDueAt > now()) {
        schedule(current)
        return
      }

      if (!profileReminderDue(current, now())) return
      if (await hasReminder(id) || await hasPublished(id)) return

      await sendReminder(current)
      await markReminder(id)
    } catch (error) {
      onError(error)
      timers.set(id, setTimer(() => run(id), 60_000))
    }
  }

  const schedule = user => {
    const previous = timers.get(user.id)
    if (previous) clearTimer(previous)
    timers.delete(user.id)

    const dueAt = profileReminderAt(user)
    if (dueAt === null || Number(user.system_lastPostTime) > 0) return

    const timer = setTimer(() => run(user.id), Math.max(0, dueAt - now()))
    timers.set(user.id, timer)
  }

  const restore = async () => {
    const candidates = await listUsers()
    for (const user of candidates) schedule(user)
  }

  return { schedule, restore }
}
