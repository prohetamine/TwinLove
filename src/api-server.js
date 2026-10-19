import { User, Post } from './helpers/models.js'
import express from 'express'
import cors from 'cors'

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
          system_phoneNumber: { $exists: true, $nin: ['', null] },
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
      },
      {
        $unset: ['system_phoneNumber', 'gender']
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
        media: user.media
          .filter(media => media.isPhoto && media.isApprove && media.isPeople)
          .map(({ fileId }) => fileId)
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
