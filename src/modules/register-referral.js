import { Referal } from '../helpers/models.js'

const registerReferral = async (code, invitedUserId, { users, referals, persistLinkVisit = (ownerId, linkCode, visitorId) => Referal.updateOne(
  { id: ownerId, 'links.code': linkCode },
  { $addToSet: { 'links.$.ids': visitorId } }
) }) => {
  const [primaryOwner] = await users.all({ system_referalHashId: code })
  const [linkRecord] = primaryOwner ? [] : await referals.all({ 'links.code': code })
  const ownerId = primaryOwner?.id ?? linkRecord?.id
  if (!ownerId || ownerId === invitedUserId) return false

  const ownerReferals = await referals.get(ownerId)
  if (!ownerReferals || ownerReferals.ids.includes(invitedUserId) || ownerReferals.links?.some(link => link.ids.includes(invitedUserId))) return false

  const [existingReferal] = await referals.all({ ids: invitedUserId })
  const [existingLinkReferal] = await referals.all({ 'links.ids': invitedUserId })
  if (existingReferal || existingLinkReferal) return false

  if (primaryOwner) ownerReferals.ids.push(invitedUserId)
  else {
    await persistLinkVisit(ownerId, code, invitedUserId)
    ownerReferals.links.find(link => link.code === code).ids.push(invitedUserId)
  }
  await referals.set(ownerId, ownerReferals)
  return true
}

export default registerReferral
