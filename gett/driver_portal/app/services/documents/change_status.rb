require 'pub_sub'

module Documents
  class ChangeStatus < ApplicationService
    attr_reader :updated_document, :status_change

    schema do
      required(:document).filled
      required(:status).filled(:str?)
      optional(:comment).maybe(:str?)
    end

    def execute!
      super do
        document.update(approval_status: status)

        @status_change = document.status_changes.build status_change_attributes
        return unless @status_change.save

        next true unless document.kind.mandatory

        @documents_were_ready = ComplianceQueue.new(document.user).documents_ready?

        if document.vehicle_owned?
          compose(Vehicles::UpdateApprovalStatus.new(current_user, vehicle: document.vehicle))
        elsif document.driver_owned?
          compose(Users::UpdateApprovalStatus.new(current_user, user: document.user))
        end

        publish_updates

        compose(Users::CheckQueueStatus.new(current_user, user: document.user))
      end
    end

    on_fail { errors!(document.errors.to_h) if document.present? }
    on_fail { errors!(@status_change.errors.to_h) if @status_change.present? }
    on_success { @updated_document = document }

    private def status_change_attributes
      gather_attributes(:document, :status, :comment) do |hash|
        hash[:user] = current_user
      end
    end

    private def publish_updates
      documents_ready = ComplianceQueue.new(document.user.reload).documents_ready?
      return if documents_ready == @documents_were_ready
      PubSub.publish(
        'driver_documents_status',
        driver: Users::Assignment::Show.new(document.user.reload).as_json
      )
    end
  end
end
