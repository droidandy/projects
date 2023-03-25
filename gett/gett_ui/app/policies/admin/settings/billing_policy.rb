class Admin::Settings::BillingPolicy < ServicePolicy
  def execute?
    user.user_role_name&.in? %w(superadmin admin sales)
  end
end
