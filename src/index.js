import { Telegraf } from 'telegraf'
import { BOT_TOKEN } from '../configs/env.js'
import mainLoop from './main-loop.js'
import autoPublisher from './engines/auto-publisher.js'
import notifyMailer from './engines/notify-mailer.js'
import notifyStartUp from './engines/notify-startup.js'
import { dbReady } from './helpers/db.js'
//import server from './api-server.js'

global.bot = new Telegraf(BOT_TOKEN)

/*
let timeoutOver = false
setTimeout(() => {
  timeoutOver = true
}, 5000)
*/

global.bot.use((ctx, next) => {
  /*if (!timeoutOver) {
    return
  }*/
  
  next()
})

global.bot.use(mainLoop)
await dbReady
global.bot.launch({}, () => {
  setTimeout(() => {
    notifyMailer()
    autoPublisher()
    notifyStartUp()
  }, 15000)
}).catch(error => console.error('Bot launch failed', error))

//server()

process.once('SIGINT', () => global.bot.stop('SIGINT'))
process.once('SIGTERM', () => global.bot.stop('SIGTERM'))
