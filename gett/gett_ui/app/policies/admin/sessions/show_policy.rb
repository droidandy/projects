# explicitly load Admin::Settings::Policy to remove confusion with ::Settings module
require 'admin/settings/policy'

module Admin
  class Sessions::ShowPolicy < ServicePolicy
    allow_all!

    def see_notifications?
      policy(Admin::Messages::IndexPolicy).execute?
    end

    def see_statistics?
      policy(Statistics::IndexPolicy).execute?
    end

    def see_predefined_addresses?
      policy(Admin::Settings::Policy).execute?
    end

    def see_system_settings?
      policy(Admin::Settings::Policy).execute?
    end

    def see_billing?
      policy(Admin::Settings::BillingPolicy).execute?
    end

    def create_users?
      policy(Admin::Users::CreatePolicy).execute?
    end

    def toggle_company_status?
      policy(Admin::Companies::ToggleStatusPolicy).execute?
    end

    def manage_invoices?
      policy(Admin::Invoices::ManagePolicy).execute?
    end

    def edit_companies?
      policy(Admin::Companies::Policy).execute?
    end

    def see_companies?
      policy(Admin::Companies::IndexPolicy).execute?
    end

    def see_users?
      policy(Admin::Users::IndexPolicy).execute?
    end

    def see_bookings?
      !user.try(:user_role_name)&.outsourced_customer_care?
    end

    def manage_bookings_without_authorization?
      !user.try(:user_role_name).in?(['customer_care', 'outsourced_customer_care'])
    end
  end
end
