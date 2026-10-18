# TwinLove: project guidance

This repository is a fork of an older Telegram bot. TwinLove is being developed as a general dating service. Treat the older project's name, subculture references, and promotional claims as legacy copy, not as the voice or identity of TwinLove.

The public product name is TwinLove. The legacy «Нижнометр» test and the $ONI token section are removed from the user interface. Do not restore them in menus, profile cards, deep links, or onboarding copy.

## User-facing text

- Write natural, warm Russian for adults looking to meet people. Address users consistently as «ты» unless the user approves a different style.
- Use clear everyday language. Avoid slang, insults, stigmatizing labels, profanity, crude jokes, and references to the original project's subculture.
- Keep messages concise and helpful. Explain what a person can do next when an action fails.
- Preserve the meaning of safety, age, privacy, moderation, and consent messages. Do not add claims about product behavior that the code does not support.
- Preserve Telegram MarkdownV2 escaping, links, placeholders, interpolation, `TEXTS` keys, and button behavior when editing copy in `src/assets/ui/ru.js`.
- The user wants to choose replacements for subjective wording. Present specific existing phrases and proposed alternatives in small groups, then apply their choices. Straightforward spelling and grammar corrections can be made without asking.
- Do not guess a new public product name, slogan, donation message, or position on legacy features. Ask the user when a choice changes product identity or scope.

## Implementation

- This phase is a copy and audience adaptation. Keep the existing bot architecture, data model, and user flows. Change behavior only when the user explicitly requests a feature to be removed or changed.
- Keep copy changes separate from behavior changes where practical. For a removed feature, prefer hiding its entry points and output over deleting unrelated implementation or stored data.
- Check JavaScript syntax after editing text. For Telegram messages, also check MarkdownV2 special characters and dynamic values.
- Never start the live bot or publish content as part of copy review.
