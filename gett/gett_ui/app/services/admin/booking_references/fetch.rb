require 'sftp_loader'

module Admin
  class BookingReferences::Fetch < ApplicationService
    Attachment = Struct.new(:path)

    attributes :booking_reference
    delegate :company, to: :booking_reference

    def execute!
      SftpLoader.new(
        host: ::Settings.cerberus.sftp_endpoint,
        port: ::Settings.cerberus.sftp_port,
        username: company.sftp_username,
        password: company.sftp_password
      ).load(booking_reference.sftp_csv_path) do |local_path|
        result do
          Admin::BookingReferences::Update.new(
            booking_reference: booking_reference,
            params: { attachment: Attachment.new(local_path) },
            sftp_upload: true
          ).execute.success?
        end
      end
    end
  end
end
