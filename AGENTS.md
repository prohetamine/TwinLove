# TwinLove — guidance for contributors and agents

## Product direction

TwinLove is a fork of an older Telegram bot. The current task is to adapt it for a broad audience looking for dating and meaningful connections. The public name is **TwinLove**. The old project's identity, in-jokes, subculture, and promotional claims are legacy material; they do not define the new product.

The user has decided to remove «Нижнометр», the $ONI token section, donations, and the source-code menu section from the user-facing bot. Do not bring them back into menus, onboarding, profile cards, notifications, or deep links. Other legacy features require a separate user decision before removal or repurposing.

The former «Дополнительно 💼» menu has been removed. Its «Пригласить друзей» and «Общий чат» buttons now live in the main menu. The profile, all profiles, invite, chat, rules, support, and report buttons use 👤, ❤️, 🤝, 💬, 🚩, and ⚠️ custom emoji icons from the `TwinLoveEmoji` set. Telegram displays keyboard icons before the button text. Keep the button text free of a second emoji. The chat message uses the 💬 custom emoji, the invitation statistics use 👞 for link visits and ⬆️ for published profiles from the set, and the rules heading uses the 🚩 custom emoji. The chat link in published profiles and the `/chat` and `/start chat` commands remain available. Saved `other-menu` scene names are redirected to the current menu.

Referral codes are four-character `/start` payloads. Referral registration checks existing records and the current inviter's list to avoid repeat counts, and ignores a user's own link. The public invitation view shows the link, the number of people who opened it, and how many of them have a published profile.

The 48-hour publication cooldown applies in production. In `mode=dev`, manual and automatic publication skip only this time limit; profile validation, moderation, and other publication checks still apply.

Profile cards show three inline buttons in one row. In private chats, the first button says «Написать» and uses the custom ✏️ icon from `TwinLoveEmoji`; 👋 and ⚠️ remain ordinary emoji-only buttons. Channel posts use ordinary ✏️, 👋, and ⚠️ without text labels because the bot cannot display custom button icons there under its current eligibility. Keep callback actions and deep links intact.

The MongoDB database name is `twinlove`. Changing the connection target does not migrate data from the legacy `openoni` database; plan any data migration separately and never overwrite or delete legacy data without an explicit request.

Onboarding requires age confirmation, acceptance of the rules, and then the user's own Telegram phone contact. Save the shared number in `User.system_phoneNumber` in MongoDB before opening the main menu; existing users without that field must complete the phone step too. The phone menu uses a `request_contact` keyboard button with the custom ☎️ icon, and its handler accepts a contact only when `contact.user_id` matches the current user. Route pending onboarding stages before commands and callback actions so a missing number cannot be bypassed through deep links or old buttons. Require the number for publication and notification delivery too. Do not show the saved number in public profiles, API responses, or logs.

Use text-only messages for decorative bot UI, including rules and menus, except for two user-approved cases: send the saved file ID of the first sticker from the `TwinLove` sticker set before the welcome text on `/start`, and show `src/assets/buttons.png` with the unknown-command help text that points to `/start`. Do not fetch the sticker set for every `/start`. Keep user-uploaded profile media and support attachments working; those are content, not decoration.
For the unknown-command help image, upload `buttons.png` once, save the largest returned photo `file_id` in `src/assets/cache.json`, and reuse it after restarts. The cache separates dev and prod bot IDs and includes an image hash so a changed image is uploaded again. Retry the local file if the cached ID fails, and fall back to text if sending the image fails. `cache.json` is runtime state and is ignored by Git.

## Scope of the current phase

- Work primarily on Russian copy and the visible interface. Preserve the bot's architecture, data model, and existing user flows unless the user explicitly asks to change a feature.
- A copy change must not silently change eligibility, moderation, privacy, publication, notification, or contact rules.
- If hiding a retired feature, change the smallest set of entry points and outputs needed. Keep unrelated implementation and stored user data intact. Existing users may have saved scene names from the old bot; handle them without stranding users.
- Do not treat this file as permission to rename bot accounts, channels, links, payment addresses, or deployment configuration. Their current values may still point to the original project and need explicit product decisions.

## Voice and copy decisions

- Write warm, clear, natural Russian for adults. Use «ты» consistently in user-facing messages, unless the user chooses another form of address. Prefer short sentences and ordinary words over formal legalese or marketing superlatives.
- Avoid slang, profanity, insults, stigmatizing labels, crude jokes, and references to the old internet subculture. Avoid judging a user's appearance, age, identity, or reasons for dating.
- Make errors and restrictions useful: state what happened and what the person can do next. Keep safety, age, privacy, consent, and moderation messages accurate.
- Do not invent claims about security, anonymity, active moderation, free service, audience size, success rates, or future plans. Check behavior in code before describing it.
- The user wants to choose subjective replacements. Show the exact current phrase and one or two concrete alternatives in small groups; apply the user's choices before moving on. Simple spelling and grammar fixes do not require a separate choice.
- Preserve a friendly human tone. Removing offensive language does not mean turning every message into corporate or bureaucratic copy.

## Telegram text and navigation

- The main copy and keyboard labels live in `src/assets/ui/ru.js`. `TEXTS` keys are used by handlers as well as for display; keep keys stable unless every reference is updated.
- Many messages use Telegram `MarkdownV2`. Preserve escaping, formatting, links, newlines, interpolations, and dynamic value screening. Check rendered meaning as well as JavaScript syntax.
- Keyboard text can be an exact-match command in scene handlers. If a button label changes, inspect all comparisons with that `TEXTS` value and related keyboard definitions.
- Scene handlers match current `TEXTS` button labels only. Do not add fallback checks for old visible labels; the user asked to remove that compatibility code.
- Deep-link payloads (`/start ...`), callback data, and scene names connect separate handlers. Do not rename them for copy style alone.
- The user chose to keep the compact «(?)» link beside the 18+ rule; it opens the age explanation through `/start dating18`.
- The four rules bullets use the ⏺️ custom emoji from the `TwinLoveEmoji` set through MarkdownV2. Keep the fallback emoji text aligned with the sticker's emoji value.
- Location messages and keyboard buttons use the 📍 custom emoji from `TwinLoveEmoji`. Own profile previews omit the pin; other private cards keep the custom pin. Published channel cards use an ordinary 📍 because this bot cannot use custom emoji in channel posts under Telegram's current eligibility. Keep location request buttons functional.
- Anonymous location buttons and private profile cards use the 🏴‍☠️ custom emoji. Channel cards retain the ordinary 🏴‍☠️ fallback. The «Кто видит твои фото и видео» tip uses custom 🖼.
- Publication buttons use the ⬆️ custom emoji from `TwinLoveEmoji`.
- Both return buttons use the ⏪ custom emoji from `TwinLoveEmoji`. The pencil ✏️ in the profile guidance uses the matching custom emoji. When a sticker is replaced in the set, update its ID in the UI.
- «Редактировать» and «Текст анкеты» use the ✏️ custom emoji as a button icon.
- «Показать» uses the 👁 custom emoji as a button icon. The «Как опубликовать анкету?» tip uses the custom ⬆️ in its heading and action path. Update existing custom emoji IDs when Telegram assigns replacements in the set, including 👤.
- All private URL buttons that display 🔗, including opening the chat, channel, and channel post, use the custom 🔗 icon from `TwinLoveEmoji`. Inline text references use a MarkdownV2 custom emoji entity.
- Profile cards and automated notifications are user-facing copy too. Check them when removing a term from the interface.
- Tips stay text-only. Use a short bold heading with one emoji, a concise explanation, and a separate action path with the current button labels. In tip paths, put every icon before its label, for example `Анкета → ✏️ Редактировать → 📸 Фото/видео → 🔒 Настроить приватность`. Escape tip text for Telegram MarkdownV2.
- The «Пригласи знакомых» tip, referral statistics heading, and «Пригласить друзей» button use 🤝 from `TwinLoveEmoji`.
- The ❌ icon from `TwinLoveEmoji` is used on rejection, hide, and notification opt-out buttons. Telegram callback answer popups remain plain text because they do not support custom emoji entities.
- The «Все анкеты TwinLove» heading and main menu button keep the original custom ❤️ with dots (`5379552576687613329`). Use the newer 🩵 sticker (`5379960362357534919`) for the «Ты мне нравишься» button, like messages, and other personal heart references.
- The «Куда теперь?» main-menu message uses the custom 🧭 from `TwinLoveEmoji`.
- The edit menu prompt uses the custom ⚙️ from `TwinLoveEmoji`. When checking the pack, update changed IDs too; 📍 was replaced and now has ID `5379990525912853171`.
- Photo and video buttons and private messages use the custom 📸 from `TwinLoveEmoji`; auto-publication and waiting messages use custom ⏳.
- Contact buttons and private contact guidance use custom ☎️; the username confirmation uses custom 👍 from `TwinLoveEmoji`.
- The visibility button and related private guidance use custom 👻 from `TwinLoveEmoji`.
- The notification button, message, and tip use custom 📲 from `TwinLoveEmoji`; the new-profiles tip uses custom 📣.
- Notification, contact privacy, media privacy, visibility, and auto-delete setting choices have no decorative emoji. Only selected choices show the custom ✅ icon.
- The `/start nonotify` help message uses MarkdownV2 so its custom 🩵 renders correctly. Keep its reassurance that notifications can be disabled without blocking or deleting the bot; escape ordinary text when editing it.
- Private media moderation buttons use custom 👤 for «Человек» and custom 🐻 for «Без человека». Published channel cards keep ordinary ⚠️ because the current bot cannot display custom emoji there.
- Draft PNG icons for ordinary emoji still present in the interface live in `media/emoji_new/`. They are visual assets only. Match the existing magenta and teal palette: shift teal up and left, leave a transparent gap between the offset silhouette and magenta shape, and avoid a teal shadow below the main shape. Draw eyes and mouths as filled details where appropriate, and use original pictograms rather than exact copies of standard emoji. Do not replace Telegram emoji IDs or wire these files into bot messages until the user reviews and uploads the chosen icons to the emoji set. See the mapping and attribution in that folder's README.
- The reviewed 📎, ☠️, 🤖, ✨, 👁, 🔍, 🌆, 🐻, and 🩵 icons are now in `TwinLoveEmoji`. Use their current custom emoji IDs in private MarkdownV2 messages and eligible buttons. Keep ordinary emoji in channel posts and buttons where Telegram cannot display the custom icon.
- The 👤 custom emoji ID is `5381935789615657235`. All private ❗️ messages use the custom emoji ID `5382046303419151366` with MarkdownV2; escape plain text when composing those messages.
- Publication confirmation uses custom 🎉. Auto-delete UI and the remove-media button use custom 🗑 from `TwinLoveEmoji`.
- Both age confirmation buttons contain only text, without emoji. Rules, username, and moderation approval buttons use custom ✅. Selected option buttons also use custom ✅ before the label; callback popups use plain words because custom emoji entities are unsupported there.
- The «Сохранил» message uses custom 💾 from `TwinLoveEmoji`. Every reply that sends it must set MarkdownV2, including replies that remove the keyboard.
- The tip refresh button uses custom 🔄 (`5382278940322736514`). The privacy settings buttons and tips use custom 🔒 (`5379755951979016593`). The «Помахать» reply button, private contact greeting messages, and the greeting tip use custom 👋 (`5382237167470821434`). The emoji-only 👋 buttons in profile cards stay ordinary to avoid displaying two icons; channel posts keep ordinary emoji.

## Repository map and verification

- `src/index.js` starts the Telegraf bot and background workers. `src/main-loop.js` routes users to scenes. `src/scenes/` contains conversation flows; `src/modules/` contains commands, callbacks, and shared actions. `src/engines/` contains publication and notification loops. `src/helpers/` contains MongoDB models and the in-memory write cache.
- `configs/` currently contains bot credentials and connection details. Never quote their values in reports or add new secrets to source files. Prefer environment variables for future configuration work, if that work is requested.
- For text edits, run `node --check` on changed JavaScript files and inspect remaining legacy terms with `rg`. Do not launch the live bot, contact Telegram, or publish profiles to verify copy.
- Small utility tests live in `test/` and run with `npm test`. ESLint checks JavaScript and TypeScript with `npm run lint` using `eslint.config.js`. `npm run verify` builds the typed modules, lints the project, and runs tests before `npm run dev`, `npm run start`, or `npm run startnopm2` launches the bot. Avoid tests that only restate strings; add tests for meaningful behavior. Report checks performed and any copy that still awaits a product decision.

## Gradual TypeScript migration

- The user allows gradual migration of small, simple modules to TypeScript. Keep it incremental and separate from copy changes and larger behavior changes.
- Current TypeScript sources are `src/lib/create-import-id.ts`, `src/lib/text-screening.ts`, `src/lib/get-city-by-id.ts`, `src/lib/get-city-by-title.ts`, and `src/modules/check-valid.ts`. Their neighboring `.js` files are generated runtime files; edit the `.ts` source, then run `npm run build:typed` and `npm run typecheck:typed`. `src/lib/citys.d.ts` describes the existing JavaScript city loader.
- Existing JavaScript imports must keep working. Do not require a new runtime loader or convert the whole application as part of a small migration.
- Preserve exported names, arguments, return behavior, and side effects when migrating a module. Verify a representative behavior case before moving on.

## Unresolved legacy material

The repository still includes old bot/channel links, media assets, and some onboarding and rules text written for the former audience. Do not present those as current TwinLove facts. Review each area with the user before changing claims or destinations.
