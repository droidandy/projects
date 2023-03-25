class Admin::Users::IndexPolicy < ServicePolicy
  def execute?
    !user.user_role_name.outsourced_customer_care?
  end

  def edit_gett_users?
    policy(Admin::Users::EditPolicy).execute?
  end

  def create_user?
    policy(Admin::Users::CreatePolicy).execute?
  end
end
