import { Referal } from './models.js'

const plain = document => document?.toObject() || null

const referals = {
  get: async id => {
    const existing = await Referal.findOne({ id })
    if (existing) return plain(existing)
    return plain(await new Referal({ id }).save())
  },
  all: async query => (await Referal.find(query)).map(plain),
  addLink: async (id, link) => Referal.updateOne({ id }, { $push: { links: link } }),
  addVisit: async (id, code, visitorId) => Referal.updateOne(
    code ? { id, 'links.code': code } : { id },
    { $addToSet: { [code ? 'links.$.ids' : 'ids']: visitorId } }
  )
}

export default referals
