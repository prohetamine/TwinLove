#!/usr/bin/env node
// QR-authorized smoke checks for the development bot. Session and log stay local.
import fs from 'node:fs'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import readline from 'node:readline/promises'
import { fileURLToPath } from 'node:url'
import qrcode from 'qrcode'
import telegram from 'telegram'
import sessions from 'telegram/sessions/index.js'

const { TelegramClient, Api } = telegram
const { StringSession } = sessions
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const stateDir = path.join(root, '.telegram-test')
const credentialsPath = path.join(stateDir, 'credentials.json')
const sessionPath = path.join(stateDir, 'session.txt')
const qrPath = path.join(stateDir, 'login-qr.png')
const logPath = path.join(root, 'log.txt')
const botName = 'testtllovebot'
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function log(status, step, detail = '') {
  const line = `${new Date().toISOString()} ${status} ${step}${detail ? `: ${detail}` : ''}`
  fs.appendFileSync(logPath, `${line}\n`, { mode: 0o600 })
  fs.chmodSync(logPath, 0o600)
  process.stdout.write(`${line}\n`)
}

function redact(text = '') {
  return text.replace(/https?:\/\/\S+/g, '[ссылка]')
    .replace(/\+?\d[\d ()-]{7,}\d/g, '[номер]')
    .replace(/\s+/g, ' ').slice(0, 220)
}

function credentials() {
  fs.mkdirSync(stateDir, { recursive: true, mode: 0o700 })
  fs.chmodSync(stateDir, 0o700)
  const saved = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))
  if (!/^\d+$/.test(String(saved.api_id)) || !/^[\da-f]{32}$/i.test(saved.api_hash)) {
    throw new Error('Неверный формат API ID или hash')
  }
  return { apiId: Number(saved.api_id), apiHash: saved.api_hash }
}

function saveSession(client) {
  fs.writeFileSync(sessionPath, client.session.save(), { mode: 0o600 })
  fs.chmodSync(sessionPath, 0o600)
}

async function login(client, keys) {
  await client.connect()
  if (await client.checkAuthorization()) {
    log('PASS', 'Авторизация', 'локальная сессия действительна')
    return
  }
  const terminal = readline.createInterface({ input: process.stdin, output: process.stdout })
  try {
    await client.signInUserWithQrCode(keys, {
      qrCode: async ({ token }) => {
        const url = `tg://login?token=${token.toString('base64url')}`
        await qrcode.toFile(qrPath, url, { width: 400, margin: 4 })
        fs.chmodSync(qrPath, 0o600)
        log('INFO', 'QR', `Открой Telegram → Настройки → Устройства → Подключить устройство. Файл: ${qrPath}`)
      },
      password: async () => {
        if (!process.stdin.isTTY) throw new Error('Пароль нужно ввести в локальном Terminal')
        execFileSync('stty', ['-echo'], { stdio: 'inherit' })
        try {
          return await terminal.question('Пароль двухэтапной проверки (ввод скрыт): ')
        } finally {
          execFileSync('stty', ['echo'], { stdio: 'inherit' })
          process.stdout.write('\n')
        }
      },
      onError: async error => {
        log('FAIL', 'Авторизация', error.message)
        return true
      }
    })
    saveSession(client)
    log('PASS', 'Авторизация', 'QR подтверждён, сессия сохранена локально')
  } finally {
    terminal.close()
    fs.rmSync(qrPath, { force: true })
  }
}

async function messages(client, bot, limit = 15) {
  return (await client.getMessages(bot, { limit })).filter(message => !message.out)
}

async function buttonLabels(message) {
  const rows = await message.getButtons() || []
  return rows.flat().map(button => button.text)
}

async function latestKeyboard(client, bot) {
  for (const message of await messages(client, bot, 20)) {
    if (message.replyMarkup instanceof Api.ReplyKeyboardMarkup) return message
  }
  return null
}

async function showResponse(client, bot, afterId, step) {
  for (let attempt = 0; attempt < 30; attempt++) {
    await delay(500)
    const fresh = (await messages(client, bot, 8)).find(message => message.id > afterId)
    if (!fresh) continue
    // Some actions send a sticker or a temporary waiting notice first.
    await delay(600)
    const final = (await messages(client, bot, 8)).find(message => message.id > afterId && message.message) || fresh
    log('PASS', step, redact(final.message || '[медиа]'))
    const labels = await buttonLabels(final)
    if (labels.length) log('INFO', 'Кнопки', labels.join(', '))
    return final
  }
  log('FAIL', step, 'нет ответа за 15 секунд')
  return null
}

async function send(client, bot, text, step) {
  const [last] = await client.getMessages(bot, { limit: 1 })
  await client.sendMessage(bot, { message: text })
  log('INFO', step, 'сообщение отправлено')
  return showResponse(client, bot, last?.id || 0, step)
}

async function click(client, bot, label, step) {
  const keyboard = await latestKeyboard(client, bot)
  if (!keyboard || !(await buttonLabels(keyboard)).includes(label)) {
    log('SKIP', step, `нет кнопки «${label}» в текущем меню`)
    return null
  }
  const [last] = await client.getMessages(bot, { limit: 1 })
  await keyboard.click({ text: label })
  return showResponse(client, bot, last?.id || 0, step)
}

async function clickInline(client, bot, label, step) {
  const message = (await messages(client, bot, 20)).find(item => item.replyMarkup instanceof Api.ReplyInlineMarkup)
  if (!message || !(await buttonLabels(message)).includes(label)) {
    log('SKIP', step, `нет inline кнопки «${label}»`)
    return null
  }
  const before = message.message || ''
  const answer = await message.click({ text: label })
  await delay(1200)
  const [updated] = await client.getMessages(bot, { ids: [message.id] })
  if (!updated) {
    log('INFO', step, 'исходное сообщение удалено')
  } else if (updated.message !== before) {
    log('PASS', step, redact(updated.message))
  } else {
    log('INFO', step, `сообщение не изменилось; ответ кнопки: ${redact(answer?.message || '')}`)
  }
  return updated
}

async function inspect(client, bot) {
  const recent = await messages(client, bot, 6)
  if (!recent.length) log('INFO', 'Чат', 'сообщений от бота пока нет')
  for (const message of recent.reverse()) {
    log('INFO', 'Ответ бота', redact(message.message || '[медиа]'))
    const labels = await buttonLabels(message)
    if (labels.length) log('INFO', 'Кнопки', labels.join(', '))
  }
}

async function smoke(client, bot) {
  if (!await send(client, bot, '/start', 'Запуск')) return
  await delay(1000)
  const menu = await latestKeyboard(client, bot)
  if (!menu || !(await buttonLabels(menu)).includes('Анкета')) {
    log('SKIP', 'Анкета', 'онбординг ещё не завершён; пройди его в Telegram, затем повтори smoke')
    return
  }
  for (const label of ['Правила', 'Все анкеты', 'Чат', 'Пригласить друзей']) {
    await click(client, bot, label, `Главное меню: «${label}»`)
  }
  if (await click(client, bot, 'Поддержка', 'Главное меню: «Поддержка»')) {
    await click(client, bot, 'Назад в главное меню', 'Возврат из поддержки')
  }
  if (!await click(client, bot, 'Анкета', 'Открыть анкету')) return
  if (!await click(client, bot, 'Редактировать', 'Открыть редактирование')) return
  for (const label of ['Фото/видео', 'Имя', 'Текст анкеты', 'Пол', 'Страна и город', 'Контакты', 'Уведомления', 'Видимость', 'Автоудаление']) {
    if (await click(client, bot, label, `Открыть «${label}»`)) {
      await click(client, bot, 'Назад в меню', `Возврат из «${label}»`)
    }
  }
  log('INFO', 'Итог', 'проверка завершена без публикации и изменения анкеты')
}

async function mediaCheck(client, bot) {
  if (!await send(client, bot, '/start', 'Запуск перед проверкой медиа')) return
  await delay(1000)
  if (!await click(client, bot, 'Анкета', 'Открыть анкету')) return
  if (!await click(client, bot, 'Показать', 'Предпросмотр анкеты')) return
  for (let attempt = 0; attempt < 12; attempt++) {
    await delay(2500)
    const menu = await latestKeyboard(client, bot)
    if (menu && (await buttonLabels(menu)).includes('Мои фото/видео')) break
  }
  if (!await click(client, bot, 'Мои фото/видео', 'Показать свои фото/видео')) return
  await delay(5000)
  const recent = await messages(client, bot, 10)
  const mediaCount = recent.filter(message => message.photo || message.video).length
  const notice = recent.find(message => /модерац|обработать|обработк/i.test(message.message || ''))
  log('INFO', 'Медиа', `получено медиа-сообщений: ${mediaCount}; уведомление об обработке: ${notice ? redact(notice.message) : 'не найдено среди последних ответов'}`)
}

async function referralCheck(client, bot) {
  if (!await send(client, bot, '/start', 'Запуск перед проверкой ссылок')) return
  await delay(1000)
  if (!await click(client, bot, 'Пригласить друзей', 'Открыть ссылки')) return
  // This intentionally creates one additional referral code.
  await clickInline(client, bot, 'Добавить ссылку', 'Добавить реферальную ссылку')
}

async function nameCheck(client, bot, manual = false) {
  if (!await send(client, bot, '/start', 'Запуск перед проверкой имени')) return
  await delay(1000)
  if (!await click(client, bot, 'Анкета', 'Открыть анкету')) return
  if (!await click(client, bot, 'Редактировать', 'Открыть редактирование')) return
  if (!await click(client, bot, 'Имя', 'Открыть выбор имени')) return
  if (manual) {
    if (!await click(client, bot, 'Ввести имя', 'Открыть ввод имени')) return
    const me = await client.getMe()
    if (!await send(client, bot, me.firstName, 'Сохранить введённое имя')) return
  } else if (!await click(client, bot, 'Взять из Telegram', 'Сохранить имя из Telegram')) return
  await delay(2000)
  const menu = await latestKeyboard(client, bot)
  const returned = !!menu && (await buttonLabels(menu)).includes('Пол')
  log(returned ? 'PASS' : 'FAIL', 'Возврат после сохранения имени', returned ? 'открылось меню редактирования' : 'меню редактирования не найдено')
}

async function genderCheck(client, bot) {
  if (!await send(client, bot, '/start', 'Запуск перед проверкой пола')) return
  await delay(1000)
  if (!await click(client, bot, 'Анкета', 'Открыть анкету')) return
  if (!await click(client, bot, 'Редактировать', 'Открыть редактирование')) return
  if (!await click(client, bot, 'Пол', 'Открыть выбор пола')) return
  const keyboard = await latestKeyboard(client, bot)
  const rows = await keyboard.getButtons() || []
  const selected = rows.flat().find(button =>
    String(button.button?.iconCustomEmojiId || '') === '5379730349678965304'
  )
  if (!selected) {
    log('SKIP', 'Сохранение пола', 'не удалось определить выбранное значение')
    return
  }
  if (!await click(client, bot, selected.text, 'Повторно сохранить выбранный пол')) return
  await delay(2000)
  const menu = await latestKeyboard(client, bot)
  const returned = !!menu && (await buttonLabels(menu)).includes('Имя')
  log(returned ? 'PASS' : 'FAIL', 'Возврат после сохранения пола', returned ? 'открылось меню редактирования' : 'меню редактирования не найдено')
}

async function main() {
  const [command, value] = process.argv.slice(2)
  if (!['auth', 'inspect', 'smoke', 'media', 'referral', 'name', 'name-manual', 'gender', 'send', 'click', 'inline', 'upload'].includes(command)) {
    throw new Error('Использование: npm run telegram:test -- auth|inspect|smoke|media|referral|name|name-manual|gender|send|click|inline|upload [значение]')
  }
  const keys = credentials()
  const saved = fs.existsSync(sessionPath) ? fs.readFileSync(sessionPath, 'utf8') : ''
  const client = new TelegramClient(new StringSession(saved), keys.apiId, keys.apiHash, { connectionRetries: 5 })
  try {
    if (command === 'auth') return await login(client, keys)
    await client.connect()
    if (!await client.checkAuthorization()) throw new Error('Сначала запусти auth и отсканируй QR')
    const bot = await client.getEntity(botName)
    if (!bot.bot || bot.username?.toLowerCase() !== botName) throw new Error('Неверный тестовый бот')
    if (command === 'inspect') await inspect(client, bot)
    if (command === 'smoke') await smoke(client, bot)
    if (command === 'media') await mediaCheck(client, bot)
    if (command === 'referral') await referralCheck(client, bot)
    if (command === 'name') await nameCheck(client, bot)
    if (command === 'name-manual') await nameCheck(client, bot, true)
    if (command === 'gender') await genderCheck(client, bot)
    if (command === 'send' && value) await send(client, bot, value, `Отправка «${value}»`)
    if (command === 'click' && value) await click(client, bot, value, `Нажатие «${value}»`)
    if (command === 'inline' && value) await clickInline(client, bot, value, `Inline кнопка «${value}»`)
    if (command === 'upload' && value) {
      const source = path.resolve(value)
      if (!fs.statSync(source).isFile()) throw new Error('Укажи путь к локальному файлу')
      const [last] = await client.getMessages(bot, { limit: 1 })
      await client.sendFile(bot, { file: source })
      log('INFO', 'Загрузка файла', path.basename(source))
      await showResponse(client, bot, last?.id || 0, 'Ответ после загрузки')
    }
  } finally {
    await client.disconnect()
  }
}

main().catch(error => {
  log('FAIL', 'Скрипт', error.message)
  process.exitCode = 1
})
