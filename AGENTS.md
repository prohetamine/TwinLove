# TwinLove — guidance for contributors and agents

## Product direction

TwinLove is a fork of an older Telegram bot. The current task is to adapt it for a broad audience looking for dating and meaningful connections. The public name is **TwinLove**. The old project's identity, in-jokes, subculture, and promotional claims are legacy material; they do not define the new product.

The user has decided to remove «Нижнометр» and the $ONI token section from the user-facing bot. Do not bring them back into menus, onboarding, profile cards, notifications, or deep links. Other legacy features require a separate user decision before removal or repurposing.

The MongoDB database name is `twinlove`. Changing the connection target does not migrate data from the legacy `openoni` database; plan any data migration separately and never overwrite or delete legacy data without an explicit request.

Use text-only messages for decorative bot UI, including onboarding, rules, menus, and help. Keep user-uploaded profile media and support attachments working; those are content, not decoration.

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
- Deep-link payloads (`/start ...`), callback data, and scene names connect separate handlers. Do not rename them for copy style alone.
- Profile cards and automated notifications are user-facing copy too. Check them when removing a term from the interface.

## Repository map and verification

- `src/index.js` starts the Telegraf bot and background workers. `src/main-loop.js` routes users to scenes. `src/scenes/` contains conversation flows; `src/modules/` contains commands, callbacks, and shared actions. `src/engines/` contains publication and notification loops. `src/helpers/` contains MongoDB models and the in-memory write cache.
- `configs/` currently contains bot credentials and connection details. Never quote their values in reports or add new secrets to source files. Prefer environment variables for future configuration work, if that work is requested.
- For text edits, run `node --check` on changed JavaScript files and inspect remaining legacy terms with `rg`. Do not launch the live bot, contact Telegram, or publish profiles to verify copy.
- Small utility tests live in `test/` and run with `npm test`. `npm run verify` builds the typed modules and runs those tests before `npm run dev`, `npm run start`, or `npm run startnopm2` launches the bot. Avoid tests that only restate strings; add tests for meaningful behavior. Report checks performed and any copy that still awaits a product decision.

## Gradual TypeScript migration

- The user allows gradual migration of small, simple modules to TypeScript. Keep it incremental and separate from copy changes and larger behavior changes.
- Current TypeScript sources are `src/lib/create-import-id.ts` and `src/lib/text-screening.ts`. Their neighboring `.js` files are generated runtime files; edit the `.ts` source, then run `npm run build:typed` and `npm run typecheck:typed`.
- Existing JavaScript imports must keep working. Do not require a new runtime loader or convert the whole application as part of a small migration.
- Preserve exported names, arguments, return behavior, and side effects when migrating a module. Verify a representative behavior case before moving on.

## Unresolved legacy material

The repository still includes old bot/channel links, media assets, donation details, a source-code promise, and some onboarding and rules text written for the former audience. Do not present those as current TwinLove facts. Review each area with the user before changing claims, destinations, or payment information.
