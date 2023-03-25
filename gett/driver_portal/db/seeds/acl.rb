PERMISSIONS = [
  { name: 'View news',       slug: :news_view },
  { name: 'Edit news',       slug: :news_edit },
  { name: 'View statistics', slug: :statistics_view },
  { name: 'View drivers',    slug: :drivers_view },
  { name: 'Sync drivers',    slug: :drivers_sync },
  { name: 'Drivers actions', slug: :drivers_actions },
  { name: 'View users',      slug: :users_view },
  { name: 'Edit users',      slug: :users_edit },
  { name: 'Users actions',   slug: :users_actions },
  { name: 'View alerts',     slug: :alerts_view },
  { name: 'Edit alerts',     slug: :alerts_edit },
  { name: 'View review',     slug: :review_view },
  { name: 'Edit review',     slug: :review_edit },
  { name: 'View checkin',    slug: :checkin_view },
  { name: 'Edit checkin',    slug: :checkin_edit }
].freeze

ROLES = {
  community_manager: %i[news_view news_edit],
  compliance_agent: %i[drivers_view drivers_actions alerts_view alerts_edit checkin_view],
  driver: [],
  apollo_driver: [],
  driver_support: %i[drivers_view drivers_actions checkin_view],
  site_admin: %i[
    news_view
    statistics_view
    drivers_view
    drivers_sync
    drivers_actions
    users_view
    users_edit
    users_actions
    alerts_view
    alerts_edit
    review_view
    review_edit
    checkin_view
    checkin_edit
  ],
  system_admin: %i[
    drivers_view
    drivers_sync
    drivers_actions
    users_actions
    checkin_view
  ],
  onboarding_agent: %i[
    drivers_view
    drivers_actions
    review_view
    review_edit
    checkin_view
    checkin_edit
  ]
}.freeze

PERMISSIONS.each do |permission|
  Permission.find_or_create_by!(slug: permission[:slug]) do |perm|
    perm.name = permission[:name]
  end
end

ROLES.each do |role_name, permissions|
  role = Role.find_or_create_by!(name: role_name)
  role.permissions = []
  permissions.each do |permission|
    role.permissions << Permission.find_by(slug: permission)
  end
end
