module Mobile::V1
  class UsersController < ApplicationController
    skip_before_action :authenticate, only: :forgot_password

    def forgot_password
      ::Users::ForgotPassword.new(email: params[:email]).execute

      head :ok
    end

    def pass_guide
      Members::PassGuide.new(member: current_member).execute

      head :ok
    end
  end
end
