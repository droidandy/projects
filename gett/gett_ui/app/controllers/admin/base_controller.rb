class Admin::BaseController < AuthenticatedController
  before_action :authorize_admin
  around_action :with_user_context

  private def with_user_context
    context = {
      user: current_user,
      admin: current_admin,
      user_gid: current_user&.to_gid&.to_s,
      back_office: true
    }

    ApplicationService::Context.with_context(context){ yield }
  end

  private def authorize_admin
    head :unauthorized unless current_user&.back_office?
  end
end
