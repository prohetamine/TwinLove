# Проверка тестового бота через Telegram

Скрипт работает только с `@testtllovebot` и использует учётную запись Telegram, подтверждённую по QR. Для него нужны API ID и API hash твоего приложения с [my.telegram.org/apps](https://my.telegram.org/apps). Положи их в `.telegram-test/credentials.json`:

```json
{"api_id":"123456","api_hash":"32-символьный hash"}
```

Каталог `.telegram-test/` и `log.txt` исключены из Git. Файл с данными приложения и сохранённая сессия доступны только владельцу компьютера.

```sh
npm install
npm run telegram:test -- auth
npm run telegram:test -- inspect
npm run telegram:test -- smoke
npm run telegram:test -- media
npm run telegram:test -- referral
npm run telegram:test -- name
npm run telegram:test -- name-manual
npm run telegram:test -- gender
```

При `auth` скрипт создаёт `.telegram-test/login-qr.png`. Открой его и отсканируй через Telegram на телефоне: **Настройки → Устройства → Подключить устройство**. Если включена двухэтапная проверка, введи пароль в Terminal; он не сохраняется.

`inspect` показывает последние ответы и кнопки бота. `smoke` проходит главное меню и меню редактирования без изменения анкеты или публикации. `media` открывает предпросмотр анкеты и пункт «Мои фото/видео», затем записывает в журнал число полученных медиа и наличие уведомления об обработке. `name` и `name-manual` сохраняют имя из Telegram кнопкой или вводом и проверяют возврат в меню редактирования. `gender` повторно сохраняет уже выбранный пол и проверяет возврат. `referral` нажимает inline кнопку и **добавляет одну новую ссылку**. Для отдельных шагов есть `send`, `click`, `inline` и `upload`:

```sh
npm run telegram:test -- click "Имя"
npm run telegram:test -- send "/start"
npm run telegram:test -- inline "Добавить ссылку"
npm run telegram:test -- upload "/путь/к/фото.jpg"
```

Результаты всех шагов записываются в `log.txt`. При незавершённом онбординге `smoke` останавливается и предлагает пройти его вручную в Telegram. Кнопка передачи телефона намеренно не вызывается автоматически.
