import { createCanvas, loadImage } from 'canvas'
import axios from 'axios'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import cBlur from 'ctx-blur'
import * as thumbsupply from 'thumbsupply'
import { nanoid } from 'nanoid'
import { fileTypeFromFile } from 'file-type'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
    , __dirname = dirname(__filename)

const rootStorage = join(__dirname, `../../storage`)

if (!fs.existsSync(rootStorage)) {
  fs.mkdirSync(rootStorage)
}

const createBlurMediaPreview = url => {
  const name = nanoid(64)
  
  let filepath = join(rootStorage, `/${name}.png`)
    , tmpfilepath = join(rootStorage, `/tmp-${name}`)

  return axios({ url, responseType: 'stream' })
            .then(response => 
              new Promise(
                resolve => 
                  response
                    .data
                    .pipe(fs.createWriteStream(tmpfilepath))
                      .on('finish', async () => {
                        try {
                          const { ext, mime } = await fileTypeFromFile(tmpfilepath)
                        
                          fs.renameSync(tmpfilepath, `${tmpfilepath}.${ext}`)
                          tmpfilepath = `${tmpfilepath}.${ext}`

                          const isVideo = !!mime.match(/video/)

                          let thumbNail = null

                          if (isVideo) {
                            thumbNail = await thumbsupply.default.generateThumbnail(tmpfilepath, {
                              size: thumbsupply.default.ThumbSize.LARGE,
                              timestamp: '50%',
                              forceCreate: true,
                              mimetype: 'video/mp4',
                            })
                          }

                          const image = await loadImage(thumbNail || tmpfilepath)

                          const width = parseInt(image.width / 10)
                              , height = parseInt(image.height / 10)

                          const canvas = createCanvas(width, height)

                          const bigCanvas = createCanvas(image.width, image.height)

                          const ctx = canvas.getContext('2d')
                          ctx.drawImage(image, 0, 0, width, height)

                          cBlur({ sigma: 0.5, radius: 2 })(canvas, (err, canvas) => {
                            if (err) {
                              resolve(false)
                              return
                            }
                            
                            const ctx = bigCanvas.getContext('2d')
                            ctx.drawImage(canvas, 0, 0, image.width, image.height)

                            bigCanvas.createPNGStream()
                              .pipe(fs.createWriteStream(filepath))
                                  .on('finish', async () => {
                                    fs.rmSync(tmpfilepath)

                                    if (thumbNail) {
                                      fs.rmSync(thumbNail)
                                    }

                                    const data = await sharp(filepath)
                                                        .resize(200)
                                                        .toBuffer()
                                      
                                    fs.rmSync(filepath)
                                    resolve(data)
                                  })
                                  .on('error', () => resolve(false))
                          })
                        } catch (e) {
                          console.log('create-blur-media-preview', e)
                          resolve(false)
                        }
                      })
                      .on('error', () => resolve(false))
              )
            )
}

export default createBlurMediaPreview