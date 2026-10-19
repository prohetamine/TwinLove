export const richPhotoFileIds = message => {
  const ids = []
  const visit = blocks => {
    for (const block of blocks ?? []) {
      if (block.photo?.length) ids.push(block.photo.at(-1).file_id)
      else if (block.video?.file_id) ids.push(block.video.file_id)
      if (block.blocks) visit(block.blocks)
    }
  }
  visit(message?.rich_message?.blocks)
  return ids
}

const sendRichProfileCard = async ({ telegram, chatId, richMessage, replyMarkup, uploads = [] }) => {
  if (!uploads.length) {
    return telegram.callApi('sendRichMessage', {
      chat_id: chatId,
      rich_message: richMessage,
      reply_markup: replyMarkup
    })
  }

  const payload = {
    chat_id: chatId,
    rich_message: JSON.stringify(richMessage),
    reply_markup: replyMarkup
  }
  for (const { name, source } of uploads) {
    payload[name] = { source, filename: `${name}.png` }
  }
  return telegram.callApi('sendRichMessage', payload)
}

export default sendRichProfileCard
