module Users
  module Approval
    class Notification < ApplicationService
      def initialize(current_user, params)
        @current_user = current_user
        @driver_id = params.fetch(:user_id)
      end

      def as_json
        {
          subject: subject,
          message: message
        }
      end

      private def driver
        @driver ||= ::Users::Search.new({ id: @driver_id }, current_user: current_user).one
      end

      private def subject
        approved ? 'Documents approved' : 'Some documents were rejected'
      end

      private def message
        return 'Thank you for documents uploading. All your documents are approved.' if approved
        rejected_documents.map(&method(:format_document)).join("\n\n")
      end

      private def approved
        @approved ||= driver.approved_approval_status? &&
                      driver.vehicles.visible.approved_approval_status.any?
      end

      private def format_document(document)
        title = document.driver_owned? ? 'Driver document' : document.vehicle.title

        <<-TEXT.strip_heredoc
          #{title} - #{document.kind.title}
          Reject reason:
          #{document.status_changes.last&.comment}
        TEXT
      end

      private def rejected_documents
        driver.documents.visible.rejected_approval_status.to_a + vehicle_documents.to_a
      end

      private def vehicle_documents
        Document.visible.rejected_approval_status
          .joins(:vehicle)
          .merge(Vehicle.visible.rejected_approval_status)
          .where(vehicles: { user_id: driver })
      end
    end
  end
end
