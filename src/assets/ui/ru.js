import { Markup } from 'telegraf'
import textScreening from './../../lib/text-screening.js'
import checkValid from '../../modules/check-valid.js'
import { CHANNEL_LINK, CHAT_LINK, BOT_LINK, IS_DEV } from '../../../configs/env.js'
import getCityById from '../../lib/get-city-by-id.js'
import hashtag from '../hash-tag.js'

const formatTip = (icon, title, description, action) =>
  `${icon} *${textScreening(title)}*\n${textScreening(description)}\n\n${textScreening(action).replaceAll('Редактировать', `${EDIT_EMOJI} Редактировать`).replaceAll('Открыть канал', `${LINK_EMOJI} Открыть канал`).replaceAll('Опубликовать', `${PUBLISH_EMOJI} Опубликовать`).replaceAll('Автоудаление', `${TRASH_EMOJI} Автоудаление`).replaceAll('👁', VIEW_EMOJI).replaceAll('📸', CAMERA_EMOJI).replaceAll('☎️', PHONE_EMOJI).replaceAll('👻', GHOST_EMOJI).replaceAll('📲', NOTIFY_EMOJI).replaceAll('🔒', LOCK_EMOJI).replaceAll('👋', WAVE_EMOJI).replaceAll('❤️', LIKE_HEART_EMOJI)}`

const escapeMarkdownCode = text => text.replace(/[\\`]/g, '\\$&')
const CHAT_ICON_CUSTOM_EMOJI_ID = '5377303280839862219'
const PROFILE_CUSTOM_EMOJI_ID = '5381935789615657235'
const VIEW_CUSTOM_EMOJI_ID = '5382019683211847894'
const VIEW_EMOJI = `![👁](tg://emoji?id=${VIEW_CUSTOM_EMOJI_ID})`
const SEARCH_EMOJI = '![🔍](tg://emoji?id=5382322143398766574)'
const CITY_EMOJI = '![🌆](tg://emoji?id=5382005003013632611)'
const BEAR_CUSTOM_EMOJI_ID = '5379773509805324225'
const WARNING_CUSTOM_EMOJI_ID = '5377304212847766937'
const WARNING_EMOJI = `![⚠️](tg://emoji?id=${WARNING_CUSTOM_EMOJI_ID})`
const ALERT_EMOJI = '![❗️](tg://emoji?id=5382046303419151366)'
const CROSS_CUSTOM_EMOJI_ID = '5379709467547969472'
const LOCATION_CUSTOM_EMOJI_ID = '5379990525912853171'
const LOCATION_EMOJI = `![📍](tg://emoji?id=${LOCATION_CUSTOM_EMOJI_ID})`
const ALL_PROFILES_CUSTOM_EMOJI_ID = '5379552576687613329'
const ALL_PROFILES_EMOJI = `![❤️](tg://emoji?id=${ALL_PROFILES_CUSTOM_EMOJI_ID})`
const LIKE_HEART_CUSTOM_EMOJI_ID = '5379960362357534919'
const LIKE_HEART_EMOJI = `![🩵](tg://emoji?id=${LIKE_HEART_CUSTOM_EMOJI_ID})`
const CHAT_EMOJI = `![💬](tg://emoji?id=${CHAT_ICON_CUSTOM_EMOJI_ID})`
const RULE_FLAG_CUSTOM_EMOJI_ID = '5379664975981753147'
const INVITE_CUSTOM_EMOJI_ID = '5379672612433601461'
const INVITE_EMOJI = `![🤝](tg://emoji?id=${INVITE_CUSTOM_EMOJI_ID})`
const PUBLISH_CUSTOM_EMOJI_ID = '5379847898638890226'
const PUBLISH_EMOJI = `![⬆️](tg://emoji?id=${PUBLISH_CUSTOM_EMOJI_ID})`
const BACK_CUSTOM_EMOJI_ID = '5379787743326941514'
const EDIT_CUSTOM_EMOJI_ID = '5380098716139038805'
const EDIT_EMOJI = `![✏️](tg://emoji?id=${EDIT_CUSTOM_EMOJI_ID})`
const SETTINGS_EMOJI = '![⚙️](tg://emoji?id=5379653882081225294)'
const CAMERA_CUSTOM_EMOJI_ID = '5379857695459288789'
const CAMERA_EMOJI = `![📸](tg://emoji?id=${CAMERA_CUSTOM_EMOJI_ID})`
const WAIT_CUSTOM_EMOJI_ID = '5381937301444143625'
const WAIT_EMOJI = `![⏳](tg://emoji?id=${WAIT_CUSTOM_EMOJI_ID})`
const PHONE_CUSTOM_EMOJI_ID = '5379762218336301013'
const PHONE_EMOJI = `![☎️](tg://emoji?id=${PHONE_CUSTOM_EMOJI_ID})`
const THUMBS_UP_EMOJI = '![👍](tg://emoji?id=5381977545287707204)'
const GHOST_CUSTOM_EMOJI_ID = '5382006102525259533'
const GHOST_EMOJI = `![👻](tg://emoji?id=${GHOST_CUSTOM_EMOJI_ID})`
const NOTIFY_CUSTOM_EMOJI_ID = '5382100845208841533'
const NOTIFY_EMOJI = `![📲](tg://emoji?id=${NOTIFY_CUSTOM_EMOJI_ID})`
const ANNOUNCE_EMOJI = '![📣](tg://emoji?id=5379898867015790188)'
const TRASH_CUSTOM_EMOJI_ID = '5379617039851762100'
const TRASH_EMOJI = `![🗑](tg://emoji?id=${TRASH_CUSTOM_EMOJI_ID})`
const CELEBRATION_EMOJI = '![🎉](tg://emoji?id=5379590131881651422)'
const CHECK_CUSTOM_EMOJI_ID = '5379730349678965304'
const CHECK_EMOJI = `![✅](tg://emoji?id=${CHECK_CUSTOM_EMOJI_ID})`
const SAVE_EMOJI = '![💾](tg://emoji?id=5380068187511500631)'
const LINK_CUSTOM_EMOJI_ID = '5379878307007343872'
const LINK_EMOJI = `![🔗](tg://emoji?id=${LINK_CUSTOM_EMOJI_ID})`
const RULE_FLAG = `![🚩](tg://emoji?id=${RULE_FLAG_CUSTOM_EMOJI_ID})`
const RULE_BULLET = '![⏺️](tg://emoji?id=5379634348569962770)'
const REFERRAL_VISITS_EMOJI = '![👞](tg://emoji?id=5380052815823547901)'
const ANON_CUSTOM_EMOJI_ID = '5381905325412625519'
const ANON_EMOJI = `![🏴‍☠️](tg://emoji?id=${ANON_CUSTOM_EMOJI_ID})`
const PICTURE_EMOJI = '![🖼](tg://emoji?id=5382184150394516505)'
const ATTACHMENT_EMOJI = '![📎](tg://emoji?id=5382138546431764504)'
const SKULL_EMOJI = '![☠️](tg://emoji?id=5382272600951005858)'
const ROBOT_EMOJI = '![🤖](tg://emoji?id=5380103526502412536)'
const SPARKLES_EMOJI = '![✨](tg://emoji?id=5382173404386338337)'
const REFRESH_CUSTOM_EMOJI_ID = '5382278940322736514'
const LOCK_CUSTOM_EMOJI_ID = '5379755951979016593'
const LOCK_EMOJI = `![🔒](tg://emoji?id=${LOCK_CUSTOM_EMOJI_ID})`
const WAVE_CUSTOM_EMOJI_ID = '5382237167470821434'
const WAVE_EMOJI = `![👋](tg://emoji?id=${WAVE_CUSTOM_EMOJI_ID})`
const withAlert = message => `${ALERT_EMOJI} ${textScreening(message)}`
const withAlertAndSparkles = message => withAlert(message).replace('✨', SPARKLES_EMOJI)

const TEXTS = {
  // TEXTS //
  hello: 'Добро пожаловать в *TwinLove*\\!\nЗдесь можно найти новых знакомых в своём городе — для общения, дружбы или отношений\\.\n\nПеред началом прочитай правила: /rules',
  hello_next: 'TwinLove развивается благодаря людям, которым близка идея простых и искренних знакомств\\.',
  hello_next_2: `Привет это снова я ${WAVE_EMOJI}\n\nЦель этого проект быть самым технологичным, честным и самым прозрачным\\.\n\nБез неких «скрытых пулов», подписок, лимитов, занижения рейтинга, теневых банов и прочего скама, все анкеты публикуются в канале реальными людьми, каждый профиль может быть зарепорчер если в нем есть проблема он будет удален или даже заблокирован\\.\n\nВ каком\\-то непоределенно далеком будущем мы стремимся к полной модерации сообществом\\.\n\n||Еще пару слов о последнем обновлении /next3||`,
  hello_next_3: 'Meow',
  home: '![🧭](tg://emoji?id=5382017247965391689) Куда теперь?',
  rules: `*Правила TwinLove* ${RULE_FLAG}\n\n` +
               `Здесь знакомятся и общаются с уважением друг к другу\\.\n\n` +
               `${RULE_BULLET} Используй анкету для знакомства, без рекламы и спама\\.\n` +
               `${RULE_BULLET} Общайся без оскорблений и угроз\\.\n` +
               `${RULE_BULLET} Пользуйся ботом, только если тебе исполнилось 18 лет [\\(*?*\\)](${textScreening(BOT_LINK)}?start\\=dating18)\n` +
               `${RULE_BULLET} Соблюдай закон\\.\n\n` +
               `За нарушение правил анкету могут удалить, а доступ к боту — ограничить\\.\n\n` +
               `Береги себя: не отправляй деньги незнакомым людям и не делись личными данными\\. Если заметил нарушение, напиши в [поддержку](${textScreening(BOT_LINK)}?start\\=support)\\.`,
  rules_dating18: `TwinLove предназначен для людей от 18 лет\\. Если тебе ещё нет 18, не используй бот\\. Заметил анкету несовершеннолетнего? Сообщи в [поддержку](${textScreening(BOT_LINK)}?start\\=support)\\.`,
  rules_vsj: withAlert('ВСЖ — в какой стране живешь.'),
  chat: `Заходи в общий чат, чтобы познакомиться и пообщаться ${CHAT_EMOJI}`,
  referal_link: (id, referals, referalsPost) => `${INVITE_EMOJI} *Пригласи друзей в TwinLove*\nОтправь ссылку человеку, которому тоже интересны знакомства:\n\n\`${escapeMarkdownCode(`${BOT_LINK}?start=${id}`)}\`\n\n${REFERRAL_VISITS_EMOJI} Перешли по ссылке: ${referals}\n${PUBLISH_EMOJI} Опубликовали анкету: ${referalsPost}`,
  channel: `*Все анкеты TwinLove* ${ALL_PROFILES_EMOJI}\n\nВ канале публикуются анкеты\\.\n\nЧтобы посмотреть контакты другого человека, тебе нужна опубликованная анкета\\.`,
  help: 'Такой команды нет, в этом меню нужно использовать кнопки, нажми ⌘ чтобы открыть меню\\.\n\nЕсли бот завис нажмите: /start',
  edit: `Выбери пункт который хочешь изменить ${SETTINGS_EMOJI}`,
  support: `*Поддержка ${WARNING_EMOJI}*\n\nРасскажи, что случилось\\. Если нужно, приложи скриншот или запись экрана — так будет проще разобраться в проблеме\\.`,
  admin: withAlert('Помогите решить проблему или зафиксировать баг, прикрепите необходимые скриншоты или запись экрана если это необходимо для помощи пользователю'),
  support_response: 'Тикет выбран',
  profile: ctx => {
    let text = `У тебя __*не заполненны*__ разделы:\n`
    text += !(ctx.user?.text > 20 && ctx.user?.text < 800) ? `• *__Текст анкеты__* ${EDIT_EMOJI}\n` : ``
    text += ctx.user?.location === '0|0' ? `• *__Страна и город__* ${LOCATION_EMOJI}\n` : ``
    text += !ctx.user?.system_username ? `• *__Контакты__* ${PHONE_EMOJI}\n` : ``
    text += `\nПерейди в раздел: «${EDIT_EMOJI} Редактировать» чтобы заполнить пробелы`
    
    return checkValid(ctx)
      ? `Анкета готова к публикации ${PUBLISH_EMOJI}`
      : text
  },
  view: 'Смотри\\! ',
  view_wait_load_media: `У тебя загружены медиа файлы, я пока не успел их обработать, дай мне немного времени, я скажу, когда всё будет готово ${WAIT_EMOJI}`,
  banned_rule_age: 'нарушение правила: возраст',
  support_message_delivery: 'Сообщение доставленно, дополните или ожидайте ответа поддержки в этом меню 📬',
  content_error: textScreening('Не могу обработать это сообщение. Пришли фото или видео обычным сообщением, не как файл.'),
  content_error_media: textScreening('Этот формат не подходит для анкеты. Пришли фото или видео обычным сообщением, не как файл.'),
  tips: [
    formatTip(PUBLISH_EMOJI, 'Как опубликовать анкету?', 'Заполненная анкета ещё не видна другим людям, пока ты её не опубликуешь.', 'Анкета → Опубликовать'),
    formatTip(ANNOUNCE_EMOJI, 'Следи за новыми анкетами', 'В канале появляются опубликованные анкеты. Подпишись, если хочешь видеть новые.', 'Все анкеты → Открыть канал'),
    formatTip(LOCK_EMOJI, 'Кто видит твои контакты', 'Ты можешь настроить доступ к контактам.', 'Анкета → Редактировать → ☎️ Контакты → 🔒 Настроить приватность'),
    formatTip(PICTURE_EMOJI, 'Кто видит твои фото и видео', 'Ты можешь настроить доступ к загруженным файлам.', 'Анкета → Редактировать → 📸 Фото/видео → 🔒 Настроить приватность'),
    formatTip(SEARCH_EMOJI, 'Проверь свои фото и видео', 'Посмотри, как выглядят загруженные файлы. Некоторые могут быть размыты до модерации.', 'Анкета → 👁 Показать → 📸 Мои фото/видео'),
    formatTip(GHOST_EMOJI, 'Скрой анкету на время', 'Когда анкета скрыта, другие не увидят её контакты и медиа. Уже опубликованный пост останется в канале.', 'Анкета → Редактировать → 👻 Видимость'),
    formatTip(ATTACHMENT_EMOJI, 'Сколько файлов можно добавить', 'В анкете может быть до пяти фото или видео. Размер каждого файла — до 15 МБ.', 'Анкета → Редактировать → 📸 Фото/видео'),
    formatTip(TRASH_EMOJI, 'Управляй старыми постами', 'Можно автоматически удалять прежние посты при публикации нового.', 'Анкета → Редактировать → Автоудаление'),
    formatTip(CAMERA_EMOJI, 'Добавь фото или видео', 'Так людям будет проще узнать тебя по анкете.', 'Анкета → Редактировать → 📸 Фото/видео'),
    formatTip(WAIT_EMOJI, 'Если фото пока не видно', 'Фото может ждать модерации. Если оно не появилось позже, загрузи его снова или напиши в поддержку.', 'Анкета → 👁 Показать → 📸 Мои фото/видео'),
    formatTip(NOTIFY_EMOJI, 'Настрой уведомления', 'Выбирай, из каких городов получать сообщения о новых анкетах, или отключи их.', 'Анкета → Редактировать → 📲 Уведомления'),
    formatTip(WAVE_EMOJI, 'Начни знакомство', 'Помаши человеку или поставь лайк. Бот отправит ему ссылку на твою анкету, если она опубликована.', 'Открой чужую анкету → 👋 Помахать или ❤️ Ты мне нравишься'),
    formatTip(VIEW_EMOJI, 'Посмотри анкету перед публикацией', 'Когда анкета заполнена, проверь, как выглядят её текст и фотографии.', 'Анкета → 👁 Показать'),
    formatTip(INVITE_EMOJI, 'Пригласи знакомых', 'По личной ссылке можно пригласить друзей и посмотреть, сколько из них опубликовали анкеты.', 'Пригласить друзей'),
  ],
  age18Confirm: withAlert('Вам 18 лет или больше?'),
  phone_request: 'Чтобы продолжить, поделись своим номером телефона через кнопку ниже. Номер сохранится в твоём профиле и не будет показан в анкете.',
  phone_other_contact: 'Пожалуйста, отправь свой номер кнопкой ниже. Контакт другого человека не подойдёт.',
  blocked: ({ system_block_message, system_block_auto }) => withAlert(`Вы заблокированны${system_block_message ? ` по причине: «${system_block_message}»` : ''}${system_block_auto ? ' это автоматическая блокировка' : ''}, если вы не согласны с блокировкой свяжитесь с поддержкой /support`),
  ban: 'Заблокирован(а)',
  unban: 'Разблокирован(а)',
  delete: 'Все посты этого пользователя удалены',
  error_delete: id => `Не удалось удалить сообщение автоматически, удалите его в ручную ${CHANNEL_LINK}/${id}`,
  profile_generate: (user, useCustomEmoji = true, isPreview = false) => {
    let text = ''
    const locationEmoji = isPreview ? '' : ` ${useCustomEmoji ? LOCATION_EMOJI : '📍'}`

    text += `${textScreening(user?.text)}\n\n`
    text += user?.location !== '999|666' ?  user?.privacyCity === 0 ? '' : user?.privacyCity === 1 ? `Мой и ближайшие города 🌇  [\\(*?*\\)](${textScreening(BOT_LINK)}?start\\=privacycity)\n` : `Только мой город 🏡  [\\(*?*\\)](${textScreening(BOT_LINK)}?start\\=privacycity)\n` : ''
    text += user?.location !== '999|666' ? `*${textScreening(getCityById(user?.location).title)} ${getCityById(user?.location).flag}*${locationEmoji}\n` : `*Анонимный ${useCustomEmoji ? ANON_EMOJI : '🏴‍☠️'}*${locationEmoji}  [\\(*?*\\)](${textScreening(BOT_LINK)}?start\\=anon)\n`
    text += `\n`
    text += `[бот](${BOT_LINK}?start=from-channel)  •  [все анкеты](${BOT_LINK}?start=channel)  •  [общий чат](${BOT_LINK}?start=chat)${user?.location !== '999|666' ? `  •  \\#${textScreening(getCityById(user?.location).hash)}` : ''}`
    text += `\n||Теги: ${[...hashtag].sort(() => Math.random() - Math.random()).slice(0, user?.location === '999|666' ? 3 : 2).map(tag => textScreening(`#${tag}`)).join(' ')}||`

    return text
  },
  demo: 'Не возможно, это твоя анкета ❌',
  view_photo_empty: 'Кажется у тебя еще нет ни одного загруженного фото/видео.. 😳',
  view_photo_with_no_approve: withAlert('Пока фото не прошли модерацию они будут выглядеть размытыми и их сможешь увидеть только ты'),
  publish_profile_request: withAlert('У вас есть фото/видео которые не прошли модерацию и не будут отображаться в анкете пока не пройдут модерацию, вы точно хотите опубликовать профиль в канал без фото?'),
  publish_profile_complete: `Готово, анкета опубликована ${CELEBRATION_EMOJI}`,
  publish_profile_timeout: (outTime, textTime) => `Постить анкету можно только раз в ${textTime}, приходи через: __*${outTime}*__ ${WAIT_EMOJI}`,
  publish_profile_moderation_request: 'Анкета будет опубликована сразу после модераци 👌',
  publish_profile_moderation_reject_request: withAlert('Анкета отклонена модератором, для обжалования свяжитесь с поддержкой /support'),
  publish_profile_moderation_ok: 'Выполнено',
  post_in_city: type => `Только что кто\\-то${type === 1 ? ' из твоего города' : type === 2 ? ' из твоего города или ближайшего' : ''} опубликовал анкету 😊`,
  contact: (id, username) => `Контакт __*[${textScreening(username ? `@${username}` : '@username')}](tg://user?id=${id})*__ ${textScreening(`человека с которым ты хочешь познакомиться, пиши скорее!`)}`,
  media_empty: 'У этого пользователя нет ни одного загруженного фото/видео\\.\\.\\. 😒',
  hello_hand: `Кто\\-то помахал ${WAVE_EMOJI} тебе, он или она хочет чтоб ты написал\\(а\\) ему/eй\\. Хочешь посмотреть его/eё анкету?`,
  hello_like: `Кто\\-то поставил тебе лайк ${LIKE_HEART_EMOJI} тебе, ты нравишься кому\\-то он/она хочет чтоб ты написал\\(а\\) ему/eй\\. Хочешь посмотреть его/eё анкету?`,
  hello_hand_confirmed: 'Теперь остается только ждать что тебе напишут, потерпи или напиши сам\\(а\\)\\!',
  hello_like_confirmed: 'Теперь остается только ждать что тебе напишут, потерпи или напиши сам\\(а\\)\\!',
  hello_error: `Какая\\-то ошибка, этому человеку нельзя больше помахать\\.\\.\\. ${SKULL_EMOJI}`,
  hello_like_error: `Какая\\-то ошибка, этому человеку нельзя больше поставить лайк\\.\\.\\. ${SKULL_EMOJI}`,
  hello_hidden: 'Этому человеку пока нельзя помахать, он скрыл свой профиль 🤔',
  hello_like_hidden: 'Этому человеку пока нельзя поставить лайк, он скрыл свой профиль 🤔',
  hello_hand_used: 'Вы уже помахали этому человеку, это действие нельзя повторить с одним и тем же человеком снова 📵',
  hello_like_used: 'Вы уже поставили лайк этому человеку, это действие нельзя повторить с одним и тем же человеком снова 📵',
  error_profile_notfound: 'Ваша анкета не найдена, вы не можете просматривать чужие анкеты пока не опубликуете свою хотя бы раз 🤔',
  contact_error: `Какая\\-то ошибка, этому человеку больше нельзя написать\\.\\.\\. ${SKULL_EMOJI}`,
  contact_hidden: 'Этому человеку пока нельзя написать, он скрыл свои контакты 🤔', 
  media_error: `Какая\\-то ошибка, фото/видео этого человека больше нельзя просмотреть\\.\\.\\. ${SKULL_EMOJI}`,
  media_hidden: 'Фото/видео этого человека пока нельзя просмотреть, он скрыл свои медиа 🤔', 
  contact_error_privacy: type => `Контакты этого человека доступны только: ${type === 1 ? '«из моего и ближайших городов 🌇»' : '«только из моего города 🏡»'}`,
  media_error_privacy: (city, media) => `Чтобы видеть фото/видео этого человека вам нужно также подходить под эти параметры: ${[city ? '«людям из моего города 🏡»' : null, media ? `«людям с фото/видео ${CAMERA_EMOJI}»` : null].filter(f => f).join(' и ')}`,
  fulled_not_publish: withAlertAndSparkles('Твоя анкета еще не опубликована\n\nАнкета заполнена, осталось только опубликовать ✨\n\nНажми /start чтобы начать'),
  not_fulled_not_publish: withAlertAndSparkles('Твоя анкета еще не опубликована\n\nПора заполнить анкету и останется только опубликовать ✨\n\nНажми /start чтобы начать'),
  admin_bot: 'Назначен администратором бота', 
  un_admin_bot: 'Разжалован из администраторов бота', 
  support_bot: 'Назначен поддержкой бота',
  un_support_bot: 'Разжалован из поддержки бота',
  not_user_set_admin: 'Вы не можете выдать этому пользователю роль', 
  reload: 'Перезагружаю систему...',
  status: 'Все ок',
  mod_info: `
/commands — команды 
/reload — перезагрузка бота
/status — статус работы бота
/ban 12345678 — банит пользователя по id аккаунта в телеграм
/unban 12345678 — разбанивает пользователя по id аккаунта в телеграм
/delete 12345678 — удаляет все анкеты пользователя по id аккаунта в телеграм
/setadmin 12345678 — назначает администратора по id аккаунта в телеграм (может модерировать посты, фото и все остальное)
/unadmin 12345678 — разжалует администратора по id аккаунта в телеграм
/setsupport 12345678 — назначает поддержку по id аккаунта в телеграм (получает жалобы на посты, может разбанить, удалить посты, смотреть статус)
/unsupport 12345678 — разжалует поддержку по id аккаунта в телеграм`,
  hello_action: 'Человеку прийдет уведомелние о том что вы помахали ему или поставили лайк с ссылкой на вашу анкету 👀',

  // BUTTONS //
  profile_btn: 'Анкета',
  channel_btn: 'Все анкеты',
  view_profile_btn: 'Показать',
  chat_btn: 'Общий чат',
  rules_btn: 'Правила',
  support_btn: 'Поддержка',
  referal_link_btn: 'Пригласить друзей',
  edit_profile_btn: 'Редактировать',
  pubish_profile_btn: 'Опубликовать',
  back_to_menu_btn: 'Назад в меню',
  back_to_main_menu_btn: 'Назад в главное меню',
  open_link_in_channel_btn: 'Открыть канал',
  open_link_in_start_channel_btn: 'Все анкеты',
  open_link_in_chat_btn: 'Открыть чат',
  tip_inline_refresh_btn: 'Еще',
  tip_inline_hidden_btn: 'Скрыть',
  support_inline_btn: 'Ответить',
  age18Confirm_btn_1: 'Нет, мне меньше 18 лет',
  age18Confirm_btn_2: 'Да, мне 18 или больше лет',
  phone_request_btn: 'Поделиться номером телефона',
  rules_confirm_btn: 'Согласен(a)',
  rules_no_confirm_btn: 'Не согласен(а)',
  write_inline_btn: 'Написать',
  write_inline_btn_channel: '✏️',
  hello_hand_inline_btn: '👋',
  report_inline_btn: '⚠️',
  write_btn: `Здесь можно просмотреть контакты, фото или видео человека которому хотите написать ${EDIT_EMOJI}`,
  hello_btn: `Не знаешь с чего начать? Поздоровайся или поставь лайк\\! ${WAVE_EMOJI} ${LIKE_HEART_EMOJI} [\\(*?*\\)](${textScreening(BOT_LINK)}?start\\=hello)`,
  report_btn: 'Пожаловаться на анкету',
  my_media_btn: 'Мои фото/видео',
  my_profile_btn: 'Моя анкета',
  profile_publish_confirm_request_btn: 'Все равно опубликовать',
  profile_publish_auto_btn: 'Опубликовать автоматически',
  open_link_btn: 'Открыть',
  contact_btn: 'Контакты',
  media_btn: 'Фото/видео',
  long_hello_btn: 'Помахать',
  like_btn: 'Ты мне нравишься',
  report_profile_btn: 'Пожаловаться на анкету',
  report_user_btn: 'Пожаловаться на поведение',

  // EDIT MENU //
  edit_profile_update: `Сохранил ${SAVE_EMOJI}`,
  edit_profile_privacy_btn: 'Настроить приватность',
  edit_profile_text_btn: 'Текст анкеты',
  edit_profile_text: `Расскажи о себе в вольной форме или по шаблону, ниже в следующем сообщении будет будет шаблон по которому лучше всего написать о себе ${EDIT_EMOJI}`,
  edit_profile_text_tmp: '1. Сколько тебе лет и из какого ты города?\n2. Чем ты увлекаешься и как любишь проводить свободное время?\n3. С кем хочешь познакомиться?\n4. Что для тебя важно в общении или отношениях?\n5. Что ещё стоит о тебе узнать?',
  edit_profile_text_error_length: 'Слишком коротко, попробуй еще раз\\.\\.\\. 📏', 
  edit_profile_text_error_length_long: '«Краткость — сестра таланта» текст должен быть не длиннее чем 800 символов 📏',

  edit_profile_location_btn: 'Страна и город',
  edit_profile_location: `Отправьте геолокацию кнопкой «Поделиться геопозицией» ${LOCATION_EMOJI} чтоб мы могли определить ближайщие к тебе города ${CITY_EMOJI} [\\(*?*\\)](${textScreening(BOT_LINK)}?start\\=geo)`,
  edit_profile_location_help: `${ALERT_EMOJI} Мы не храним и не передаем твое точное местоположение которое получаем от Телеграм\\.\n\n${LOCATION_EMOJI} Геоданные используются только один раз для установления ближайших городов это происходит локально без обращения к сторонним сервисам 🔐`,
  edit_profile_location_anon: `Ты точно хочешь остаться анониным? Никто не будет видеть твой город и твое местоположение, но также:\n\n• Мы не разошлем анкету нашим пользователям как уведомление в бота ${ROBOT_EMOJI}\n\n• Анкета отобразится в __*[канале](${CHANNEL_LINK})*__ без хештега города 🌇\n\n• Посмотреть контакты возможно будет только у пользователей с настройкой приватности «Всем»\n\n• Анкета будет опубликованна только после модерации ${SEARCH_EMOJI}`,
  edit_profile_location_anon_help: `В этой анкете нет настоящего города, владелец анкеты пожелал остаться анонимным, будь осторожен\\(а\\) береги себя ${LIKE_HEART_EMOJI}`,
  edit_profile_location_city: 'Выберите ближайший к вам город из списка меню 📶',
  edit_profile_location_btn_1: 'Поделиться геопозицией',
  edit_profile_location_btn_2: 'Хочу остаться анонимным',
  edit_profile_location_btn_3: 'Да',
  edit_profile_location_btn_4: 'Нет',

  edit_profile_media_btn: 'Фото/видео',
  edit_profile_media: allowCount => allowCount !== 0 ? `Хочешь добавить фото/видео к профилю? Можно загрузить еще ${allowCount} фото/видео ${CAMERA_EMOJI}` : `Упс, кончилось место для фото/видео ${CAMERA_EMOJI}, может стоит удалить? ${TRASH_EMOJI}`,
  edit_profile_media_btn_2: 'Удалить фото/видео',
  edit_profile_media_additional: `Загружено\\!`,
  edit_profile_media_question: allowCount => `Хочешь загрузить еще? Можно загрузить еще ${allowCount} фото/видео ${CAMERA_EMOJI}`,
  edit_profile_media_remove: allowCount => `Медиа удалены теперь можно добавить ${allowCount} фото/видео ${CAMERA_EMOJI}`,
  edit_profile_media_error: 'Что\\-то тут не так\\.\\.\\. я не могу это загрузить или обработать, я принимаю только фото и видео \\(до 15мб\\) 😢',
  edit_profile_media_resolve_inline_btn: 'Одобрить',
  edit_profile_media_reject_inline_btn: 'Отклонить',
  edit_profile_media_people_inline_btn: 'Человек',
  edit_profile_media_no_people_inline_btn: 'Без человека',
  edit_profile_media_not_found: 'Не существует ❌',
  edit_profile_media_ok: 'Изменено',

  edit_profile_media_approve: id => `Фото или видео одобренно${id ? ` (mediaID: ${id})` : ''}`,
  edit_profile_media_reject: id => `Фото или видео заблокированно, для обжалования свяжитесь с поддержкой /support${id ? ` (mediaID: ${id})` : ''}`,
  edit_profile_media_privacy: 'Выберите пункты которые будут отвечать за отображение фото/видео:',
  edit_profile_media_privacy_all_btn: () => 'Видны всем',
  edit_profile_media_privacy_settings_btn: () => 'Видны в боте',
  edit_profile_media_privacy_city_btn: () => 'Людям из моего города',
  edit_profile_media_privacy_media_btn: () => 'Людям с фото/видео',
  edit_profile_media_privacy_error_select: 'Этот вариант уже выбран',

  edit_profile_contact_btn: 'Контакты',
  edit_profile_contact: isUsername => isUsername ? `У вас установлен username ${THUMBS_UP_EMOJI} это нужно чтоб тебе могли написать ${LINK_EMOJI}` : `У вас не установлен username 👎 установи его чтобы продолжить, это нужно чтоб тебе могли написать ${LINK_EMOJI}\n\n__*[Как установить username в Телеграм](https://dzen.ru/a/ZLZzSY55_nT7X7Lz)*__`,
  edit_profile_contact_confirm_btn: 'Установил(а)',
  edit_profile_contact_error: 'Username все еще не установлен\\.\\. @',
  edit_profile_contact_privacy: `Кому видны твои контакты? ${PHONE_EMOJI}`,
  edit_profile_contact_privacy_help: `Некоторые пользователи ограничивают доступ к своим контактам по гео позиции\\. Настроить эту функцию можно в разделе «Анкета → ${EDIT_EMOJI} Редактировать → ${PHONE_EMOJI} Контакты → ${LOCK_EMOJI} Настроить приватность»`,
  edit_profile_contact_privacy_btn_1: () => 'Всем',
  edit_profile_contact_privacy_btn_2: () => 'Из моего и ближайших городов',
  edit_profile_contact_privacy_btn_3: () => 'Только из моего города',

  edit_profile_notification_btn: 'Уведомления',
  edit_profile_notification: `Хочешь получать уведомление в бота если кто\\-то публикует анкету? ${NOTIFY_EMOJI} [\\(*?*\\)](${textScreening(BOT_LINK)}?start\\=nonotify)`,
  edit_profile_notification_help: `${textScreening('Мы дорожим тобой')} ${LIKE_HEART_EMOJI} ${textScreening('и не хотим беспокоить без повода. Если ты не хочешь получать уведомления, не нужно блокировать или удалять бота. Просто нажми кнопку «')}${CHECK_EMOJI} ${textScreening('Не присылать уведомления».')}`,
  edit_profile_notification_btn_1: () => 'Не присылать уведомления',
  edit_profile_notification_btn_2: () => 'Только из моего города',
  edit_profile_notification_btn_3: () => 'Из моего города и рядом',
  edit_profile_notification_btn_4: () => 'Из любого города мира',

  edit_profile_visibility_btn: 'Видимость',
  edit_profile_visibility: `Если ваша анкета будет скрыта, ваши контакты нельзя будет посмотереть также как: фото/видео, «помахать вам» и вы не сможете смотреть чужие контакты ${PHONE_EMOJI}`,
  edit_profile_visibility_stop: `${ALERT_EMOJI} Анкета не может быть опубликована если она скрыта 🤔\n\nПерейдите раздел «Анкета → ${EDIT_EMOJI} Редактировать → ${GHOST_EMOJI} Видимость» измените «Отображать анкету»`,
  edit_profile_visibility_btn_1: () => 'Отображать анкету',
  edit_profile_visibility_btn_2: () => 'Скрыть анкету',

  edit_profile_autodelete_btn: 'Автоудаление',
  edit_profile_autodelete: 'Ваши старые пост\\(ы\\) будут мгновенно удаляться в момент публикации новых постов',
  edit_profile_autodelete_btn_1: () => 'Удалять автоматически',
  edit_profile_autodelete_btn_2: () => 'Накапливать посты',
}

const MEDIA = {
  logo: IS_DEV ? 'DQACAgQAAxkDAAInLGYclXwTkLW0_UQb8OhVTLkxUr1mAALeEwAC1g3pUEq5BHb4_I_xNAQ' : 'DQACAgIAAxkDAAEB9DdmHoVctgKv3vFdtqLimPkGdA-Z4AACIksAAjUm8EhfqT3lKGBlAAE0BA',
  help: IS_DEV ? 'AgACAgIAAxkBAAIGTGgfz5aWQO5FNqFiOMDz4YH7bxHWAAJ--zEbiaUAAUk9PoYhlvbcdwEAAwIAA3gAAzYE' : 'AgACAgIAAxkDAAEB9DpmHoYDJ__nQCB9z84CKWnADk1IWAACzdcxGzUm8EjvISbsyh8VuAEAAwIAA3gAAzQE',
  logo_gif: IS_DEV ? 'BQACAgQAAxkDAAJSDWYqNIG_LgABxe6_kJKn4Z6xsYDHBAACAxMAAmKuUFE-fkHPDYzB0zQE' : 'BQACAgIAAxkDAAECB2BmKjUqVOGfS_wc4iTU85Wjrp_XnwACXEkAAouBWUmPPznnB4GeFDQE',
  channel_bg: IS_DEV ? 'AgACAgQAAxkBAAKNvGZJjr3uHPEN51jkEdGd8dO_bRlOAAJvwjEbFRBIUlpQ5FzlJ20bAQADAgADeQADNQQ' : 'AgACAgQAAxkBAAECSm9mRFjbfvT4-MP58Zh6YZo6zUuCRQACu8IxG09ZIFIttI17GJzoGAEAAwIAA3kAAzUE',
  support_bg: IS_DEV ? 'AgACAgQAAxkBAAKN5mZJj45Ls8vSLjZaTp04JcDd0xzvAAJxwjEbFRBIUsSRp5CS896WAQADAgADeQADNQQ' : 'AgACAgQAAxkBAAECSp1mRF3nT85iJIOEf_soOiUp0jIg3gACxMIxG09ZIFLOpuV9cTOLFwEAAwIAA3kAAzUE',
  rules_bg: IS_DEV ? 'AgACAgQAAxkBAAKN6GZJj6EUHZk1KSIdSipt6BsYmGCxAAJywjEbFRBIUmN7_FTN2rhXAQADAgADeQADNQQ' : 'AgACAgQAAxkBAAECSs9mRGZ2zcgWBz9YuuAgZMzd8QlpfAACz8IxG09ZIFLo9sMl42QVzAEAAwIAA3kAAzUE',
}

const BACK_TO_MENU_BUTTON = { text: TEXTS.back_to_menu_btn, icon_custom_emoji_id: BACK_CUSTOM_EMOJI_ID }
const BACK_TO_MAIN_MENU_BUTTON = { text: TEXTS.back_to_main_menu_btn, icon_custom_emoji_id: BACK_CUSTOM_EMOJI_ID }
const optionButton = (text, selected, defaultIconId) => ({
  text,
  ...(selected || defaultIconId ? { icon_custom_emoji_id: selected ? CHECK_CUSTOM_EMOJI_ID : defaultIconId } : {})
})

const main_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard([
    [
      { text: TEXTS.profile_btn, icon_custom_emoji_id: PROFILE_CUSTOM_EMOJI_ID },
      { text: TEXTS.channel_btn, icon_custom_emoji_id: ALL_PROFILES_CUSTOM_EMOJI_ID }
    ],
    [
      { text: TEXTS.rules_btn, icon_custom_emoji_id: RULE_FLAG_CUSTOM_EMOJI_ID },
      { text: TEXTS.support_btn, icon_custom_emoji_id: WARNING_CUSTOM_EMOJI_ID }
    ],
    [
      { text: TEXTS.chat_btn, icon_custom_emoji_id: CHAT_ICON_CUSTOM_EMOJI_ID },
      { text: TEXTS.referal_link_btn, icon_custom_emoji_id: INVITE_CUSTOM_EMOJI_ID }
    ]
  ]).resize().reply_markup
}

const profile_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard([
    [{ text: TEXTS.pubish_profile_btn, icon_custom_emoji_id: PUBLISH_CUSTOM_EMOJI_ID }, { text: TEXTS.view_profile_btn, icon_custom_emoji_id: VIEW_CUSTOM_EMOJI_ID }],
    [{ text: TEXTS.edit_profile_btn, icon_custom_emoji_id: EDIT_CUSTOM_EMOJI_ID }],
    [BACK_TO_MAIN_MENU_BUTTON]
  ]).resize().reply_markup
}

const edit_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard([
    [{ text: TEXTS.edit_profile_text_btn, icon_custom_emoji_id: EDIT_CUSTOM_EMOJI_ID }],
    [{ text: TEXTS.edit_profile_location_btn, icon_custom_emoji_id: LOCATION_CUSTOM_EMOJI_ID }],
    [{ text: TEXTS.edit_profile_media_btn, icon_custom_emoji_id: CAMERA_CUSTOM_EMOJI_ID }],
    [{ text: TEXTS.edit_profile_contact_btn, icon_custom_emoji_id: PHONE_CUSTOM_EMOJI_ID }],
    [{ text: TEXTS.edit_profile_notification_btn, icon_custom_emoji_id: NOTIFY_CUSTOM_EMOJI_ID }],
    [{ text: TEXTS.edit_profile_visibility_btn, icon_custom_emoji_id: GHOST_CUSTOM_EMOJI_ID }],
    [{ text: TEXTS.edit_profile_autodelete_btn, icon_custom_emoji_id: TRASH_CUSTOM_EMOJI_ID }],
    [BACK_TO_MENU_BUTTON]
  ]).resize().reply_markup
}

const edit_profile_text_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard([
    [BACK_TO_MENU_BUTTON]
  ]).resize().reply_markup
}

const edit_profile_location_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard(
    [
      [{ ...Markup.button.locationRequest(TEXTS.edit_profile_location_btn_1), icon_custom_emoji_id: LOCATION_CUSTOM_EMOJI_ID }],
      [{ text: TEXTS.edit_profile_location_btn_2, icon_custom_emoji_id: ANON_CUSTOM_EMOJI_ID }],
      [BACK_TO_MENU_BUTTON]
    ]
  ).resize().reply_markup
}

const edit_profile_location_anon_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard(
    [
      [{ text: TEXTS.edit_profile_location_btn_3, icon_custom_emoji_id: ANON_CUSTOM_EMOJI_ID }],
      [{ ...Markup.button.locationRequest(TEXTS.edit_profile_location_btn_4), icon_custom_emoji_id: LOCATION_CUSTOM_EMOJI_ID }],
      [BACK_TO_MENU_BUTTON]
    ]
  ).resize().reply_markup
}

const edit_profile_location_city_menu = citys => ({
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard([
    ...citys.map(city => [{ text: city, icon_custom_emoji_id: LOCATION_CUSTOM_EMOJI_ID }]),
    [BACK_TO_MENU_BUTTON]
  ]).resize().reply_markup
})

const edit_profile_media_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard(
    [
      [{ text: TEXTS.edit_profile_privacy_btn, icon_custom_emoji_id: LOCK_CUSTOM_EMOJI_ID }],
      [{ text: TEXTS.edit_profile_media_btn_2, icon_custom_emoji_id: TRASH_CUSTOM_EMOJI_ID }],
      [BACK_TO_MENU_BUTTON]
    ]
  ).resize().reply_markup
}

const edit_profile_contact_menu = isUsername => ({
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard(
    [
      [
        isUsername 
          ? { text: TEXTS.edit_profile_privacy_btn, icon_custom_emoji_id: LOCK_CUSTOM_EMOJI_ID }
          : { text: TEXTS.edit_profile_contact_confirm_btn, icon_custom_emoji_id: CHECK_CUSTOM_EMOJI_ID }
      ],
      [BACK_TO_MENU_BUTTON]
    ]
  ).resize().reply_markup
})

const edit_profile_contact_privacy_menu = select => ({
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard(
    [
      [optionButton(TEXTS.edit_profile_contact_privacy_btn_1(), select === 0)],
      [optionButton(TEXTS.edit_profile_contact_privacy_btn_2(), select === 1)],
      [optionButton(TEXTS.edit_profile_contact_privacy_btn_3(), select === 2)],
      [BACK_TO_MENU_BUTTON]
    ]
  ).resize().reply_markup
})

const edit_profile_notification_menu = select => ({
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard(
    [
      [optionButton(TEXTS.edit_profile_notification_btn_4(), select === 3)],
      [optionButton(TEXTS.edit_profile_notification_btn_3(), select === 2)],
      [optionButton(TEXTS.edit_profile_notification_btn_2(), select === 1)],
      [optionButton(TEXTS.edit_profile_notification_btn_1(), select === 0)],
      [BACK_TO_MENU_BUTTON]
    ]
  ).resize().reply_markup
})

const edit_profile_visibility_menu = isHidden => ({
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard(
    [
      [optionButton(TEXTS.edit_profile_visibility_btn_1(), !isHidden)],
      [optionButton(TEXTS.edit_profile_visibility_btn_2(), isHidden)],
      [BACK_TO_MENU_BUTTON]
    ]
  ).resize().reply_markup
})

const edit_profile_autodelete_menu = isRemove => ({
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard(
    [
      [optionButton(TEXTS.edit_profile_autodelete_btn_1(), isRemove)],
      [optionButton(TEXTS.edit_profile_autodelete_btn_2(), !isRemove)],
      [BACK_TO_MENU_BUTTON]
    ]
  ).resize().reply_markup
})

const view_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard([
    [{ text: TEXTS.my_profile_btn, icon_custom_emoji_id: PROFILE_CUSTOM_EMOJI_ID }],
    [{ text: TEXTS.my_media_btn, icon_custom_emoji_id: CAMERA_CUSTOM_EMOJI_ID }],
    [BACK_TO_MENU_BUTTON]
  ]).resize().reply_markup
}

const age18Confirm_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard([
    [TEXTS.age18Confirm_btn_1],
    [TEXTS.age18Confirm_btn_2],
    [BACK_TO_MAIN_MENU_BUTTON]
  ]).resize().reply_markup
}

const phone_menu = {
  reply_markup: Markup.keyboard([
    [{ ...Markup.button.contactRequest(TEXTS.phone_request_btn), icon_custom_emoji_id: PHONE_CUSTOM_EMOJI_ID }]
  ]).resize().reply_markup
}

const rules_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard([
    [{ text: TEXTS.rules_confirm_btn, icon_custom_emoji_id: CHECK_CUSTOM_EMOJI_ID }],
    [{ text: TEXTS.rules_no_confirm_btn, icon_custom_emoji_id: CROSS_CUSTOM_EMOJI_ID }],
    [BACK_TO_MAIN_MENU_BUTTON]
  ]).resize().reply_markup
}

const profile_publish_confirm_request_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard([
    [{ text: TEXTS.profile_publish_confirm_request_btn, icon_custom_emoji_id: PUBLISH_CUSTOM_EMOJI_ID }],
    [{ text: TEXTS.profile_publish_auto_btn, icon_custom_emoji_id: WAIT_CUSTOM_EMOJI_ID }],
    [BACK_TO_MENU_BUTTON]
  ]).resize().reply_markup
}

const contact_write_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard([
    [{ text: TEXTS.contact_btn, icon_custom_emoji_id: PHONE_CUSTOM_EMOJI_ID }],
    [{ text: TEXTS.media_btn, icon_custom_emoji_id: CAMERA_CUSTOM_EMOJI_ID }],
    [BACK_TO_MAIN_MENU_BUTTON]
  ]).resize().reply_markup
}

const contact_report_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard([
    [{ text: TEXTS.report_profile_btn, icon_custom_emoji_id: WARNING_CUSTOM_EMOJI_ID }],
    [{ text: TEXTS.report_user_btn, icon_custom_emoji_id: WARNING_CUSTOM_EMOJI_ID }],
    [BACK_TO_MAIN_MENU_BUTTON]
  ]).resize().reply_markup
}

const contact_hello_menu = {
  parse_mode: 'MarkdownV2',
   disable_web_page_preview: true,
  reply_markup: Markup.keyboard([
    [{ text: TEXTS.long_hello_btn, icon_custom_emoji_id: WAVE_CUSTOM_EMOJI_ID }],
    [{ text: TEXTS.like_btn, icon_custom_emoji_id: LIKE_HEART_CUSTOM_EMOJI_ID }],
    [BACK_TO_MAIN_MENU_BUTTON]
  ]).resize().reply_markup
}

const back_to_main_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard(
    [
      [BACK_TO_MAIN_MENU_BUTTON]
    ]
  ).resize().reply_markup
}

const channel_start_inline = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.inlineKeyboard([
    [{ text: TEXTS.open_link_in_start_channel_btn, icon_custom_emoji_id: LINK_CUSTOM_EMOJI_ID, url: CHANNEL_LINK }]
  ]).reply_markup
}

const channel_inline = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.inlineKeyboard([
    [{ text: TEXTS.open_link_in_channel_btn, icon_custom_emoji_id: LINK_CUSTOM_EMOJI_ID, url: CHANNEL_LINK }]
  ]).reply_markup
}

const chat_inline = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.inlineKeyboard([
    [{ text: TEXTS.open_link_in_chat_btn, icon_custom_emoji_id: LINK_CUSTOM_EMOJI_ID, url: CHAT_LINK }]
  ]).reply_markup
}

const tips_inline_menu = {
  parse_mode: 'MarkdownV2',
  disable_web_page_preview: true,
  reply_markup: {
    inline_keyboard: [
      [
        { text: TEXTS.tip_inline_refresh_btn, icon_custom_emoji_id: REFRESH_CUSTOM_EMOJI_ID, callback_data: `tip_refresh` },
        { text: TEXTS.tip_inline_hidden_btn, icon_custom_emoji_id: CROSS_CUSTOM_EMOJI_ID, callback_data: `tip_hidden` }
      ]
    ]
  }
}

const support_inline_menu = id => ({
  parse_mode: 'MarkdownV2',
  disable_web_page_preview: true,
  reply_markup: {
    inline_keyboard: [
      [{ text: TEXTS.support_inline_btn, callback_data: `support_${id}` }]
    ]
  }
})

const edit_profile_media_admin_approve_inline = (id, mediaId, isPeople) => ({
  parse_mode: 'MarkdownV2',
  disable_web_page_preview: true,
  reply_markup: {
    inline_keyboard: [
        [
          { text: TEXTS.edit_profile_media_resolve_inline_btn, icon_custom_emoji_id: CHECK_CUSTOM_EMOJI_ID, callback_data: `res_${id}_${mediaId}` },
          { text: TEXTS.edit_profile_media_reject_inline_btn, icon_custom_emoji_id: CROSS_CUSTOM_EMOJI_ID, callback_data: `rej_${id}_${mediaId}` },
          { 
            text: isPeople 
                    ? TEXTS.edit_profile_media_people_inline_btn 
                    : TEXTS.edit_profile_media_no_people_inline_btn,
            icon_custom_emoji_id: isPeople ? PROFILE_CUSTOM_EMOJI_ID : BEAR_CUSTOM_EMOJI_ID,
            callback_data: isPeople 
                              ? `people_${id}_${mediaId}` 
                              : `nopeople_${id}_${mediaId}` 
          },
        ]
      ]
  }
})

const edit_profile_media_privacy_inline_menu = ([access, city, media]) => ({
  parse_mode: 'MarkdownV2',
  reply_markup: {
    inline_keyboard: access 
      ? [
        [{ ...optionButton(TEXTS.edit_profile_media_privacy_all_btn(), !access), callback_data: `mediaprivacy_0_${city ? 1 : 0}_${media ? 1 : 0}` }],
        [{ ...optionButton(TEXTS.edit_profile_media_privacy_settings_btn(), !!access), callback_data: `mediaprivacy_1_${city ? 1 : 0}_${media ? 1 : 0}` }],
        [{ ...optionButton(TEXTS.edit_profile_media_privacy_city_btn(), !!city), callback_data: `mediaprivacy_1_${!city ? 1 : 0}_${media ? 1 : 0}` }],
        [{ ...optionButton(TEXTS.edit_profile_media_privacy_media_btn(), !!media), callback_data: `mediaprivacy_1_${city ? 1 : 0}_${!media ? 1 : 0}` }]
      ]  
      : [
        [{ ...optionButton(TEXTS.edit_profile_media_privacy_all_btn(), !access), callback_data: `mediaprivacy_0_${city ? 1 : 0}_${media ? 1 : 0}` }],
        [{ ...optionButton(TEXTS.edit_profile_media_privacy_settings_btn(), !!access), callback_data: `mediaprivacy_1_${city ? 1 : 0}_${media ? 1 : 0}` }]
      ]
  }
})

const profile_generate_inline = ({ isPreview = false, isChannel = false, id }) => ({
  parse_mode: 'MarkdownV2',
  disable_web_page_preview: true,
  reply_markup: {
    inline_keyboard: isPreview
      ? [
        [
          { text: TEXTS.write_inline_btn, icon_custom_emoji_id: EDIT_CUSTOM_EMOJI_ID, callback_data: `w_${id}` },
          { text: TEXTS.hello_hand_inline_btn, callback_data: `h_${id}` },
          { text: TEXTS.report_inline_btn, callback_data: `r_${id}` }
        ]
      ]
      : [
        [
          { text: isChannel ? TEXTS.write_inline_btn_channel : TEXTS.write_inline_btn, ...(!isChannel ? { icon_custom_emoji_id: EDIT_CUSTOM_EMOJI_ID } : {}), url: `${BOT_LINK}?start=w_${id}` },
          { text: TEXTS.hello_hand_inline_btn, url: `${BOT_LINK}?start=h_${id}` },
          { text: TEXTS.report_inline_btn, url: `${BOT_LINK}?start=r_${id}` }
        ]
      ]
  }
})

const profile_generate_moderation_inline = id => ({
  parse_mode: 'MarkdownV2',
  disable_web_page_preview: true,
  reply_markup: {
    inline_keyboard: [
        [
          { text: TEXTS.edit_profile_media_resolve_inline_btn, icon_custom_emoji_id: CHECK_CUSTOM_EMOJI_ID, callback_data: `profileres_${id}` },
          { text: TEXTS.edit_profile_media_reject_inline_btn, icon_custom_emoji_id: CROSS_CUSTOM_EMOJI_ID, callback_data: `profilerej_${id}` },
        ]
      ]
  }
})

const show_in_channel = id => ({
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.inlineKeyboard([
    [{ text: TEXTS.open_link_btn, icon_custom_emoji_id: LINK_CUSTOM_EMOJI_ID, url: `${CHANNEL_LINK}/${id}` }]
  ]).reply_markup
})

const remove_menu = {
  parse_mode: 'HTML',
  reply_markup: { remove_keyboard: true },
}

const BUTTONS = {
  main_menu,
  profile_menu,
  edit_menu,
  edit_profile_text_menu,
  edit_profile_location_menu,
  edit_profile_location_anon_menu,
  edit_profile_location_city_menu,
  edit_profile_media_menu,
  edit_profile_contact_menu,
  edit_profile_contact_privacy_menu,
  edit_profile_notification_menu,
  edit_profile_visibility_menu,
  edit_profile_autodelete_menu,
  view_menu,
  age18Confirm_menu,
  phone_menu,
  rules_menu,
  back_to_main_menu,
  support_inline_menu,
  profile_publish_confirm_request_menu,
  contact_write_menu,
  contact_report_menu,
  contact_hello_menu,
  channel_start_inline,
  tips_inline_menu,
  channel_inline,
  chat_inline,
  edit_profile_media_admin_approve_inline,
  edit_profile_media_privacy_inline_menu,
  profile_generate_inline,
  profile_generate_moderation_inline,
  show_in_channel,
  remove_menu
}

export {
  MEDIA,
  TEXTS,
  BUTTONS,
}
