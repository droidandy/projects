module Admin
  class BookingReferences::Update < ApplicationService
    include ApplicationService::ModelMethods

    attributes :booking_reference, :params, :sftp_upload
    delegate :errors, :company, to: :booking_reference

    def execute!
      transaction do
        result { update_model(booking_reference, params) }

        assert { remove_old_reference_entries! } if sftp_server_changed?
        assert { enable_sftp_service.execute } if sftp_server_enabled? && booking_reference.active?
        process_attachment
      end
    end

    private def process_attachment
      assert { remove_old_reference_entries! } if params[:attachment].present? || sftp_server_changed?
      return if params[:attachment].blank?

      if params[:attachment] == 'null'
        assert { remove_old_attachment! }
      else
        assert { create_reference_entries! }
      end
    end

    private def remove_old_reference_entries!
      booking_reference.reference_entries_dataset.delete
    end

    private def remove_old_attachment!
      booking_reference[:attachment] = nil
      booking_reference.save!
    end

    private def create_reference_entries!
      Admin::BookingReferences::AttachmentProcessor.new(booking_reference, params[:attachment]).process!
    end

    private def enable_sftp_service
      @enable_sftp_service ||= Admin::Companies::EnableSftp.new(company: company)
    end

    private def sftp_server_changed?
      booking_reference.previous_changes&.key?(:sftp_server)
    end

    private def sftp_server_enabled?
      booking_reference.previous_changes&.[](:sftp_server) == [false, true]
    end
  end
end
