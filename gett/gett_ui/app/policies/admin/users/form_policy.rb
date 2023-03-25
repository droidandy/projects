class Admin::Users::FormPolicy < ServicePolicy
  delegate :admin, to: :service

  def execute?
    policy(Admin::Users::Policy).execute?
  end

  def change_user_role?
    !(admin.user_role_name.admin? && user_being_edited.user_role_name&.superadmin?)
  end

  private def user_being_edited
    service.user
  end
end
