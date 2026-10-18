const checkValid = ctx => !(
  ctx.user?.location === '0|0' ||
  ctx.user?.text?.length < 20 ||
  ctx.user?.text?.length > 800 ||
  ctx.user?.system_block_status === true ||
  ctx.user?.system_age18Confirm === false || 
  ctx.user?.system_rulesConfirm === false ||
  !ctx?.update?.message?.from?.username
)

export default checkValid