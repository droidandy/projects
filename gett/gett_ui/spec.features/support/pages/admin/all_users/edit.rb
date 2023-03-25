module Pages
  module Admin::AllUsers
    class Edit < Pages::Admin::Base
      set_url('/admin/users/members/{id}/edit')

      section :role, Sections::Combobox, :combobox, 'roleType'
      section :first_name, Sections::Input, :field, 'firstName'
      section :last_name, Sections::Input, :field, 'lastName'
      section :department, Sections::Combobox, :combobox, 'departmentId'

      section :phone, Sections::Phone, :phone, 'phone'
      section :mobile, Sections::Phone, :phone, 'mobile'
      section :email, Sections::Input, :field, 'email'
      section :work_role, Sections::Combobox, :combobox, 'workRoleId'

      section :passengers, Sections::Multiselect, :combobox, 'passengerPks'
      section :bookers, Sections::Multiselect, :combobox, 'bookerPks'

      section :home_address, Sections::Autocomplete, :combobox, 'homeAddress'
      section :work_address, Sections::Autocomplete, :combobox, 'workAddress'

      section :payroll_id, Sections::Input, :field, 'payroll'
      section :cost_centre, Sections::Input, :field, 'costCentre'
      section :division, Sections::Input, :field, 'division'

      element :reinvite_button, :button, 'Reinvite'
      section :active, Sections::Switcher, :switcher, 'active'
      section :onboarding, Sections::Switcher, :switcher, 'onboarding'
      section :receives_sms_notification, Sections::Switcher, :switcher, 'notifyWithSms'
      section :receives_email_notification, Sections::Switcher, :switcher, 'notifyWithEmail'
      section :receives_push_notification, Sections::Switcher, :switcher, 'notifyWithPush'
      section :wheelchair_user, Sections::Switcher, :switcher, 'wheelchairUser'
      section :outlook_calendar_events, Sections::Switcher, :switcher, 'notifyWithCalendarEvent'
      section :vip, Sections::Switcher, :switcher, 'vip'

      element :cancel_button, :button, 'cancel'
      element :save_button, :button, 'savePassenger'

      # Favourite Addresses Tab
      element :favourite_addresses_tab, :xpath, '//div[@role="tab" and .="Favourite Addresses"]'
      element :add_favourite_address_button, :button, 'Add address'
      sections :favourite_address, Sections::App::Passengers::FavouriteAddress, 'div.ant-tabs-tabpane-active .ant-table-row-level-0'
      section :favourite_address_modal, '.ant-modal-content' do
        section :address_name, Sections::Input, :field, 'name'
        section :address, Sections::Autocomplete, :combobox, 'address'
        section :pickup_message, Sections::Input, :field, 'pickupMessage'
        section :destination_message, Sections::Input, :field, 'destinationMessage'
        element :cancel_button, :button, 'Cancel'
        element :save_button, :button, 'Save'
      end

      def get_favourite_address_by_name(name)
        favourite_address.find{ |fa| fa.name == name }
      end

      # Payment Cards Tab
      element :payment_cards_tab, :xpath, '//div[@role="tab" and .="Payment Cards"]'
      element :add_payment_card_button, :button, 'Add Payment Card'
      sections :payment_card, Sections::App::Passengers::PaymentCard, 'div.ant-tabs-tabpane-active .ant-table-row-level-0'

      def first_personal_card
        payment_card.find { |pc| pc.type.text == 'Personal' }
      end

      def first_business_card
        payment_card.find { |pc| pc.type.text == 'Business' }
      end

      # Change Log Tab
      element :change_log_tab, :xpath, '//div[@role="tab" and .="Change Log"]'
      sections :change_logs, 'div.ant-tabs-tabpane-active .ant-table-row-level-0' do
        element :field_name, :xpath, './/td[1]'
        element :author, :xpath, './/td[2]'
        element :from, :xpath, './/td[3]'
        element :to, :xpath, './/td[4]'
      end

      def change_log_by_field_name(text)
        change_logs.find { |cl| cl.field_name.text == text }
      end

      section :delete_modal, Sections::DeleteModal, '.ant-modal-content'

      def fill_in_form(user)
        first_name.set(user.first_name)
        last_name.set(user.last_name)
        phone.set(user.phone)
        email.set(user.email)
      end

      def submit
        save_button.click
      end
    end
  end
end
