class Admin::Companies::IndexPolicy < ServicePolicy
  def execute?
    !user.user_role_name.outsourced_customer_care?
  end

  def manage_company?
    policy(Admin::Companies::Policy).execute?
  end

  def toggle_company_status?
    policy(Admin::Companies::ToggleStatusPolicy).execute?
  end

  def activate_all_members?
    policy(Admin::Members::ActivateAllPolicy).execute?
  end

  def toggle_notifications?
    policy(Admin::Members::ToggleNotificationsPolicy).execute?
  end
end
