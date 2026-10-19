import test from 'node:test'
import assert from 'node:assert/strict'
import profileReminderDue, { PROFILE_REMINDER_DELAY_MS, profileReminderAt } from '../src/lib/profile-reminder-due.js'

const now = 1_800_000_000_000
const eligibleUser = {
  system_startTime: now - PROFILE_REMINDER_DELAY_MS - 1000,
  system_actionTime: now - PROFILE_REMINDER_DELAY_MS - 1000,
  system_phoneNumber: '+10000000000',
  system_block_status: false,
  newNotification: 1
}

test('a new user cannot receive the publication reminder immediately', () => {
  assert.equal(profileReminderDue({ ...eligibleUser, system_startTime: now - 15_000, system_actionTime: 0 }, now), false)
  assert.equal(profileReminderDue({ ...eligibleUser, system_startTime: 0, system_actionTime: 0 }, now), false)
})

test('the reminder waits 24 hours after the latest action', () => {
  assert.equal(profileReminderAt({ ...eligibleUser, system_actionTime: now - 60_000 }), now + PROFILE_REMINDER_DELAY_MS - 60_000)
  assert.equal(profileReminderDue({ ...eligibleUser, system_actionTime: now - 60_000 }, now), false)
  assert.equal(profileReminderDue(eligibleUser, now), true)
})

test('a previous publication prevents the reminder even after its post was removed', () => {
  assert.equal(profileReminderDue({ ...eligibleUser, system_lastPostTime: now - 100_000 }, now), false)
})

test('new-profile notification settings do not affect the reminder', () => {
  assert.equal(profileReminderDue({ ...eligibleUser, newNotification: 0 }, now), true)
})

test('missing phone numbers and blocked users prevent the reminder', () => {
  assert.equal(profileReminderDue({ ...eligibleUser, system_phoneNumber: '' }, now), false)
  assert.equal(profileReminderDue({ ...eligibleUser, system_block_status: true }, now), false)
})
