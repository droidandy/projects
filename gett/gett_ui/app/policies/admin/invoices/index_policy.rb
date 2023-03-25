class Admin::Invoices::IndexPolicy < ServicePolicy
  def execute?
    user.user_role_name&.in? %w(superadmin admin sales)
  end
end
