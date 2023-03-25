class Admin::Messages::IndexPolicy < ServicePolicy
  def execute?
    user.user_role_name&.in? %w(superadmin)
  end
end
