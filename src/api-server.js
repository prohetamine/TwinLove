/* eslint-disable no-unused-vars */
import { User, Referal, Post, Invite, InvitesLike, Media, Notify, NotifyComplete } from './helpers/models.js'
import express from 'express'
import { Telegraf } from 'telegraf'
import cors from 'cors'

const bot = new Telegraf('6631950601:AAHHdQTRTvOMH1efIRnCqQhCFAwKNFmI1nM')
const app = express()

app.use(cors())

const apiServer = () => {
  app.get('/user', async (req, res) => {
    const offset = parseInt(req.query.offset)

    const users = (await User.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $gte: [{ $strLenCP: '$text' }, 20] },
              { $lte: [{ $strLenCP: '$text' }, 800] }
            ]
          },
          location: { $ne: '0|0' },
          system_block_status: { $ne: true },
          system_age18Confirm: { $ne: false },
          system_rulesConfirm: { $ne: false },
          system_username: { $ne: '' }
        }
      },
      /*{
        $addFields: {
          mediaCount: { $size: '$media' }
        }
      },
      {
        $sort: { mediaCount: -1 }
      },*/
      {
        $sort: { system_lastPostTime: 1 }
      }
    ]))
    .filter(user => user.media.filter(media => media.isPhoto && media.isApprove && media.isPeople).length > 0)
    
    const posts = (await Post.find({ id: users.map(user => user.id) }))

    let _users = []
    
    _users = users.filter(user => posts.find(post => post.id === user.id).ids.length > 0)
    _users = _users.slice(offset, offset + 3)

    _users = await Promise.all(_users.map(
      async user => ({
        ...user,
        media: await Promise.all(
          user.media.filter(media => media.isPhoto && media.isApprove && media.isPeople).map(async ({ fileId }) => {
            try {
              const { href } = await bot.telegram.getFileLink(fileId)
              const blob = await fetch(href).then(async data => {             
                return `data:${data.headers.get('content-type')};base64,${Buffer.from(await data.arrayBuffer()).toString('base64')}`
              })
              return blob
            } catch (e) {
              return false
            }
          }).filter(data => data)
        )
      })
    ))

    res.send(
      JSON.stringify(_users)
    )
  })

  app.listen(8989, () => {
    console.log('Start apiServer 8989')
  })
}

export default apiServer
