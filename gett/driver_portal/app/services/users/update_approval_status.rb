module Users
  class UpdateApprovalStatus < ::ApprovalStatus::Recalculate
    schema do
      required(:user).filled
    end

    def execute!
      super do
        user.update approval_status: new_status
      end
    end

    private def required_documents
      @required_documents ||= begin
        search = Documents::Search.new({ user: user, required: true, driver_bound: true }, current_user: current_user)
        search.resolved_scope
      end
    end

    private def required_kinds
      @required_kinds ||= begin
        search = Documents::Kinds::Search.new({ owner: :driver, mandatory: true }, current_user: current_user)
        search.resolved_scope
      end
    end
  end
end
