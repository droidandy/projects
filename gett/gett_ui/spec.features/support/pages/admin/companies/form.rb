module Pages
  module Admin::Companies
    class Form < Pages::Admin::Base
      include Mixings::Spinnable::Loader

      # Company Details
      section :company_name, Sections::Input, :field, 'name'
      section :company_type, Sections::Combobox, :combobox, 'companyType'
      section :address, Sections::Autocomplete, :combobox, 'address'
      section :vat_number, Sections::Input, :field, 'vatNumber'

      section :account_number, Sections::Input, :field, 'accountNumber' # (Affiliate only)
      section :sort_code, Sections::Input, :field, 'sortCode' # (Affiliate only)
      section :sales_person_name, Sections::Autocomplete, :combobox, 'salesmanId'
      section :account_manager, Sections::Autocomplete, :combobox, 'accountManagerId'
      section :cost_centre, Sections::Input, :field, 'costCentre'
      section :legal_company_name, Sections::Input, :field, 'legalName'
      section :legal_address, Sections::Autocomplete, :combobox, 'legalAddress'
      section :subcompanies, Sections::Multiselect, :combobox, 'linkedCompanyPks'
      section :ddi_type, Sections::Combobox, :combobox, 'ddi.type'
      element :company_logo, :text_node, 'companyLogo'
      section :critical_flag, Sections::Checkbox, :checkbox, 'criticalFlag'
      element :critical_due_date_picker, :text_node, 'datePicker'

      # Payment Options
      section :payment_types, Sections::Multiselect, :combobox, 'paymentOptions.paymentTypes'
      ## Enterprise Only
      section :default_payment_type, Sections::Combobox, :combobox, 'paymentOptions.defaultPaymentType'

      section :booking_fee, Sections::Input, :field, 'bookingFee'
      section :handling_fee, Sections::Input, :field, 'handlingFee'
      section :invoicing_schedule, Sections::Combobox, :combobox, 'paymentOptions.invoicingSchedule'

      section :run_in_fee, Sections::Input, :field, 'runInFee'
      section :phone_booking_fee, Sections::Input, :field, 'phoneBookingFee'
      section :splyt_invoice, Sections::Combobox, :combobox, 'paymentOptions.splitInvoice'

      section :tips, Sections::Input, :field, 'tips'
      section :business_credit, Sections::Input, :field, 'paymentOptions.businessCredit'
      section :payment_terms, Sections::Combobox, :combobox, 'paymentOptions.paymentTerms'

      section :gett_cancellation_before_arrival_fee, Sections::Input, :field, 'gettCancellationBeforeArrivalFee'
      section :gett_cancellation_after_arrival_fee, Sections::Input, :field, 'gettCancellationAfterArrivalFee'

      section :gett_e_cancellation_before_arrival_fee, Sections::Combobox, :combobox, 'getECancellationBeforeArrivalFee'
      section :gett_e_cancellation_after_arrival_fee, Sections::Combobox, :combobox, 'getECancellationAfterArrivalFee'

      section :ot_cancellation_before_arrival_fee, Sections::Combobox, :combobox, 'cancellationBeforeArrivalFee'
      section :ot_cancellation_after_arrival_fee, Sections::Combobox, :combobox, 'cancellationAfterArrivalFee'

      section :quote_price_increase_percentage, Sections::Input, :field, 'quotePriceIncreasePercentage'
      section :quote_price_increase_pounds, Sections::Input, :field, 'quotePriceIncreasePounds'

      section :splyt_cancellation_before_arrival_fee, Sections::Combobox, :combobox, 'splytCancellationBeforeArrivalFee'
      section :splyt_cancellation_after_arrival_fee, Sections::Combobox, :combobox, 'splytCancellationAfterArrivalFee'

      section :carey_cancellation_before_arrival_fee, Sections::Combobox, :combobox, 'careyCancellationBeforeArrivalFee'
      section :carey_cancellation_after_arrival_fee, Sections::Combobox, :combobox, 'careyCancellationAfterArrivalFee'

      section :international_booking_fee, Sections::Input, :field, 'internationalBookingFee'
      section :system_fx_rate_increase_percentage, Sections::Input, :field, 'systemFxRateIncreasePercentage'
      section :additional_billing_recipients, Sections::Input, :field, 'paymentOptions.additionalBillingRecipients'
      section :sap_id, Sections::Input, :field, 'sapId'

      section :company_registration_number, Sections::Input, :field, 'creditRateRegistrationNumber'
      section :incorporated_at, Sections::Input, :field, 'creditRateIncorporatedAt', disabled: true

      ## BBC Only
      section :travel_policy_mileage_limit, Sections::Input, :field, 'customAttributes.travelPolicyMileageLimit'
      section :hw_deviation_distance, Sections::Input, :field, 'customAttributes.hwDeviationDistance'
      section :p11d_percentage, Sections::Input, :field, 'customAttributes.p11d'
      section :excess_cost_per_mile, Sections::Input, :field, 'customAttributes.excessCostPerMile'

      # Company Settings
      section :marketing_allowed, Sections::Checkbox, :checkbox, 'marketingAllowed'
      section :default_driver_message, Sections::Input, :fillable_field, 'defaultDriverMessage'

      ## Enterprise and BBC
      section :bookings_validation, Sections::Checkbox, :checkbox, 'bookingsValidationEnabled'
      section :api_key, Sections::Checkbox, :checkbox, 'apiEnabled'
      section :multiple_booking, Sections::Checkbox, :checkbox, 'multipleBooking'
      section :booker_notifications, Sections::Checkbox, :checkbox, 'bookerNotifications'
      section :mandatory_payroll_id, Sections::Checkbox, :checkbox, 'payrollRequired'
      section :mandatory_payroll_cost_centre, Sections::Checkbox, :checkbox, 'costCentreRequired'
      section :hr_feed_enabled, Sections::Checkbox, :checkbox, 'hrFeedEnabled'
      section :allow_preferred_vendor, Sections::Checkbox, :checkbox, 'allowPreferredVendor'
      section :default_booker_notifications_emails, Sections::Input, :field, 'bookerNotificationsEmails'

      # Manage Bookings Password Protection (Enterprise and BBC)
      section :customer_care_password_active, Sections::Checkbox, :checkbox, 'customerCareActive'
      section :customer_care_password, Sections::Input, :field, 'customerCarePassword'

      # Admin Details
      section :on_boarding, Sections::Checkbox, :checkbox, 'admin.onboarding' # (Enterprise and BBC)
      section :first_name, Sections::Input, :field, 'admin.firstName'
      section :second_name, Sections::Input, :field, 'admin.lastName'
      section :phone_number, Sections::Phone, :phone, 'admin.phone'
      section :email, Sections::Input, :field, 'admin.email'
      section :password, Sections::Input, :field, 'admin.password'
      section :confirm_password, Sections::Input, :field, 'admin.passwordConfirmation'

      # Connection Options
      section :gett_id, Sections::Input, :field, 'gettBusinessId'
      element :gett_id_verify_button, :button, 'gettVerify'
      ## Enterprise and BBC
      section :ot_username, Sections::Input, :field, 'otUsername'
      section :ot_client_number, Sections::Input, :field, 'otClientNumber'
      element :ot_verify_button, :button, 'otVerify'

      # Reference Options (Enterprise and BBC)
      sections :references, :text_node, 'referenceOption' do
        element :name, '[name$=".name"]', visible: false
        element :active, '[name$=".active"]', visible: false
        element :mandatory, '[name$=".mandatory"]', visible: false
        element :conditional, '[name$=".conditional"]', visible: false
        element :verify, '[name$=".validationRequired"]', visible: false
        element :dropdown, '[name$=".dropdown"]', visible: false
        element :sftp_server, '[name$=".sftpServer"]', visible: false
        element :cost_centre, '[name$=".costCentre"]', visible: false
        element :attachment, 'input[type="file"]', visible: false
      end

      element :cancel_button, :button, 'cancel'
      element :save_button, :button, 'saveCompany'

      def submit
        save_button.click
      end

      def fill_in_gett_credentials(gett_id_value = nil)
        gettid = gett_id_value || UITest.config[:gett][:ent_id]
        gett_id.set(gettid)
        gett_id_verify_button.click
      end

      def fill_in_ot_credentials
        ot_username.set(UITest.config[:ot][:username])
        ot_client_number.set(UITest.config[:ot][:client_number])
        ot_verify_button.click
      end
    end
  end
end
