module CompanySettings
  class Show < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    delegate :company, to: :context

    def execute!
      {
        data: {
          address: company.address.as_json(only: [:line, :lat, :lng, :country_code]),
          primary_contact: contact_data(company.primary_contact),
          billing_contact: contact_data(company.billing_contact),
          customer_service_phone: company.ddi_phone,
          sftp: sftp_settings
        },
        can: {
          edit: policy.edit?,
          see_sftp_options: policy.see_sftp_options?
        }
      }
    end

    private def contact_data(contact)
      opts = {only: [:phone, :mobile, :fax, :email, :first_name, :last_name]}
      opts[:include] = {address: {only: [:line, :lat, :lng, :country_code]}} unless contact&.primary?

      contact&.as_json(opts)
    end

    private def sftp_settings
      return unless policy.see_sftp_options?
      return if !company.hr_feed_enabled && company.booking_references_dataset.active.sftp.empty?

      {
        host: Settings.cerberus.sftp_endpoint,
        port: Settings.cerberus.sftp_port,
        username: company.sftp_username,
        password: company.sftp_password,
        hr_feed_enabled: company.hr_feed_enabled,
        references: company.booking_references_dataset.active.sftp
          .as_json(only: :name, include: :sftp_csv_path)
      }
    end
  end
end
