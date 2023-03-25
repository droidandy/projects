module Admin
  class BookingReferences::Create < ApplicationService
    include ApplicationService::ModelMethods

    attributes :company, :params
    delegate :errors, to: :booking_reference

    def execute!
      transaction do
        result { create_model(booking_reference, params) }
        if booking_reference.sftp_server?
          prepare_sftp_fetching
        else
          process_attachment
        end
      end
    end

    private def prepare_sftp_fetching
      assert { enable_sftp_service.execute } if booking_reference.active?
    end

    private def process_attachment
      assert { create_reference_entries! } if params[:attachment].present?
    end

    private def booking_reference
      @booking_reference ||= BookingReference.new(company: company)
    end

    private def create_reference_entries!
      Admin::BookingReferences::AttachmentProcessor.new(booking_reference, params[:attachment]).process!
    end

    private def enable_sftp_service
      @enable_sftp_service ||= Admin::Companies::EnableSftp.new(company: company)
    end
  end
end
