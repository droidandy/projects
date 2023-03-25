module Pages
  module Admin::Companies
    class New < Pages::Admin::Companies::Form
      set_url('/admin/company/new')
      # Admin Details
      section :on_boarding, Sections::Checkbox, :checkbox, 'admin.onboarding' # (Enterprise Only)

      def fill_in_admin_credentials(user)
        first_name.set(user.first_name)
        second_name.set(user.last_name)
        phone_number.set(user.phone)
        email.set(user.email)
        password.set('P@ssword')
        confirm_password.set('P@ssword')
      end

      def fill_in_ent_form(name, user)
        company_name.set(name)

        with_headers do
          set_address_headers '167 Fleet Street, London, UK'
          address.select '167 Fleet Street, London, UK'
        end
        default_payment_type.select 'Account'

        fill_in_admin_credentials(user)
        fill_in_gett_credentials
        fill_in_ot_credentials
      end
    end
  end
end
