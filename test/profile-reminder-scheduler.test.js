import test from 'node:test'
import assert from 'node:assert/strict'
import { createProfileReminderScheduler } from '../src/lib/profile-reminder-scheduler.js'
import { PROFILE_REMINDER_DELAY_MS } from '../src/lib/profile-reminder-due.js'

test('activity resets the exact 24-hour timer', async () => {
  let currentTime = 1_800_000_000_000
  let user = {
    id: 7,
    system_startTime: currentTime,
    system_actionTime: currentTime,
    system_lastPostTime: 0,
    system_phoneNumber: '+10000000000',
    system_block_status: false,
    newNotification: 1
  }
  const timers = new Map()
  let nextTimer = 0
  let sends = 0
  let marked = false
  const scheduler = createProfileReminderScheduler({
    getUser: async () => user,
    listUsers: async () => [user],
    hasPublished: async () => false,
    hasReminder: async () => marked,
    sendReminder: async () => { sends++ },
    markReminder: async () => { marked = true },
    now: () => currentTime,
    setTimer: (fn, delay) => {
      const id = ++nextTimer
      timers.set(id, { fn, at: currentTime + delay })
      return id
    },
    clearTimer: id => timers.delete(id)
  })

  await scheduler.restore()
  assert.equal([...timers.values()][0].at, currentTime + PROFILE_REMINDER_DELAY_MS)

  currentTime += 60_000
  user = { ...user, system_actionTime: currentTime }
  scheduler.schedule(user)
  assert.equal(timers.size, 1)
  assert.equal([...timers.values()][0].at, currentTime + PROFILE_REMINDER_DELAY_MS)

  currentTime += PROFILE_REMINDER_DELAY_MS
  await [...timers.values()][0].fn()
  assert.equal(sends, 1)
  assert.equal(marked, true)
})

test('publication before the deadline prevents the reminder', async () => {
  const now = 1_800_000_000_000
  let user = {
    id: 8,
    system_startTime: now - PROFILE_REMINDER_DELAY_MS,
    system_actionTime: now - PROFILE_REMINDER_DELAY_MS,
    system_lastPostTime: 0,
    system_phoneNumber: '+10000000000',
    newNotification: 1
  }
  let sends = 0
  let timer
  const scheduler = createProfileReminderScheduler({
    getUser: async () => user,
    listUsers: async () => [user],
    hasPublished: async () => false,
    hasReminder: async () => false,
    sendReminder: async () => { sends++ },
    markReminder: async () => {},
    now: () => now,
    setTimer: fn => { timer = fn; return 1 }
  })
  await scheduler.restore()
  user = { ...user, system_lastPostTime: now - 1000 }
  await timer()
  assert.equal(sends, 0)
})
