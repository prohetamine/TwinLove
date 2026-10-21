import onboardingStage from '../lib/onboarding-stage.js'
import age18confirmMenu from '../scenes/age18confirm-menu.js'
import rulesMenu from '../scenes/rules-menu.js'
import phoneMenu from '../scenes/phone-menu.js'
import start from '../scenes/start.js'
import { isReferralCode } from './referral-links.js'

const routeOnboarding = async (ctx, { registerReferral, users, referals }) => {
  const stage = onboardingStage(ctx.user)
  const text = ctx.update?.message?.text || ''

  if (!stage || ctx.user.system_block_status || text === '/start' || text === '/start from-channel') return false

  const referralCode = text.match(/^\/start ([^\s]+)$/)?.[1]
  if (isReferralCode(referralCode)) {
    await registerReferral(referralCode, ctx.user.id, { users, referals })
    await start(ctx)
    return true
  }

  if (ctx.user.scene !== stage) await ctx.enterScene(stage)
  if (ctx.update?.callback_query) await ctx.answerCbQuery?.()

  if (stage === 'age18confirm-menu') await age18confirmMenu(ctx)
  else if (stage === 'rules-menu') await rulesMenu(ctx)
  else await phoneMenu(ctx)
  return true
}

export default routeOnboarding
