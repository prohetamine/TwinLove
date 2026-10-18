import { Telegraf } from 'telegraf'
import { BOT_TOKEN } from '../configs/env.js'
import mainLoop from './main-loop.js'
import autoPublisher from './engines/auto-publisher.js'
import notifyMailer from './engines/notify-mailer.js'
import notifyStartUp from './engines/notify-startup.js'
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
global.bot.launch()

setTimeout(() => {
  notifyMailer()
  autoPublisher()
  notifyStartUp()
}, 15000)

//server()

process.once('SIGINT', () => global.bot.stop('SIGINT'))
process.once('SIGTERM', () => global.bot.stop('SIGTERM'))

/////////////////////////////////


//import Telegraph from 'telegra.ph-next'

/*
;(async () => {
  const client = new Telegraph()

  const account = await client.createAccount('oninetbot', 'ОДИНОКИЙ НИЖНИЙ ИНТЕРНЕТ')
  console.log(account)
  client.token = account.access_token

  const pages = await client.getPageList()
  console.log(pages)
})()
*/

/*
const token = 'e50d3050b4804100d2899c2b530f70ea5ed2dc3020c78b1990fc552d493a'

;(async () => {
  const client = new Telegraph(token)
  
  await client.editPage(
    'Znakomstva-21-ebat-ne-dolzhno-ya-ne-myaso-iz-g-Lipeck-06-02', 
    'ОДИНОКИЙ НИЖНИЙ ИНТЕРНЕТ', 
    [
      //{ tag: 'img', attrs: { src: 'https://static5.tgstat.ru/channels/_0/53/53ea191c9ba63114fb907831b4ea92a4.jpg' } },
      { tag: 'i', children: ['20, саmка, аниме-тян с пробегом'] },
      { tag: 'i', children: ['басист, пью пивo и не попадаю в ноты'] },
      { tag: 'i', children: ['воpую мемы, хочу трахнуть поднебесного, но дажe он протuв, т.к. секc бyдет платным, психиатры нынче дорогие'] },
      { tag: 'i', children: ['альтушкa экстра вёрджиn'] },
      { tag: 'i', children: ['хочу исчезнуть наxуй'] },
      { tag: 'p', children: [' '] },
      { tag: 'b', children: [ { tag: 'i', children: ['г. Москва'] }, ' 📍'] },
      { tag: 'p', children: [' '] },
      { tag: 'a', children: ['бот'], attrs: { href: 'https://t.me/oninetbot?start=from-web'} }, '  •  ', { tag: 'a', children: ['все анкеты'], attrs: { href: 'https://t.me/oninetbot?start=channel'} }, '  •  ', { tag: 'a', children: ['общий чат'], attrs: { href: 'https://t.me/oninetbot?start=chat'} }, '  •  ', { tag: 'a', children: ['#москва'], attrs: { href: 'https://t.me/oninetbot?start=channel'} },
      { tag: 'p', children: [' '] },
      { tag: 'b', children: ['Действия:'] }, '  ', { tag: 'a', children: ['Написать ✍️'], attrs: { href: 'https://t.me/oninetbot?start=w_1851423141'} }, '  ', { tag: 'a', children: ['Махнуть рукой 👋'], attrs: { href: 'https://t.me/oninetbot?start=h_1851423141'} }, '  ', { tag: 'a', children: ['Пожаловаться ⚠️'], attrs: { href: 'https://t.me/oninetbot?start=r_1851423141'} }
    ], 
    '@oninetbot', 
    'https://t.me/oninetbot?start=web', 
    true
  )
  //console.log(await client.createPage('Знакомства 21, ебать не должно я не мясо из г. Липецк', ['content'], '@oninetbot', 'https://t.me/oninetbot?start=web', true))

  const pages = await client.getPageList()
  console.log(pages)

})()*/
