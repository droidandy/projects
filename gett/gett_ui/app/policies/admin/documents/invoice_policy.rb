module Admin
  module Documents
    class InvoicePolicy < ServicePolicy
      allow_all!

      scope do |user|
        if user.user_role_name&.in?(%w(superadmin admin))
          ::Invoice.dataset
        else
          ::Invoice.dataset.nullify
        end
      end
    end
  end
end
