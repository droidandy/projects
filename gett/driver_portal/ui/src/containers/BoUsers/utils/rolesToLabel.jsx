const roleLabels = {
  'site_admin': 'Admin',
  'community_manager': 'Community Manager',
  'compliance_agent': 'Compliance Agent',
  'driver': 'Driver',
  'driver_support': 'Driver Support',
  'onboarding_agent': 'Onboarding Agent'
}

function roleNameToLabel(roleName) {
  return roleLabels[roleName]
}

export {
  roleLabels,
  roleNameToLabel
}
