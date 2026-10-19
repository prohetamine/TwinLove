import { BOT_LINK } from '../../configs/env.js'
import getCityById from '../lib/get-city-by-id.js'
import hashtag from '../assets/hash-tag.js'
import profileGenderSymbol from './profile-gender-symbol.js'

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char])

const profileText = user => {
  const anonymous = user.location === '999|666'
  const city = anonymous ? null : getCityById(user.location)
  const genderSymbol = profileGenderSymbol(user.gender)
  const lines = [
    ...(user.name ? [`<h1>${genderSymbol ? `${genderSymbol} ` : ''}${escapeHtml(user.name)}</h1>`] : []),
    `<p>${escapeHtml(user.text).replaceAll('\n', '<br>')}</p>`,
    '<p>&nbsp;</p>'
  ]

  if (!anonymous && user.privacyCity === 1) lines.push(`<p>Мой и ближайшие города 🌆 <a href="${BOT_LINK}?start=privacycity">(?)</a></p>`)
  if (!anonymous && user.privacyCity === 2) lines.push(`<p>Только мой город 🏡 <a href="${BOT_LINK}?start=privacycity">(?)</a></p>`)
  lines.push(anonymous
    ? `<p><b>Анонимный 🏴‍☠️ 📍</b> <a href="${BOT_LINK}?start=anon">(?)</a></p>`
    : `<p><b>${escapeHtml(city.title)} ${escapeHtml(city.flag)} 📍</b></p>`)
  lines.push('<p>&nbsp;</p>')
  lines.push(`<p><a href="${BOT_LINK}?start=from-channel">бот</a>  •  <a href="${BOT_LINK}?start=channel">все анкеты</a>  •  <a href="${BOT_LINK}?start=chat">чат</a>${city ? `  •  #${escapeHtml(city.hash)}` : ''}</p>`)
  lines.push(`<p><tg-spoiler>Теги: ${[...hashtag].sort(() => Math.random() - Math.random()).slice(0, anonymous ? 3 : 2).map(tag => `#${escapeHtml(tag)}`).join(' ')}</tg-spoiler></p>`)
  return lines.join('')
}

const buildRichProfileCard = (user, media, { isAdmin = false } = {}) => {
  const attachments = media.map((item, index) => ({
    id: `media_${index}`,
    media: { type: item.type, media: item.fileId }
  }))
  const mediaBlocks = attachments.map(({ id, media: item }) => item.type === 'photo'
    ? `<img src="tg://photo?id=${id}"/>`
    : `<video src="tg://video?id=${id}"></video>`).join('')

  const adminDetails = isAdmin
    ? `<p>—————<br>User data: ${user.system_username ? `@${escapeHtml(user.system_username)} ` : ''}(${escapeHtml(user.id)})</p>`
    : ''

  return {
    html: `${attachments.length > 1 ? `<tg-slideshow>${mediaBlocks}</tg-slideshow>` : mediaBlocks}${profileText(user)}${adminDetails}`,
    media: attachments
  }
}

export default buildRichProfileCard
