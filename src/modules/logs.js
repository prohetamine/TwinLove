import { CHANNEL_LOG_ID } from '../../configs/env.js'

let stopTime = 0

const logs = async ctx => {
  try {
    const { from } = (ctx.update?.message || ctx.update?.callback_query || {})
        , { text, location, video, photo } = (ctx.update?.message || ctx.update?.callback_query || {})
        , data = ctx.update?.callback_query?.data
  
    const type = data 
                  ? 'data'
                  : text 
                      ? 'text'
                      : location 
                          ? 'location'
                          : video 
                              ? 'video'
                              : photo 
                                  ? 'photo'
                                  : 'other'
  
    const _data = data || text || JSON.stringify(location) || (video||photo?.pop())?.file_id || 'other data'
    
    const dataUser = ((from.first_name || '') + ' ' + (from.last_name || '') + (from.username ? ` (@${from.username}) [${from.id}]` : ` [${from.id}]`)).trim()
    
    if (stopTime < new Date() - 1000) {
      stopTime = new Date() - 0
      await ctx.telegram.sendMessage(CHANNEL_LOG_ID, `${dataUser}: [${type}] ${_data}`)      
    } else {
      console.log(`${dataUser}: [${type}] ${_data}`)  
    }
  } catch (e) {
    console.log(e)
  }
}

export default logs