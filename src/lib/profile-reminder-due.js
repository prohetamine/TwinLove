export const PROFILE_REMINDER_DELAY_MS = 24 * 60 * 60 * 1000

export const profileReminderAt = user => {
  const startedAt = Number(user.system_startTime)
  const lastActionAt = Number(user.system_actionTime) || 0
  if (!Number.isFinite(startedAt) || startedAt <= 0) return null

  return Math.max(startedAt, lastActionAt) + PROFILE_REMINDER_DELAY_MS
}

const profileReminderDue = (user, now = Date.now()) => {
  if (user.system_block_status || !user.system_phoneNumber ||
      Number(user.system_lastPostTime) > 0) {
    return false
  }

  const dueAt = profileReminderAt(user)
  return dueAt !== null && dueAt <= now
}

export default profileReminderDue
