module Vehicles
  class UpdateApprovalStatus < ::ApprovalStatus::Recalculate
    schema do
      required(:vehicle).filled
    end

    def execute!
      super do
        vehicle.update approval_status: new_status
      end
    end

    private def required_documents
      @required_documents ||= begin
        search = Documents::Search.new({ vehicle: vehicle, required: true }, current_user: current_user)
        search.resolved_scope
      end
    end

    private def required_kinds
      @required_kinds ||= begin
        search = Documents::Kinds::Search.new({ owner: :vehicle, mandatory: true }, current_user: current_user)
        search.resolved_scope
      end
    end
  end
end
