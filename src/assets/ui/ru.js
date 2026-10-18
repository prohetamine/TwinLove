import { Markup } from 'telegraf'
import textScreening from './../../lib/text-screening.js'
import checkValid from '../../modules/check-valid.js'
import { CHANNEL_LINK, CHAT_LINK, BOT_LINK, IS_DEV } from '../../../configs/env.js'
import getCityById from '../../lib/get-city-by-id.js'

const TEXTS = {
  // TEXTS //
  hello: 'Добро пожаловать в *TwinLove*\\! Здесь можно познакомиться с людьми из своего города, найти друзей или близкого человека 🤝❤️\n\nПеред знакомством прочитай правила /rules 🚩\n\nПодробнее о проекте — /next',
  hello_next: 'Этот проект существует на мою пенсию по шизе и наследство от бабки и вообще все что делается делается ради лулзов\\. \n\nЕсли серьезно то любая поддержка данного проекта в виде копейки или форса — благое дело, ШУЕ ППШ 💸\n\nВ разделе «Дополнительно 💼 → Донат 💸» можно найти реквизиты\\.\n\n||Еще пару слов и проекте /next2||',
  hello_next_2: 'Привет это снова я 👋\n\nЦель этого проект быть самым технологичным, честным и самым прозрачным\\.\n\nБез неких «скрытых пулов», подписок, лимитов, занижения рейтинга, теневых банов и прочего скама, все анкеты публикуются в канале реальными людьми, каждый профиль может быть зарепорчер если в нем есть проблема он будет удален или даже заблокирован\\.\n\nВ каком\\-то непоределенно далеком будущем мы стремимся к полной модерации сообществом\\.\n\n||Еще пару слов о последнем обновлении /next3||',
  hello_next_3: 'Meow',
  home: '🏠 Куда теперь?',
  rules: `Это бот __\\= ДОБРА И ПОЗИТИВА \\=__ используя бота ты соглашаешься с правилами и берёшь на себя полную ответственность за свои ||шизо||действия в сервисе какие бы они не были, мы не нарушаем закон и неприемлим никакие противоправные действия в отношении кого либо, любые попытки нарушать *правила* и *закон* с помощью сервиса приведут к *бану*, так быстро как это возможно\\.\n\n` +
               `Правила:\n` +
               `• Анкета не место для рекламы/спама\n` + 
               `• Анкета не место для высказывания мнения, но место для знакомств\n` + 
               `• Сервис не место для несовершенно летних [\\(*?*\\)](${textScreening(BOT_LINK)}?start\\=dating18)\n` + 
               `• Сервис не место для __*тарелочниц/вагинокапиталисток/экстремистов/террористов/колумбайнеров*__ \\(так же как и для фанатов этих явлений\\)\n` + 
               `• Правила могут меняться в любой момент\n\n` +
               `Общие рекомендации:\n` + 
               `• Не забывай ВСЖ [\\(*?*\\)](${textScreening(BOT_LINK)}?start\\=vsj)\n` + 
               `• Не отправляй деньги незнакомцам\n\n` +
               `О нарушении правил можно написать в [поддержку](${textScreening(BOT_LINK)}?start\\=support)\\.`,
  rules_dating18: `❗️ Легальность дейтинга ака сайтов/приложений знакомств всегда ставится под сомнение если их пользователи несовершеннолетние, не смотря на отсутствие функции переписки или иных «скрытых пулов» и полную прозрачность системы администрация сервиса решительно против использования бота несовершеннолетними, все несовершеннолетние будут забанены\\.\n\nСообщайте в [поддержку](${textScreening(BOT_LINK)}?start\\=support)\\.`,
  rules_vsj: `❗️ ВСЖ — в какой стране живешь.`,
  chat: 'Чат в котором можно просто пообщаться, в текстовом или голосовом чате 🎙💬',
  donate: '*Криптовалюта:*\nToncoin \\(TON\\): `UQBC6W0x8DztkJ39G4AbZ8_XpeN8WeDO5TZyTUro9IHfiF0L`\nBitcoin \\(BTC\\): `18exK5nCY74RPWDtJLW5DVdNFQDePBkFUN`\nUSDT \\(TRC20\\): `TDWrFoA8L2TzWvUdCH1SFwiWZ1n7QNPdAq`',
  source_code: 'Исходный код появится в этом разделе не ранее чем через _месяц после исправления последнего бага_ и не ране чем через _3 месяца с 16 апреля 2024_\\.',
  referal_link: (id, referals, referalsPost) => `*Твоя пригласительная ссылка:* \`${textScreening(BOT_LINK)}?start\\=${textScreening(id)}\`\n\n*Статистика*\nПользователей: ${referals}\nОпубликованных анкет: ${referalsPost}`,
  other: `Тут делать особо нечего, но может быть ты найдешь что\\-то для себя 😉`,
  channel: '❗️ Канал в котором публикуются анкеты, контакты могут смотреть только опубликовавшие хотя бы раз свою собственную анкету\n\n\\= ВСЕ ПО ЧЕСНОКУ \\=',
  help: 'Такой команды нет, в этом меню нужно использовать кнопки, нажми ⌘ чтобы открыть меню\\.\n\nЕсли бот завис нажмите: /start',
  edit: `Выбери пункт который хочешь изменить ⚙️`,
  support: '❗️ Опишите проблему, пришлите скриншот или запись экрана если это необходимо',
  admin: '❗️ Помогите решить проблему или зафиксировать баг, прикрепите необходимые скриншоты или запись экрана если это необходимо для помощи пользователю',
  support_response: 'Тикет выбран',
  profile: ctx => {
    let text = `У тебя __*не заполненны*__ разделы:\n`
    text += !(ctx.user?.text > 20 && ctx.user?.text < 800) ? `• *__Текст анкеты__* 📝\n` : ``
    text += ctx.user?.location === '0|0' ? `• *__Страна и город 📍__*\n` : ``
    text += !ctx.user?.system_username ? `• *__Контакты ☎️__*\n` : ``
    text += `\nПерейди в раздел: «Редактировать 📝» чтобы заполнить пробелы ✏️`
    
    return checkValid(ctx) 
              ? (
                Math.random() > 0.5 
                  ?  Math.random() > 0.5 
                      ? `😉 Что дальше?` 
                      : Math.random() > 0.5 
                          ? `📊 Пройдем тест?`
                          : `📝 Не хочешь еще что\\-нибудь добавить?`
                  : `Ну давай публикуй ⬆️`
              ) 
              : text
  },
  view: 'Смотри\\! ',
  view_wait_load_media: 'У тебя загружены медиа файлы, я пока не успел их обработить, дай мне немного времени, я скажу как все будет готово ⏳👌',
  banned_rule_age: 'нарушение правила: возраст',
  support_message_delivery: 'Сообщение доставленно, дополните или ожидайте ответа поддержки в этом меню 📬',
  content_error: '*\\=Я ПОКА НЕ МОГУ ОБРАБАТЫВАТЬ ТАКИЕ ФАЙЛЫ\\=* \\(автоматический ответ\\)', 
  tips: [
    '⚡️ *Совет:* чтобы все увидели твою анкету, не забудь нажать «Анкета 👤 → Опубликовать ⬆️»',
    '⚡️ *Совет:* подпишись на канал в разделе «Все анкеты 👥» чтобы видеть новые анкеты мгновенно ✨',
    '⚡️ *Совет:* настроив приватность в разделе «Анкета 👤 → Редактировать 📝 → Контакты ☎️ → Настроить приватность 🔒», вы сможете ограничить круг людей, которые смогут просматривать ваши контакты 🔒',
    '⚡️ *Совет:* настроив приватность в разделе «Анкета 👤 → Редактировать 📝 → Фото/видео 📹📸 → Настроить приватность 🔒», вы сможете ограничить круг людей, которые смогут просматривать ваши фото/видео 📹📸',
    '⚡️ *Совет:* все фото/видео можно просмотреть в разделе «Анкета 👤 → Показать 👁 → Мои фото/видео 📹📸» иногда они могут быть размыты до тех пор пока не пройдут модерацию 🔍',
    '⚡️ *Совет:* анкету можно спрятать в разделе «Анкета 👤 → Редактировать 📝 → Видимость 👻», контакты и медиа будут скрыты, но пост также останется канале 👥',
    '⚡️ *Совет:* в анкету можно добавить фото/видео \\(до 15мб\\) не более 5 штук, в разделе «Анкета 👤 → Редактировать 📝 → Фото/видео 📹📸»',
    '⚡️ *Совет:* автоудаление предыдущего поста можно настроить в разделе «Анкета 👤 → Редактировать 📝 → Автоудаление 🤖🗑»',
    '⚡️ *Совет:* анкета с фото/видео привлекает больше внимания, добавить фото/видео в разделе «Анкета 👤 → Редактировать 📝 → Фото/видео 📹📸»',
    '⚡️ *Совет:* если в разделе «Анкета 👤 → Показать 👁 → Мои фото/видео 📹📸» все фото/видео размыты и в «Анкета 👤 → Показать 👁» нет прикрепленных к сообщению фото, то анкета будет опубликована без фото/видео 📹📸\nЧто делать?\n\n• Дождитсь модерации 🔍\n• Загрузите фото/видео заново 🔄\n• Обратитесь в поддержку в разделе «Поддержка ⚠️»',
  ],
  age18Confirm: `❗️ Вам 18 лет или больше?`,
  blocked: ({ system_block_message, system_block_auto }) => `❗️ Вы заблокированны${system_block_message ? ` по причине: «${system_block_message}»` : ''}${system_block_auto ? ' это автоматическая блокировка' : ''}, если вы не согласны с блокировкой свяжитесь с поддержкой /support`,
  ban: 'Заблокирован(а)',
  unban: 'Разблокирован(а)',
  delete: 'Все посты этого пользователя удалены',
  error_delete: id => `Не удалось удалить сообщение автоматически, удалите его в ручную ${CHANNEL_LINK}/${id}`,
  profile_generate: user => {
    let text = ''

    text += `${textScreening(user?.text)}\n\n`
    text += user?.location !== '999|666' ?  user?.privacyCity === 0 ? '' : user?.privacyCity === 1 ? `Мой и ближайшие города 🌇  [\\(*?*\\)](${textScreening(BOT_LINK)}?start\\=privacycity)\n` : `Только мой город 🏡  [\\(*?*\\)](${textScreening(BOT_LINK)}?start\\=privacycity)\n` : ''
    text += user?.location !== '999|666' ? `*${textScreening(getCityById(user?.location).title)} ${getCityById(user?.location).flag} 📍*\n` : `*Анонимный 🏴‍☠️ 📍*  [\\(*?*\\)](${textScreening(BOT_LINK)}?start\\=anon)\n`
    text += `\n`
    text += `[бот](${BOT_LINK}?start=from-channel)  •  [все анкеты](${BOT_LINK}?start=channel)  •  [общий чат](${BOT_LINK}?start=chat)${user?.location !== '999|666' ? `  •  \\#${textScreening(getCityById(user?.location).hash)}` : ''}`

    return text
  },
  demo: 'Не возможно, это твоя анкета ❌',
  view_photo_empty: 'Кажется у тебя еще нет ни одного загруженного фото/видео.. 😳',
  view_photo_with_no_approve: '❗️ Пока фото не прошли модерацию они будут выглядеть размытыми и их сможешь увидеть только ты',
  publish_profile_request: '❗️ У вас есть фото/видео которые не прошли модерацию и не будут отображаться в анкете пока не пройдут модерацию, вы точно хотите опубликовать профиль в канал без фото?',
  publish_profile_complete: `Готово, анкета опубликованна 🎉`,
  publish_profile_timeout: (outTime, textTime) => `Постить анкету можно только раз в ${textTime}, приходи через: __*${outTime}*__ ${Math.random() > 0.5 ? '⏳' : '⌛️'}`,
  publish_profile_moderation_request: 'Анкета будет опубликована сразу после модераци 👌',
  publish_profile_moderation_reject_request: '❗️ Анкета отклонена модератором, для обжалования свяжитесь с поддержкой /support',
  publish_profile_moderation_ok: 'Выполненно ✅',
  post_in_city: type => `Только что кто\\-то${type === 1 ? ' из твоего города' : type === 2 ? ' из твоего города или ближайшего' : ''} опубликовал анкету 😊`,
  contact: (id, username) => `Контакт __*[${textScreening(username ? `@${username}` : '@username')}](tg://user?id=${id})*__ ${textScreening(`человека с которым ты хочешь познакомиться, пиши скорее!`)}`,
  media_empty: 'У этого пользователя нет ни одного загруженного фото/видео\\.\\.\\. 😒',
  hello_hand: 'Кто\\-то помахал 👋 тебе, он или она хочет чтоб ты написал\\(а\\) ему/eй\\. Хочешь посмотреть его/eё анкету?',
  hello_like: 'Кто\\-то поставил тебе лайк ❤️ тебе, ты нравишься кому\\-то он/она хочет чтоб ты написал\\(а\\) ему/eй\\. Хочешь посмотреть его/eё анкету?',
  hello_hand_confirmed: 'Теперь остается только ждать что тебе напишут, потерпи или напиши сам\\(а\\)\\!',
  hello_like_confirmed: 'Теперь остается только ждать что тебе напишут, потерпи или напиши сам\\(а\\)\\!',
  hello_error: 'Какая\\-то ошибка, этому человеку нельзя больше помахать\\.\\.\\. ☠️',
  hello_like_error: 'Какая\\-то ошибка, этому человеку нельзя больше поставить лайк\\.\\.\\. ☠️',
  hello_hidden: 'Этому человеку пока нельзя помахать, он скрыл свой профиль 🤔',
  hello_like_hidden: 'Этому человеку пока нельзя поставить лайк, он скрыл свой профиль 🤔',
  hello_hand_used: 'Вы уже помахали этому человеку, это действие нельзя повторить с одним и тем же человеком снова 📵',
  hello_like_used: 'Вы уже поставили лайк этому человеку, это действие нельзя повторить с одним и тем же человеком снова 📵',
  error_profile_notfound: 'Ваша анкета не найдена, вы не можете просматривать чужие анкеты пока не опубликуете свою хотя бы раз 🤔',
  contact_error: 'Какая\\-то ошибка, этому человеку больше нельзя написать\\.\\.\\. ☠️',
  contact_hidden: 'Этому человеку пока нельзя написать, он скрыл свои контакты 🤔', 
  media_error: 'Какая\\-то ошибка, фото/видео этого человека больше нельзя просмотреть\\.\\.\\. ☠️',
  media_hidden: 'Фото/видео этого человека пока нельзя просмотреть, он скрыл свои медиа 🤔', 
  contact_error_privacy: type => `Контакты этого человека доступны только: ${type === 1 ? '«из моего и ближайших городов 🌇»' : '«только из моего города 🏡»'}`,
  media_error_privacy: (city, media) => `Чтобы видеть фото/видео этого человека вам нужно также подходить под эти параметры: ${[city ? '«людям из моего города 🏡»' : null, media ? '«людям с фото/видео 📸»' : null].filter(f => f).join(' и ')}`,
  fulled_not_publish: '❗️ Твоя анкета еще не опубликована\n\nАнкета заполнена, осталось только опубликовать ✨\n\nНажми /start чтобы начать',
  not_fulled_not_publish: '❗️ Твоя анкета еще не опубликована\n\nПора заполнить анкету и останется только опубликовать ✨\n\nНажми /start чтобы начать',
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
  profile_btn: 'Анкета 👤',
  channel_btn: 'Все анкеты 👥',
  view_profile_btn: 'Показать 👁',
  chat_btn: 'Ламповый чат 📝',
  rules_btn: 'Правила 🚩',
  support_btn: 'Поддержка ⚠️',
  donate_btn: 'Донат 💸',
  other_btn: 'Дополнительно 💼',
  source_code_btn: 'Исходный код бота 💾',
  referal_link_btn: 'Реферальная ссылка 🔗',
  edit_profile_btn: 'Редактировать 📝',
  pubish_profile_btn: 'Опубликовать ⬆️',
  back_to_menu_btn: 'Назад в меню ⏪',
  back_to_main_menu_btn: 'Назад в главное меню ⏪',
  open_link_in_channel_btn: 'Открыть канал 🔗',
  open_link_in_start_channel_btn: 'Все анкеты 🔗',
  open_link_in_chat_btn: 'Открыть чат 🔗',
  tip_inline_refresh_btn: 'Еще 🔄',
  tip_inline_hidden_btn: 'Скрыть ❌',
  support_inline_btn: 'Ответить',
  age18Confirm_btn_1: 'Нет, мне меньше 18 лет 🔞',
  age18Confirm_btn_2: 'Да, мне 18 или больше лет ✅',
  rules_confirm_btn: 'Согласен(a) ✅',
  rules_no_confirm_btn: 'Не согласен(а) ❌',
  write_inline_btn: '✍️',
  hello_hand_inline_btn: '👋',
  report_inline_btn: '⚠️',
  write_btn: 'Здесь можно просмотреть контакты, фото или видео человека которому хотите написать ✍️',
  hello_btn: `Не знаешь с чего начать? Поздоровайся или поставь лайк\\! 👋❤️ [\\(*?*\\)](${textScreening(BOT_LINK)}?start\\=hello)`,
  report_btn: `Пожаловаться на анкету ⚠️`,
  my_media_btn: 'Мои фото/видео 📹📸',
  my_profile_btn: 'Моя анкета 👤',
  profile_publish_confirm_request_btn: 'Все равно опубликовать ⬆️',
  profile_publish_auto_btn: 'Опубликовать автоматически ⏳⬆️',
  open_link_btn: 'Открыть 🔗',
  contact_btn: 'Контакты ☎️',
  media_btn: 'Фото/видео 📹📸',
  long_hello_btn: 'Помахать 👋',
  like_btn: 'Ты мне нравишься ❤️',
  report_profile_btn: 'Проблема в анкете 💩',
  report_user_btn: 'Проблема в человеке 🤮',

  // EDIT MENU //
  edit_profile_update: 'Сохранил 💾',
  edit_profile_privacy_btn: 'Настроить приватность 🔒', 
  edit_profile_text_btn: 'Текст анкеты 📝',
  edit_profile_text: 'Расскажи о себе в вольной форме или по шаблону, ниже в следующем сообщении будет будет шаблон по которому лучше всего написать о себе ✍️',
  edit_profile_text_tmp: '1. Сколько тебе лет и из какого ты города?\n2. Чем ты увлекаешься и как любишь проводить свободное время?\n3. С кем хочешь познакомиться?\n4. Что для тебя важно в общении или отношениях?\n5. Что ещё стоит о тебе узнать?',
  edit_profile_text_error_length: 'Слишком коротко, попробуй еще раз\\.\\.\\. 📏', 
  edit_profile_text_error_length_long: '«Краткость — сестра таланта» текст должен быть не длиннее чем 800 символов 📏',

  edit_profile_location_btn: 'Страна и город 📍',
  edit_profile_location: `Отправьте геолокацию кнопкой «Поделиться геопозицией 📍» чтоб мы могли определить ближайщие к тебе города 🌆 [\\(*?*\\)](${textScreening(BOT_LINK)}?start\\=geo)`,
  edit_profile_location_help: `❗️ Мы не храним и не передаем твое точное местоположение которое получаем от Телеграм\\.\n\n📍 Геоданные используются только один раз для установления ближайших городов это происходит локально без обращения к сторонним сервисам 🔐`,
  edit_profile_location_anon: `Ты точно хочешь остаться анониным? Никто не будет видеть твой город и твое местоположение, но также:\n\n• Мы не разошлем анкету нашим пользователям как уведомление в бота 🤖\n\n• Анкета отобразится в __*[канале](${CHANNEL_LINK})*__ без хештега города 🌇\n\n• Посмотреть контакты возможно будет только у пользователей с настройкой приватности «Всем 👥»\n\n• Анкета будет опубликованна только после модерации 🔎`,
  edit_profile_location_anon_help: 'В этой анкете нет настоящего города, владелец анкеты пожелал остаться анонимным, будь осторожен\\(а\\) береги себя ❤️',
  edit_profile_location_city: 'Выберите ближайший к вам город из списка меню 📶',
  edit_profile_location_btn_1: 'Поделиться геопозицией 📍',
  edit_profile_location_btn_2: 'Хочу остаться анонимный 🏴‍☠️',
  edit_profile_location_btn_3: 'Да 🏴‍☠️',
  edit_profile_location_btn_4: 'Нет 📍',

  edit_profile_media_btn: 'Фото/видео 📹📸',
  edit_profile_media: allowCount => allowCount !== 0 ? `Хочешь добавить фото/видео к профилю? Можно загрузить еще ${allowCount} фото/видео 📹📸` : `Упс, кончилось место для фото/видео 📹📸, может стоит удалить? 🗑`,
  edit_profile_media_btn_2: 'Удалить фото/видео 📹📸🗑',
  edit_profile_media_additional: `Загружено\\!`,
  edit_profile_media_question: allowCount => `Хочешь загрузить еще? Можно загрузить еще ${allowCount} фото/видео 📹📸`,
  edit_profile_media_remove: allowCount => `Медиа удалены теперь можно добавить ${allowCount} фото/видео 📹📸`,
  edit_profile_media_error: 'Что\\-то тут не так\\.\\.\\. я не могу это загрузить или обработать, я принимаю только фото и видео \\(до 15мб\\) 😢',
  edit_profile_media_resolve_inline_btn: '✅',
  edit_profile_media_reject_inline_btn: '❌',
  edit_profile_media_people_inline_btn: '👤',
  edit_profile_media_no_people_inline_btn: '🧸',
  edit_profile_media_not_found: 'Не существует ❌',
  edit_profile_media_ok: 'Изменено ✅',

  edit_profile_media_approve: id => `Фото или видео одобренно${id ? ` (mediaID: ${id})` : ''}`,
  edit_profile_media_reject: id => `Фото или видео заблокированно, для обжалования свяжитесь с поддержкой /support${id ? ` (mediaID: ${id})` : ''}`,
  edit_profile_media_privacy: 'Выберите пункты которые будут отвечать за отображение фото/видео:',
  edit_profile_media_privacy_all_btn: isSelect => isSelect ? `Видны всем 👥 — ✅` : `Видны всем 👥`,
  edit_profile_media_privacy_settings_btn: isSelect => isSelect ? `Видны в боте 🤖 — ✅` : `Видны в боте 🤖`,
  edit_profile_media_privacy_city_btn: isSelect => `Людям из моего города${isSelect ? ' ✅' : ''}`,
  edit_profile_media_privacy_media_btn: isSelect => `Людям с фото/видео${isSelect ? ' ✅' : ''}`,
  edit_profile_media_privacy_error_select: 'Этот вариант уже ✅',

  edit_profile_contact_btn: 'Контакты ☎️',
  edit_profile_contact: isUsername => isUsername ? 'У вас установлен username 👍 это нужно чтоб тебе могли написать 🔗' : 'У вас не установлен username 👎 установи его чтобы продолжить, это нужно чтоб тебе могли написать 🔗\n\n__*[Как установить username в Телеграм](https://dzen.ru/a/ZLZzSY55_nT7X7Lz)*__',
  edit_profile_contact_confirm_btn: 'Установил(а) ✅',
  edit_profile_contact_error: 'Username все еще не установлен\\.\\. @',
  edit_profile_contact_privacy: 'Кому видны твои контакты? ☎️',
  edit_profile_contact_privacy_help: 'Некоторые пользователи ограничивают доступ к своим контактам по гео позиции\\. Настроить эту функцию можно в разделе «Анкета 👤 → Редактировать 📝 → Контакты ☎️ → Настроить приватность 🔒»',
  edit_profile_contact_privacy_btn_1: select => `Всем 👥${select === 0 ? ` — ✅` : ''}`,
  edit_profile_contact_privacy_btn_2: select => `Из моего и ближайших городов 🌇${select === 1 ? ` — ✅` : ''}`,
  edit_profile_contact_privacy_btn_3: select => `Только из моего города 🏡${select === 2 ? ` — ✅` : ''}`,

  edit_profile_notification_btn: 'Уведомления 📲',
  edit_profile_notification: `Хочешь получать уведомление в бота если кто\\-то публикует анкету? 📲 [\\(*?*\\)](${textScreening(BOT_LINK)}?start\\=nonotify)`,
  edit_profile_notification_help: `❗️ Мы дорожим тобой ❤️ мы никогда не беспокоим наших пользователей почем зря, не нужно блокировать или удалять бота, если ты не хочешь получать увадомления отключить их можно просто кнопкой «Не присылать уведомления ❌»`,
  edit_profile_notification_btn_1: select => `Не присылать уведомления ❌${select === 0 ? ` — ✅` : ''}`,
  edit_profile_notification_btn_2: select => `Только из моего города 🏡${select === 1 ? ` — ✅` : ''}`,
  edit_profile_notification_btn_3: select => `Из моего города и рядом 🌇${select === 2 ? ` — ✅` : ''}`,
  edit_profile_notification_btn_4: select => `Из любого города мира 🌏${select === 3 ? ` — ✅` : ''}`,

  edit_profile_visibility_btn: 'Видимость 👻',
  edit_profile_visibility: 'Если ваша анкета будет скрыта, ваши контакты нельзя будет посмотереть также как: фото/видео, «помахать вам» и вы не сможете смотреть чужие контакты ☎️',
  edit_profile_visibility_stop: '❗️ Анкета не может быть опубликована если она скрыта 🤔\n\nПерейдите раздел «Анкета 👤 → Редактировать 📝 → Видимость 👻» измените «Отображать анкету»', 
  edit_profile_visibility_btn_1: isHidden => `Отображать анкету${!isHidden ? ` — ✅` : ''}`,
  edit_profile_visibility_btn_2: isHidden => `Скрыть анкету${isHidden ? ` — ✅` : ''}`,

  edit_profile_autodelete_btn: 'Автоудаление 🤖🗑',
  edit_profile_autodelete: 'Ваши старые пост\\(ы\\) будут мгновенно удаляться в момент публикации новых постов',
  edit_profile_autodelete_btn_1: isRemove => `Удалять автоматически${isRemove ? ` — ✅` : ''}`,
  edit_profile_autodelete_btn_2: isRemove => `Накапливать посты${!isRemove ? ` — ✅` : ''}`,
}

const MEDIA = {
  logo: IS_DEV ? 'DQACAgQAAxkDAAInLGYclXwTkLW0_UQb8OhVTLkxUr1mAALeEwAC1g3pUEq5BHb4_I_xNAQ' : 'DQACAgIAAxkDAAEB9DdmHoVctgKv3vFdtqLimPkGdA-Z4AACIksAAjUm8EhfqT3lKGBlAAE0BA',
  help: IS_DEV ? 'AgACAgIAAxkBAAIGTGgfz5aWQO5FNqFiOMDz4YH7bxHWAAJ--zEbiaUAAUk9PoYhlvbcdwEAAwIAA3gAAzYE' : 'AgACAgIAAxkDAAEB9DpmHoYDJ__nQCB9z84CKWnADk1IWAACzdcxGzUm8EjvISbsyh8VuAEAAwIAA3gAAzQE',
  logo_gif: IS_DEV ? 'BQACAgQAAxkDAAJSDWYqNIG_LgABxe6_kJKn4Z6xsYDHBAACAxMAAmKuUFE-fkHPDYzB0zQE' : 'BQACAgIAAxkDAAECB2BmKjUqVOGfS_wc4iTU85Wjrp_XnwACXEkAAouBWUmPPznnB4GeFDQE',
  channel_bg: IS_DEV ? 'AgACAgQAAxkBAAKNvGZJjr3uHPEN51jkEdGd8dO_bRlOAAJvwjEbFRBIUlpQ5FzlJ20bAQADAgADeQADNQQ' : 'AgACAgQAAxkBAAECSm9mRFjbfvT4-MP58Zh6YZo6zUuCRQACu8IxG09ZIFIttI17GJzoGAEAAwIAA3kAAzUE',
  source_bg: IS_DEV ? 'AgACAgQAAxkBAAKN5GZJj3Ao0TDlMTBufUdvugSBTZZtAAJwwjEbFRBIUmVa-oTw-kATAQADAgADeQADNQQ' : 'AgACAgQAAxkBAAECSn1mRFmshva9dV5NNRrDPcYVvxSazwACvMIxG09ZIFL-LCPnbeKa0gEAAwIAA3kAAzUE',
  support_bg: IS_DEV ? 'AgACAgQAAxkBAAKN5mZJj45Ls8vSLjZaTp04JcDd0xzvAAJxwjEbFRBIUsSRp5CS896WAQADAgADeQADNQQ' : 'AgACAgQAAxkBAAECSp1mRF3nT85iJIOEf_soOiUp0jIg3gACxMIxG09ZIFLOpuV9cTOLFwEAAwIAA3kAAzUE',
  rules_bg: IS_DEV ? 'AgACAgQAAxkBAAKN6GZJj6EUHZk1KSIdSipt6BsYmGCxAAJywjEbFRBIUmN7_FTN2rhXAQADAgADeQADNQQ' : 'AgACAgQAAxkBAAECSs9mRGZ2zcgWBz9YuuAgZMzd8QlpfAACz8IxG09ZIFLo9sMl42QVzAEAAwIAA3kAAzUE',
  crypto_bg: IS_DEV ? 'AgACAgIAAxkBAAIGEmgfVUDedXb19qUHBbVf4tLJOxJoAALe9zEbiaUAAUko_yCMlqzBEwEAAwIAA3kAAzYE' : 'AgACAgIAAxkBAAEFHu9oH1VTHrP8o03sGv65bI-8Pob7nAAC3vcxG4mlAAFJGAe2nnVh6VwBAAMCAAN5AAM2BA'
}

const main_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard([
    [TEXTS.profile_btn, TEXTS.channel_btn],
    [TEXTS.rules_btn, TEXTS.support_btn],
    [TEXTS.other_btn]
  ]).resize().reply_markup
}

const other_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard([
    [TEXTS.donate_btn, TEXTS.chat_btn],
    [TEXTS.source_code_btn],
    [TEXTS.referal_link_btn],
    [TEXTS.back_to_main_menu_btn]
  ]).resize().reply_markup
}

const profile_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard([
    [TEXTS.pubish_profile_btn, TEXTS.view_profile_btn],
    [TEXTS.edit_profile_btn],
    [TEXTS.back_to_main_menu_btn]
  ]).resize().reply_markup
}

const edit_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard([
    [TEXTS.edit_profile_text_btn], 
    [TEXTS.edit_profile_location_btn],
    [TEXTS.edit_profile_media_btn],
    [TEXTS.edit_profile_contact_btn],
    [TEXTS.edit_profile_notification_btn],
    [TEXTS.edit_profile_visibility_btn],
    [TEXTS.edit_profile_autodelete_btn],
    [TEXTS.back_to_menu_btn]
  ]).resize().reply_markup
}

const edit_profile_text_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard([
    [TEXTS.back_to_menu_btn]
  ]).resize().reply_markup
}

const edit_profile_location_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard(
    [
      [Markup.button.locationRequest(TEXTS.edit_profile_location_btn_1)],
      [TEXTS.edit_profile_location_btn_2],
      [TEXTS.back_to_menu_btn]
    ]
  ).resize().reply_markup
}

const edit_profile_location_anon_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard(
    [
      [TEXTS.edit_profile_location_btn_3],
      [Markup.button.locationRequest(TEXTS.edit_profile_location_btn_4)],
      [TEXTS.back_to_menu_btn]
    ]
  ).resize().reply_markup
}

const edit_profile_location_city_menu = citys => ({
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard([
    ...citys.map(city => [`${city} 📍`]),
    [TEXTS.back_to_menu_btn]
  ]).resize().reply_markup
})

const edit_profile_media_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard(
    [
      [TEXTS.edit_profile_privacy_btn],
      [TEXTS.edit_profile_media_btn_2],
      [TEXTS.back_to_menu_btn]
    ]
  ).resize().reply_markup
}

const edit_profile_contact_menu = isUsername => ({
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard(
    [
      [
        isUsername 
          ? TEXTS.edit_profile_privacy_btn
          : TEXTS.edit_profile_contact_confirm_btn
      ],
      [TEXTS.back_to_menu_btn]
    ]
  ).resize().reply_markup
})

const edit_profile_contact_privacy_menu = select => ({
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard(
    [
      [TEXTS.edit_profile_contact_privacy_btn_1(select)],
      [TEXTS.edit_profile_contact_privacy_btn_2(select)],
      [TEXTS.edit_profile_contact_privacy_btn_3(select)],
      [TEXTS.back_to_menu_btn]
    ]
  ).resize().reply_markup
})

const edit_profile_notification_menu = select => ({
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard(
    [
      [TEXTS.edit_profile_notification_btn_4(select)],
      [TEXTS.edit_profile_notification_btn_3(select)],
      [TEXTS.edit_profile_notification_btn_2(select)],
      [TEXTS.edit_profile_notification_btn_1(select)],
      [TEXTS.back_to_menu_btn]
    ]
  ).resize().reply_markup
})

const edit_profile_visibility_menu = isHidden => ({
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard(
    [
      [TEXTS.edit_profile_visibility_btn_1(isHidden)],
      [TEXTS.edit_profile_visibility_btn_2(isHidden)],
      [TEXTS.back_to_menu_btn]
    ]
  ).resize().reply_markup
})

const edit_profile_autodelete_menu = isRemove => ({
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard(
    [
      [TEXTS.edit_profile_autodelete_btn_1(isRemove)],
      [TEXTS.edit_profile_autodelete_btn_2(isRemove)],
      [TEXTS.back_to_menu_btn]
    ]
  ).resize().reply_markup
})

const view_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard([
    [TEXTS.my_profile_btn],
    [TEXTS.my_media_btn],
    [TEXTS.back_to_menu_btn]
  ]).resize().reply_markup
}

const age18Confirm_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard([
    [TEXTS.age18Confirm_btn_1],
    [TEXTS.age18Confirm_btn_2],
    [TEXTS.back_to_main_menu_btn]
  ]).resize().reply_markup
}

const rules_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard([
    [TEXTS.rules_confirm_btn],
    [TEXTS.rules_no_confirm_btn],
    [TEXTS.back_to_main_menu_btn]
  ]).resize().reply_markup
}

const profile_publish_confirm_request_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard([
    [TEXTS.profile_publish_confirm_request_btn], 
    [TEXTS.profile_publish_auto_btn], 
    [TEXTS.back_to_menu_btn]
  ]).resize().reply_markup
}

const contact_write_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard([
    [TEXTS.contact_btn], 
    [TEXTS.media_btn],
    [TEXTS.back_to_main_menu_btn]
  ]).resize().reply_markup
}

const contact_report_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard([
    [TEXTS.report_profile_btn], 
    [TEXTS.report_user_btn],
    [TEXTS.back_to_main_menu_btn]
  ]).resize().reply_markup
}

const contact_hello_menu = {
  parse_mode: 'MarkdownV2',
   disable_web_page_preview: true,
  reply_markup: Markup.keyboard([
    [TEXTS.long_hello_btn],
    [TEXTS.like_btn],
    [TEXTS.back_to_main_menu_btn]
  ]).resize().reply_markup
}

const back_to_main_menu = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.keyboard(
    [
      [TEXTS.back_to_main_menu_btn]
    ]
  ).resize().reply_markup
}

const channel_start_inline = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.inlineKeyboard([
    [{ text: TEXTS.open_link_in_start_channel_btn, url: CHANNEL_LINK }]
  ]).reply_markup
}

const channel_inline = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.inlineKeyboard([
    [{ text: TEXTS.open_link_in_channel_btn, url: CHANNEL_LINK }]
  ]).reply_markup
}

const chat_inline = {
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.inlineKeyboard([
    [{ text: TEXTS.open_link_in_chat_btn, url: CHAT_LINK }]
  ]).reply_markup
}

const tips_inline_menu = {
  parse_mode: 'MarkdownV2',
  disable_web_page_preview: true,
  reply_markup: {
    inline_keyboard: [
      [
        { text: TEXTS.tip_inline_refresh_btn, callback_data: `tip_refresh` },
        { text: TEXTS.tip_inline_hidden_btn, callback_data: `tip_hidden` }
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
          { text: TEXTS.edit_profile_media_resolve_inline_btn, callback_data: `res_${id}_${mediaId}` },
          { text: TEXTS.edit_profile_media_reject_inline_btn, callback_data: `rej_${id}_${mediaId}` },
          { 
            text: isPeople 
                    ? TEXTS.edit_profile_media_people_inline_btn 
                    : TEXTS.edit_profile_media_no_people_inline_btn, 
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
        [{ text: TEXTS.edit_profile_media_privacy_all_btn(!access), callback_data: `mediaprivacy_0_${city ? 1 : 0}_${media ? 1 : 0}` }],
        [{ text: TEXTS.edit_profile_media_privacy_settings_btn(access), callback_data: `mediaprivacy_1_${city ? 1 : 0}_${media ? 1 : 0}` }],
        [{ text: TEXTS.edit_profile_media_privacy_city_btn(city), callback_data: `mediaprivacy_1_${!city ? 1 : 0}_${media ? 1 : 0}` }],
        [{ text: TEXTS.edit_profile_media_privacy_media_btn(media), callback_data: `mediaprivacy_1_${city ? 1 : 0}_${!media ? 1 : 0}` }]
      ]  
      : [
        [{ text: TEXTS.edit_profile_media_privacy_all_btn(!access), callback_data: `mediaprivacy_0_${city ? 1 : 0}_${media ? 1 : 0}` }],
        [{ text: TEXTS.edit_profile_media_privacy_settings_btn(access), callback_data: `mediaprivacy_1_${city ? 1 : 0}_${media ? 1 : 0}` }]
      ]
  }
})

const profile_generate_inline = ({ isPreview = false, id }) => ({
  parse_mode: 'MarkdownV2',
  disable_web_page_preview: true,
  reply_markup: {
    inline_keyboard: isPreview 
      ? [
        [
          { text: TEXTS.write_inline_btn, callback_data: `w_${id}` },
          { text: TEXTS.hello_hand_inline_btn, callback_data: `h_${id}` },
          { text: TEXTS.report_inline_btn, callback_data: `r_${id}` }
        ]
      ]
      : [
        [
          { text: TEXTS.write_inline_btn, url: `${BOT_LINK}?start=w_${id}` },
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
          { text: TEXTS.edit_profile_media_resolve_inline_btn, callback_data: `profileres_${id}` },
          { text: TEXTS.edit_profile_media_reject_inline_btn, callback_data: `profilerej_${id}` },
        ]
      ]
  }
})

const show_in_channel = id => ({
  parse_mode: 'MarkdownV2',
  reply_markup: Markup.inlineKeyboard([
    [{ text: TEXTS.open_link_btn, url: `${CHANNEL_LINK}/${id}` }]
  ]).reply_markup
})

const remove_menu = {
  parse_mode: 'HTML',
  reply_markup: { remove_keyboard: true },
}

const BUTTONS = {
  main_menu,
  other_menu,
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
