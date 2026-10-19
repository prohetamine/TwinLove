// Source of truth for check-valid.js. Run `npm run build:typed` after editing.
type ValidationContext = {
  user: {
    location: string
    text?: string
    system_block_status: boolean
    system_age18Confirm: boolean
    system_rulesConfirm: boolean
    system_phoneNumber?: string
  }
  update?: {
    message?: {
      from?: { username?: string }
    }
  }
}

const checkValid = (ctx: ValidationContext): boolean => !(
  ctx.user?.location === '0|0' ||
  !ctx.user?.text ||
  ctx.user?.text?.length < 20 ||
  ctx.user?.text?.length > 800 ||
  ctx.user?.system_block_status === true ||
  ctx.user?.system_age18Confirm === false ||
  ctx.user?.system_rulesConfirm === false ||
  !ctx.user?.system_phoneNumber ||
  !ctx?.update?.message?.from?.username
)

export default checkValid
