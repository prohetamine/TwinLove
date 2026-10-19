const onboardingStage = user => {
  if (!user.system_age18Confirm) return 'age18confirm-menu'
  if (!user.system_rulesConfirm) return 'rules-menu'
  if (!user.system_phoneNumber) return 'phone-menu'
  return null
}

export default onboardingStage
