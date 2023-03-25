module Pages
  module App::Passengers
    class Form < Pages::App::Base
      section :role, Sections::Combobox, :combobox, 'roleType'
      section :first_name, Sections::Input, :field, 'firstName'
      section :last_name, Sections::Input, :field, 'lastName'
      section :department, Sections::Combobox, :combobox, 'departmentId'

      section :phone, Sections::Phone, :phone, 'phone'
      section :mobile, Sections::Phone, :phone, 'mobile'
      section :email, Sections::Input, :field, 'email'
      section :work_role, Sections::Combobox, :combobox, 'workRoleId'

      section :home_address, Sections::Autocomplete, :combobox, 'homeAddress'
      section :work_address, Sections::Autocomplete, :combobox, 'workAddress'

      section :bookers, Sections::Multiselect, :combobox, 'bookerPks'

      section :payroll_id, Sections::Input, :field, 'payroll'
      section :cost_centre, Sections::Input, :field, 'costCentre'
      section :division, Sections::Input, :field, 'division'

      section :active, Sections::Switcher, :switcher, 'active'
      section :onboarding, Sections::Switcher, :switcher, 'onboarding'
      section :receives_sms_notification, Sections::Switcher, :switcher, 'notifyWithSms'
      section :receives_email_notification, Sections::Switcher, :switcher, 'notifyWithEmail'
      section :receives_push_notification, Sections::Switcher, :switcher, 'notifyWithPush'

      section :wheelchair_user, Sections::Switcher, :switcher, 'wheelchairUser'
      section :outlook_calendar_events, Sections::Switcher, :switcher, 'notifyWithCalendarEvent'

      # BBC only elements
      section :passenger_categorisation, Sections::Combobox, :combobox, 'customAttributes.pdType'
      section :enable_travel_to_from_home, Sections::Switcher, :switcher, 'customAttributes.whTravel'
      section :exemption_p11d, Sections::Switcher, :switcher, 'customAttributes.exemptionP11d'
      section :exemption_ww_salary_charges, Sections::Switcher, :switcher, 'customAttributes.exemptionWwCharges'
      section :exemption_wh_hw_salary_charges, Sections::Switcher, :switcher, 'customAttributes.exemptionWhHwCharges'
      section :hw_exemption_time_from, Sections::TimePicker, :text_node, 'customAttributes.hwExemptionTimeFrom'
      section :hw_exemption_time_to, Sections::TimePicker, :text_node, 'customAttributes.hwExemptionTimeTo'
      section :wh_exemption_time_from, Sections::TimePicker, :text_node, 'customAttributes.whExemptionTimeFrom'
      section :wh_exemption_time_to, Sections::TimePicker, :text_node, 'customAttributes.whExemptionTimeTo'

      element :cancel_button, :button, 'cancel'
      element :save_button, :button, 'savePassenger'

      def fill_in_form(passenger)
        first_name.set(passenger.first_name)
        last_name.set(passenger.last_name)
        phone.set(passenger.phone)
        email.set(passenger.email)
      end
    end
  end
end
