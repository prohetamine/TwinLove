import { registerFont, createCanvas, loadImage } from 'canvas'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { nanoid } from 'nanoid'

const __filename = fileURLToPath(import.meta.url)
    , __dirname = dirname(__filename)

registerFont(join(__dirname, '../assets/Inter-Bold.ttf'), { family: 'Inter-Bold' })

const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + width, y, x + width, y + height, radius)
  ctx.arcTo(x + width, y + height, x, y + height, radius)
  ctx.arcTo(x, y + height, x, y, radius)
  ctx.arcTo(x, y, x + width, y, radius)
  ctx.closePath()
  ctx.fill()
}

// eslint-disable-next-line no-async-promise-executor
const privacyMediaPreview = (filepath, config, locationUnknown) => new Promise(async resolve => {
  try {
    const name = nanoid(64)
  
    let tmpfilepath = join(__dirname, `../../storage/tmp-${name}`)

    const image = await loadImage(filepath)
        , logo = await loadImage(join(__dirname, '../assets/circle-logo.png'))
        , homeEmoji = await loadImage(join(__dirname, '../assets/home.png'))
        , mediaEmoji = await loadImage(join(__dirname, '../assets/media.png'))
        , botEmoji = await loadImage(join(__dirname, '../assets/bot.png'))

    const width = image.width * 10
        , height = image.height * 10

    const canvas = createCanvas(width, height)

    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0, width, height)

    ctx.fillStyle = 'rgba(0, 0, 0, 0.54)'
    ctx.fillRect(0, 0, width, height)

    const absoluteSize = (width > height ? height : width) / 100
    
    let scale = 80

    const px = px => parseInt(px * ((absoluteSize * scale) / 565))

    const top = ((height / 2) - (px(300 + ((config[1] && !locationUnknown) ? 15 + 60 : 0) + (config[2] ? 15 + 60 : 0) + 50 + 60) / 2))

    ctx.drawImage(logo, (width / 2) - (px(300) / 2), top, px(300), px(300))
    const myHomeAccess = top => {
      const _width = 311 

      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      drawRoundedRect(ctx, (width / 2) - (px(_width) / 2), top + px(300) + px(50), px(_width), px(60), px(30))
      
      ctx.fillStyle = '#fff'
      ctx.font = `${px(25)}px Inter-Bold`  
      ctx.fillText(`Только мой город`, (width / 2) - (px(_width) / 2) + px(23), top + px(300) + px(50) + px(39))
      
      ctx.drawImage(homeEmoji, (width / 2) - (px(_width) / 2) + px(256), top + px(300) + px(50) + px(13), px(32), px(32))
    }

    const mediaAccess = top => {
      const _width = 356 

      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      drawRoundedRect(ctx, (width / 2) - (px(_width) / 2), top + px(300) + px(50), px(_width), px(60), px(30))
      
      ctx.fillStyle = '#fff'
      ctx.font = `${px(25)}px Inter-Bold`  
      ctx.fillText(`Только с фото/видео`, (width / 2) - (px(_width) / 2) + px(23), top + px(300) + px(50) + px(39))
      
      ctx.drawImage(mediaEmoji, (width / 2) - (px(_width) / 2) + px(298), top + px(300) + px(50) + px(13), px(32), px(32))
    }

    const onlyBotAccess = top => {
      const _width = 262

      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      drawRoundedRect(ctx, (width / 2) - (px(_width) / 2), top + px(300) + px(50), px(_width), px(60), px(30))
      
      ctx.fillStyle = '#fff'
      ctx.font = `${px(25)}px Inter-Bold`  
      ctx.fillText(`Только в боте`, (width / 2) - (px(_width) / 2) + px(23), top + px(300) + px(50) + px(39))
      
      ctx.drawImage(botEmoji, (width / 2) - (px(_width) / 2) + px(205), top + px(300) + px(50) + px(13), px(32), px(32))
    }

    
    onlyBotAccess(top)
    
    if (config[1] && !locationUnknown) {
      myHomeAccess(top + px(15) + px(60)) 
    } else {
      if (config[2]) {
        mediaAccess(top + px(15) + px(60)) 
      }
    }

    if ((config[1] && !locationUnknown) && config[2]) {
      mediaAccess(top + px(15) + px(60) + px(15) + px(60)) 
    }

    ctx.fillStyle = '#ffffffaa'
    ctx.font = `${px(20)}px Inter-Bold`  
    ctx.fillText(`Условия просмотра фото*`, width - px(285), height - px(25))

    canvas.createPNGStream()
      .pipe(fs.createWriteStream(tmpfilepath))
          .on('finish', () => {
            resolve(
              fs.readFileSync(tmpfilepath)
            )
            
            fs.rmSync(tmpfilepath)
          })
          .on('error', () => resolve(false))
  } catch (e) {
    console.log('privacy-media-preview', e)
    resolve(false)
  }
})

export default privacyMediaPreview