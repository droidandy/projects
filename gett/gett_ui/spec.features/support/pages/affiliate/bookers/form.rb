module Pages
  module Affiliate::Bookers
    class Form < Pages::Affiliate::Base
      section :role, Sections::Combobox, :combobox, 'roleType'
      section :first_name, Sections::Input, :field, 'firstName'
      section :last_name, Sections::Input, :field, 'lastName'

      section :phone, Sections::Phone, :phone, 'phone'
      section :mobile, Sections::Phone, :phone, 'mobile'
      section :email, Sections::Input, :field, 'email'

      section :active, Sections::Switcher, :switcher, 'active'

      element :cancel_button, :button, 'cancel'
      element :save_button, :button, 'saveBooker'

      def fill_in_form(booker)
        first_name.set(booker.first_name)
        last_name.set(booker.last_name)
        phone.set(booker.phone)
        email.set(booker.email)
      end

      def submit
        save_button.click
      end
    end
  end
end
