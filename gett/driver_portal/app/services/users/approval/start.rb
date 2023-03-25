class Users::Approval::Start < ApplicationService
  def initialize(current_user)
    @current_user = current_user
  end

  def execute!
    unless user
      fail!(errors: { base: 'Queue is empty' })
      return
    end

    authorize! user, :start?, Users::ApprovalPolicy

    if current_user.driver_to_approve
      fail!(errors: { base: 'Another user is being approved by you' })
      return
    end

    success! if user.update(approver: current_user)
  end

  on_fail { errors!(user.errors.to_h) if user.present? }

  def user
    @user ||= begin
      search = Users::Search.new({ in_queue: true, free_of_approval: true }, current_user: current_user)
      search.resolved_scope.order(ready_for_approval_since: :asc).first
    end
  end
end
