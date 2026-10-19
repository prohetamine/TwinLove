import { TEXTS, BUTTONS } from './../assets/ui/ru.js'
import sendWelcomeSticker from '../modules/send-welcome-sticker.js'
import onboardingStage from '../lib/onboarding-stage.js'

const start = async ctx => {
  await sendWelcomeSticker(ctx)
  await ctx.reply(TEXTS.hello, { parse_mode: 'MarkdownV2' })

  const stage = onboardingStage(ctx.user)
  if (stage === 'age18confirm-menu') {
    await ctx.enterScene(stage)
    await ctx.reply(TEXTS.age18Confirm, BUTTONS.age18Confirm_menu)
  } else if (stage === 'rules-menu') {
    await ctx.enterScene(stage)
    await ctx.reply(TEXTS.rules, { ...BUTTONS.rules_menu, disable_web_page_preview: true })
  } else if (stage === 'phone-menu') {
    await ctx.enterScene(stage)
    await ctx.reply(TEXTS.phone_request, BUTTONS.phone_menu)
  } else {
    await ctx.enterScene('main-menu')
    await ctx.reply(TEXTS.home, BUTTONS.main_menu)
  }
}

export default start
