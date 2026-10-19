import { users } from '../helpers/db.js'

const getUsersNotify = async user => {
  if (user.location === '999|666') {
    return []
  }

  const _users = await users.all({ id: { $ne: user.id }, system_block_status: { $ne: true }, location: { $ne: '999|666' }, newNotification: { $ne: 0 } })

  const nusers = _users.filter(_user =>
    _user.system_phoneNumber &&
    (_user.newNotification === 1
      ? _user.location === user.location
      : _user.newNotification === 2
        ? _user.nighLocations.find(location => location === user.location)
        : true)
  ).map(
    ({ id, location, nighLocations }) => 
      [
        id, 
        location === user.location 
          ? 1 
          : nighLocations.find(location => location === user.location) 
              ? 2 
              : 3
      ]
  )

  return nusers
}

export default getUsersNotify
