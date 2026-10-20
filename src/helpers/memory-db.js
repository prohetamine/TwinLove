/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
const memo = {}
    , timer = {}

const parseId = _id => {
 let id = _id
  if (
    parseInt(_id) === _id - 0 &&
    parseInt(_id).toString() !== 'NaN' && 
    parseInt(_id).toString().length === _id.toString().length
  ) {
    id = parseInt(_id)
  }

  return id
}

const memoryDB = (Model, labelId, { pushTime, pullTime }) => {
  memo[labelId] = {}
  timer[labelId] = {}

  const get = async _id => {
    const id = parseId(_id)
  
    let data = memo[labelId][id] 
                ? memo[labelId][id].upd > Date.now() - pullTime
                    ? memo[labelId][id]
                    : (await Model.findOne({ id }))?._doc
                : (await Model.findOne({ id }))?._doc
    
    if (!data) {
      try {
        const _data = new Model({ id })
        await _data.save()
        data = _data._doc
      } catch (e) {
        return null
      } 
    }
  
    delete data._id
    delete data.__v
  
    if (data) {
      memo[labelId][id] = data
    }
    return memo[labelId][id] || null
  }
  
  const set = async (_id, data) => {
    const id = parseId(_id)
  
    memo[labelId][id] = {
      ...(memo[labelId][id] || {}),
      ...data,
      upd: Date.now()
    }
  
    if (timer[labelId][id]) {
      clearTimeout(timer[labelId][id])
    }
  
    timer[labelId][id] = setTimeout(async () => {
      const patch = memo[labelId][id]

      for (;;) {
        try {
          await Model.findOneAndUpdate({ id }, patch)

          if (memo[labelId][id] === patch) {
            memo[labelId][id] = null
          }

          break
        } catch (e) {}
      }
    }, pushTime)
  
    return memo[labelId][id]
  }
  
  const all = async obj => {
    const datas = await Model.find(obj)

    const cachedMatches = Object.values(memo[labelId]).filter(data => data && Object.entries(obj).every(([key, value]) => {
      if (key === 'links.code') return data.links?.some(link => link.code === value)
      if (key === 'links.ids') return data.links?.some(link => link.ids.includes(value))
      return false
    }))
  
    const stored = datas.map(_data => {
      const data = _data._doc
      delete data._id
      delete data.__v
  
      const memoData = memo[labelId][data.id]
   
      return (
        memoData
          ? memoData.upd > data.upd 
              ? memoData 
              : data 
          : data
      )
    })
    return [...stored, ...cachedMatches.filter(cached => !stored.some(data => data.id === cached.id))]
  }

  return {
    get,
    set,
    all
  }
}

export default memoryDB
