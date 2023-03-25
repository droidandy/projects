module Admin::Members
  class ActivateAllPolicy < ServicePolicy
    def execute?
      user.user_role_name.in?(%w(superadmin admin))
    end
  end
end
