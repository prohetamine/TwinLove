const registerReferral = async (code, invitedUserId, { users, referals }) => {
  const [owner] = await users.all({ system_referalHashId: code })
  if (!owner || owner.id === invitedUserId) return false

  const ownerReferals = await referals.get(owner.id)
  if (!ownerReferals || ownerReferals.ids.includes(invitedUserId)) return false

  const [existingReferal] = await referals.all({ ids: invitedUserId })
  if (existingReferal) return false

  ownerReferals.ids.push(invitedUserId)
  await referals.set(owner.id, ownerReferals)
  return true
}

export default registerReferral
