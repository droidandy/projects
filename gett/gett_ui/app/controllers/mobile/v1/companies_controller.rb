module Mobile::V1
  class CompaniesController < ApplicationController
    skip_before_action :authenticate, only: :create_signup_request

    def create_signup_request
      service = Companies::CreateSignupRequest.new(params: signup_request_params)

      if service.execute.success?
        head :ok
      else
        render json: { errors: service.errors }, status: :unprocessable_entity
      end
    end

    private def signup_request_params
      params.require(:company)
        .permit(
          :user_name,
          :phone_number,
          :email,
          :name,
          :country,
          :comment,
          :accept_tac,
          :accept_pp
        )
    end
  end
end
