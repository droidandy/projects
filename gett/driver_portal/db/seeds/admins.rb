dev_password = 'TestAccount123'

# site admin
Users::Create.new(
  nil,
  email: 'admin@fakemail.com',
  name: 'John Doe',
  password: dev_password,
  password_confirmation: dev_password,
  role: 'site_admin'
).execute!

# system admin
Users::Create.new(
  nil,
  email: 'admin@system.com',
  name: 'Admin System',
  password: dev_password,
  password_confirmation: dev_password,
  role: 'system_admin'
).execute!

# community_manager
Users::Create.new(
  nil,
  email: 'community_manager@system.com',
  name: 'Admin System',
  password: dev_password,
  password_confirmation: dev_password,
  role: 'community_manager'
).execute!

# compliance_agent
Users::Create.new(
  nil,
  email: 'compliance_agent@system.com',
  name: 'Admin System',
  password: dev_password,
  password_confirmation: dev_password,
  role: 'compliance_agent'
).execute!

# driver_support
Users::Create.new(
  nil,
  email: 'driver_support@system.com',
  name: 'Admin System',
  password: dev_password,
  password_confirmation: dev_password,
  role: 'driver_support'
).execute!

# onboarding_agent
Users::Create.new(
  nil,
  email: 'onboarding_agent@system.com',
  name: 'Onboarding Agent',
  password: dev_password,
  password_confirmation: dev_password,
  role: 'onboarding_agent'
).execute!

User.find_each do |user|
  Invite.create!(
    user: user,
    sender: User.first,
    step: :accepted,
    accepted_at: Time.current,
    token_digest: Digest::SHA256.hexdigest(SecureRandom.urlsafe_base64)
  )
end
