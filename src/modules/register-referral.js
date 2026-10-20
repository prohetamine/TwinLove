const registerReferral = async (code, invitedUserId, { users, referals }) => {
  const [primaryOwner] = await users.all({ system_referalHashId: code })
  const [linkRecord] = primaryOwner ? [] : await referals.all({ 'links.code': code })
  const ownerId = primaryOwner?.id ?? linkRecord?.id
  if (!ownerId || ownerId === invitedUserId) return false

  const ownerReferals = await referals.get(ownerId)
  if (!ownerReferals || ownerReferals.ids.includes(invitedUserId) || ownerReferals.links?.some(link => link.ids.includes(invitedUserId))) return false

  const [existingReferal] = await referals.all({ ids: invitedUserId })
  const [existingLinkReferal] = await referals.all({ 'links.ids': invitedUserId })
  if (existingReferal || existingLinkReferal) return false

  await referals.addVisit(ownerId, primaryOwner ? null : code, invitedUserId)
  return true
}

export default registerReferral
