class Admin::Companies::DestroyPolicy < ServicePolicy
  def execute?
    user.user_role_name.superadmin?
  end
end
