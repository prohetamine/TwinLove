import { Schema, model } from 'mongoose'
import { nanoid } from 'nanoid'
import createImportId from '../lib/create-import-id.js'

const userScheme = new Schema({
  id: { type: Number },
  scene: { type: String, default: 'start' }, /* сцена */
  upd: { type: Number, default: Date.now() },
  text: { type: String, default: '' }, /* текст поста */
  name: { type: String, default: '' }, /* имя, выбранное для анкеты */
  gender: { type: String, enum: ['', 'male', 'female'], default: '' }, /* значок пола показывается перед именем в анкете */
  media: { type: Array, default: [] }, /* медиа файлы */
  location: { type: String, default: '0|0' }, /* страна|город */
  nighLocations: { type: Array, default: [] }, /* ближайшие города */
  optionalTextCity: { type: String, default: '' }, /* дополнительный город */
  hidden: { type: Boolean, default: false },
  /* 
    Профиль: 
    true - скрыт 
    false - открыт
  */
  newNotification: { type: Number, default: 1 }, 
  /*
    Уведомления о новых анкетах:
      0 - отключены
      1 - все из моего города
      2 - все из моего города и ближайших городов
      3 - все из всех городов
  */
  privacyCity: { type: Number, default: 0 }, 
  /*
    Писать могут: 
      0 - все из всех городов
      1 - все из ближайших городов
      2 - все из моего города
  */
  privacyMedia: { type: Array, default: [0, 0, 0] },
  /*
    Фото доступно[0]: 
      0 - всем
      1 - только в боте
    Только из моего города[1]:
      0 - нет
      1 - да
    Только с фото[2]: 
      0 - нет
      1 - да
  */
  autoRemovePrevPost: { type: Boolean, default: true },
  /*
    Удалять мой предыдущий пост: 
      true - да
      false - нет
  */
  bottomInternet: { type: Number, default: 0 },
  /*
    Нижний интернет знаете: 
      0 - не заполненно
      1 - да
      2 - нет
  */
  system_language: { type: String, default: 'ru' },
  /*
    язык интерфейса
  */
  system_rulesConfirm: { type: Boolean, default: false },
  /*
    true - правила подтверждены 
    false - правила не подтверждены 
  */
  system_age18Confirm: { type: Boolean, default: false },
  system_phoneNumber: { type: String, default: '' }, /* номер, отправленный пользователем через Telegram */
  /*
    true - >=18
    false - <18
  */
  system_referalHashId: { type: String, default: () => nanoid(4) }, /* рефералка */
  system_callHashId: { type: String, default: () => nanoid(15).replace(/(_|-)/gi, 'Z') }, /* id поста */
  system_importHashId: { type: String, default: () => createImportId() }, /* id для импорта профиля, обновляется после каждого запроса на импорт */
  system_username: { type: String, default: '@username' }, /* username for send contacts */
  system_block_status: { type: Boolean, default: false }, 
  /*
    status: 
      true - заблокирован
      false - default
  */
  system_block_message: { type: String, default: '' }, /* Cопроводительное сообщение */
  system_block_auto: { type: Boolean, default: false }, /* автоматическая блокировка */
  system_isAdmin: { type: Boolean, default: false }, 
  /*
    true - admin|user
    false - user
  */
  system_isSupport: { type: Boolean, default: false }, 
  /*
    true - admin|user
    false - user
  */
  system_lastPostTime: { type: Number, default: 0 }, /* время в миллисекундах с последнего поста */
  system_tipHidden: { type: Boolean, default: false }, /* скрыть советы */
  system_selectCallHashId: { type: String, default: '' }, /* Select сallHashId */
  system_selectCallAction: { type: String, default: '' }, /* Select сall action */
  system_supportHashId: { type: String, default: () => nanoid(6).replace(/(_|-)/gi, 'Z') }, /* Id support ticket */
  system_adminSelectId: { type: Number, default: 0 }, /* id - user */
  system_publishModerationRequest: { type: Boolean, default: false }, /* Запрос на публикацию */
  system_publishModerationStatus: { type: Boolean, default: false }, /* Ответ модератора */
  system_startTime: { type: Number, default: 0 }, /* Первое действие */
  system_actionTime: { type: Number, default: 0 }, /* Последнее действие */
  // ETC
  etc_testBottomInternetRate: { type: Array, default: [0, 0.4] }, /* God, Bad */
  etc__last_names_testBottomInternetRate: { type: Array, default: [] } /* Last names */
})

const referalScheme = new Schema({
  id: { type: Number },
  upd: { type: Number, default: Date.now() },
  ids: { type: Array, default: [/* ids */] },
  links: { type: Array, default: [] }, /* дополнительные ссылки: { code, ids } */
})

const postScheme = new Schema({
  id: { type: Number },
  upd: { type: Number, default: Date.now() },
  ids: { type: Array, default: [/* ids */] },
})

/* запросы на общение */
const inviteScheme = new Schema({
  id: { type: Number },
  upd: { type: Number, default: Date.now() },
  ids: { type: Array, default: [/* ids */] },
})

/* лайк на общение */
const inviteLikeScheme = new Schema({
  id: { type: Number },
  upd: { type: Number, default: Date.now() },
  ids: { type: Array, default: [/* ids */] },
})

/* Рассылка уведомлений */
const notifyScheme = new Schema({
  id: { type: Number },
  upd: { type: Number, default: Date.now() },
  ids: { type: Array, default: [/* ids */] },
})

/* Завершенная рассылка уведомлений */
const notifyCompleteScheme = new Schema({
  id: { type: Number },
  upd: { type: Number, default: Date.now() },
  ids: { type: Array, default: [/* ids */] },
})

const User = model('user', userScheme)
    , Referal = model('referal', referalScheme)
    , Post = model('post', postScheme)
    , Invite = model('invite', inviteScheme)
    , InvitesLike = model('invitesLike', inviteLikeScheme)
    , Notify = model('notify', notifyScheme)
    , NotifyComplete = model('notifyComplete', notifyCompleteScheme)

export { 
  User,
  Referal,
  Post,
  Invite,
  InvitesLike,
  Notify,
  NotifyComplete
}
