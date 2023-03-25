class Admin::Invoices::ManagePolicy < ServicePolicy
  def execute?
    user.user_role_name&.in?(%w(superadmin admin))
  end
end
