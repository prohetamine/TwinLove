import { createHash } from 'node:crypto'
import { TEXTS, BUTTONS } from '../assets/ui/ru.js'

const MAX_LINKS = 20
const deriveReferralCode = (primaryCode, index) => createHash('sha256')
  .update(`${primaryCode}:${index}`)
  .digest('base64url')
  .slice(0, 4)

const referralView = async (user, { referals, posts }) => {
  const record = await referals.get(user.id)
  const links = [{ code: user.system_referalHashId, ids: record.ids }, ...(record.links || [])]
  const ids = [...new Set(links.flatMap(link => link.ids))]
  const published = new Set((await posts.all({ id: { $in: ids } })).filter(post => post.ids.length > 0).map(post => post.id))
  return TEXTS.referal_links(links.map(link => ({
    code: link.code,
    visits: link.ids.length,
    published: link.ids.filter(id => published.has(id)).length
  })))
}

const createReferralLink = async (user, { users, referals }) => {
  const record = await referals.get(user.id)
  if ((record.links || []).length >= MAX_LINKS - 1) return false
  for (let index = (record.links || []).length + 1; index < 1000; index++) {
    const code = deriveReferralCode(user.system_referalHashId, index)
    if (code === user.system_referalHashId || record.links?.some(link => link.code === code)) continue
    const [primary] = await users.all({ system_referalHashId: code })
    const [secondary] = await referals.all({ 'links.code': code })
    if (primary || secondary) continue
    const link = { code, ids: [] }
    record.links = [...(record.links || []), link]
    await referals.set(user.id, record)
    return code
  }
  throw new Error('Could not create a unique referral code')
}

const referralMessageOptions = {
  parse_mode: 'MarkdownV2',
  disable_web_page_preview: true,
  reply_markup: BUTTONS.referral_links_inline.reply_markup
}

export { referralView, createReferralLink, deriveReferralCode, referralMessageOptions }
