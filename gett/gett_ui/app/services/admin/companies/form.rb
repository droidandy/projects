module Admin::Companies
  class Form < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Policy
    include ApplicationService::Context

    attributes :company

    def self.policy_class
      Admin::Companies::Policy
    end

    def execute!
      {
        countries: countries,
        users: Admin::Users::Index.new.execute.result[:items],
        companies: Admin::Companies::Lookup.new.execute.result,
        can: {
          change_invoicing_schedule: !company&.bookings_dataset&.any?
        }
      }.tap do |h|
        h[:company] = company_data if company.present?
      end
    end

    private def countries
      ISO3166::Country.all.sort_by(&:name).map{ |country| { name: country.name, code: country.alpha2 } }
    end

    private def booking_references
      company.booking_references.map do |ref|
        ref.as_json(only: [
          :id, :name, :active, :mandatory, :validation_required, :dropdown,
          :sftp_server, :cost_centre, :conditional
        ]).tap do |hash|
          if ref.attachment.to_s.present?
            hash[:attachment_url] = ref.attachment.to_s
            hash[:file_name] = ref[:attachment]
          end
        end
      end
    end

    private def company_data
      base_company_data.merge(
        logo_url: company.logo&.url,
        critical_flag_enabled_by: company.critical_flag_enabled_by,
        critical_flag_enabled_at: company.critical_flag_enabled_at,
        admin: company.admin.as_json(only: [
          :onboarding, :first_name, :last_name, :phone, :email
        ]),
        payment_options: company.payment_options.as_json(only: [
          :payment_types, :business_credit, :payment_terms, :invoicing_schedule,
          :split_invoice, :additional_billing_recipients, :default_payment_type,
          :business_credit_expended
        ]),
        address: company.address&.as_json(only: [
          :line, :lat, :lng, :postal_code, :country_code
        ]),
        legal_address: company.legal_address&.as_json(only: [
          :line, :lat, :lng, :postal_code, :country_code
        ]),
        references: booking_references,
        ddi: company.ddi.as_json(only: [:type, :phone])
      )
    end

    private def base_company_data
      company.as_json(only: [
        :id,
        :sap_id,
        :company_type,
        :active,
        :destination_required,
        :booking_reference_required,
        :booking_reference_validation,
        :default_driver_message,
        :gett_business_id,
        :ot_username,
        :ot_client_number,
        :multiple_booking,
        :payroll_required,
        :cost_centre_required,
        :customer_care_password,
        :hr_feed_enabled,
        :allow_preferred_vendor,
        :marketing_allowed,
        :bookings_validation_enabled,
        :api_enabled,
        :booker_notifications,
        :booker_notifications_emails,
        :credit_rate_registration_number,
        :credit_rate_incorporated_at,
        :custom_attributes,
        :critical_flag_due_on,
        :api_notifications_enabled
      ], include: [
        :name,
        :vat_number,
        :tips,
        :account_number,
        :sort_code,
        :cost_centre,
        :legal_name,
        :salesman_id,
        :account_manager_id,
        :booking_fee,
        :run_in_fee,
        :handling_fee,
        :phone_booking_fee,
        :cancellation_before_arrival_fee,
        :cancellation_after_arrival_fee,
        :gett_cancellation_before_arrival_fee,
        :gett_cancellation_after_arrival_fee,
        :get_e_cancellation_before_arrival_fee,
        :get_e_cancellation_after_arrival_fee,
        :splyt_cancellation_before_arrival_fee,
        :splyt_cancellation_after_arrival_fee,
        :carey_cancellation_before_arrival_fee,
        :carey_cancellation_after_arrival_fee,
        :international_booking_fee,
        :system_fx_rate_increase_percentage,
        :linked_company_pks,
        :api_key,
        :quote_price_increase_percentage,
        :quote_price_increase_pounds,
        :country_code
      ])
    end
  end
end
