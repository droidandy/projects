module Admin::Companies::CommonParams
  def company_params
    params.slice(
      :company_type, :sap_id, :destination_required, :booking_reference_required, :logo,
      :gett_business_id, :ot_username, :ot_client_number, :default_driver_message,
      :multiple_booking, :payroll_required, :cost_centre_required, :customer_care_password,
      :hr_feed_enabled, :marketing_allowed, :linked_company_pks, :bookings_validation_enabled,
      :api_enabled, :booker_notifications, :booker_notifications_emails,
      :credit_rate_registration_number, :allow_preferred_vendor, :critical_flag_due_on, :api_notifications_enabled
    )
  end

  def company_info_params
    params.slice(
      :name, :vat_number, :account_number, :sort_code, :cost_centre, :legal_name,
      :salesman_id, :booking_fee, :run_in_fee, :handling_fee, :phone_booking_fee, :tips,
      :cancellation_before_arrival_fee, :cancellation_after_arrival_fee,
      :gett_cancellation_before_arrival_fee, :gett_cancellation_after_arrival_fee,
      :get_e_cancellation_before_arrival_fee, :get_e_cancellation_after_arrival_fee,
      :splyt_cancellation_before_arrival_fee, :splyt_cancellation_after_arrival_fee,
      :carey_cancellation_before_arrival_fee, :carey_cancellation_after_arrival_fee,
      :international_booking_fee, :system_fx_rate_increase_percentage, :account_manager_id,
      :quote_price_increase_percentage, :quote_price_increase_pounds, :country_code
    )
  end
end
