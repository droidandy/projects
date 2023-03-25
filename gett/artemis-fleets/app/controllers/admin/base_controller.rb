class Admin::BaseController < ApplicationController
  before_action :authorize_admin

  private def authorize_admin
    head :unauthorized unless current_user&.instance_of?(Administrator)
  end

  private def context
    { admin: current_user }
  end
end
