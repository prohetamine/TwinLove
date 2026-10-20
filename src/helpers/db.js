import { MONGODB_URL } from '../../configs/env.js'
import mongoose from 'mongoose'
import { User, Referal, Post, Invite, InvitesLike, Notify, NotifyComplete } from './models.js'
import memoryDB from './memory-db.js'

const pushTime = 10000
    , pullTime = 60000

const users = memoryDB(User, 'users', { pushTime, pullTime })
    , referals = memoryDB(Referal, 'referals', { pushTime, pullTime })
    , posts = memoryDB(Post, 'posts', { pushTime, pullTime })
    , invites = memoryDB(Invite, 'invites', { pushTime, pullTime })
    , invitesLike = memoryDB(InvitesLike, 'invitesLike', { pushTime, pullTime })
    , notifys = memoryDB(Notify, 'notifys', { pushTime, pullTime })
    , notifyCompletes = memoryDB(NotifyComplete, 'notifyCompletes', { pushTime, pullTime })

export {
  users,
  referals,
  posts,
  invites,
  invitesLike,
  notifys,
  notifyCompletes
}

const dbReady = mongoose.connect(MONGODB_URL, {
  dbName: 'twinlove'
})
  .then(() => console.log('Connect mongodb!'))

export { dbReady }
