require 'compliance_queue'

class Users::CheckQueueStatus < ApplicationService
  schema do
    required(:user).filled
  end

  def execute!
    user.update!(ready_for_approval_since: Time.current) if add_to_queue?
    user.update!(ready_for_approval_since: nil) if remove_from_queue?
    ComplianceQueue.new(user).update_position
    success!
  end

  on_fail { errors!(record.errors.to_h) if record.present? }

  private def add_to_queue?
    ready_for_queue? && !user.in_queue?
  end

  private def remove_from_queue?
    user.documents.pending_approval_status.none?
  end

  private def ready_for_queue?
    user_is_ready? && pending_documents? && at_least_one_vehicle_ready?
  end

  private def user_is_ready?
    user.approval_status != 'documents_missing'
  end

  private def pending_documents?
    search = Documents::Search.new(
      {
        user: user,
        approval_status: 'pending',
        # we need documents belonging to any ready vehicle or user himself
        vehicle_id: ready_vehicles.ids.push(nil),
        required: true
      },
      current_user: current_user
    )
    search.exists?
  end

  private def ready_vehicles
    @ready_vehicles ||= begin
      search = Vehicles::Search.new(
        {
          user: user,
          filled_documents: true
        },
        current_user: current_user
      )
      search.resolved_scope
    end
  end

  private def at_least_one_vehicle_ready?
    ready_vehicles.exists?
  end
end
