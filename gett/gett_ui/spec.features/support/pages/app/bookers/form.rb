module Pages
  module App::Bookers
    class Form < Pages::App::Base
      section :role, Sections::Combobox, :combobox, 'roleType'
      section :first_name, Sections::Input, :field, 'firstName'
      section :last_name, Sections::Input, :field, 'lastName'
      section :department, Sections::Combobox, :combobox, 'departmentId'

      section :phone, Sections::Phone, :phone, 'phone'
      section :mobile, Sections::Phone, :phone, 'mobile'
      section :email, Sections::Email, :field, 'email'
      section :work_role, Sections::Combobox, :combobox, 'workRoleId'

      section :add_all_passengers, Sections::Checkbox, :checkbox, 'assignedToAllPassengers'
      section :passengers, Sections::Multiselect, :combobox, 'passengerPks'

      section :active, Sections::Switcher, :switcher, 'active'
      section :onboarding, Sections::Switcher, :switcher, 'onboarding'
      element :reinvite_button, :button, 'Reinvite'

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
