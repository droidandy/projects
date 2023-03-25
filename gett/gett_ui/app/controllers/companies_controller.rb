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

  def show
    service = Companies::Dashboard.new

    render json: service.execute.result
  end

  def update
    service = Companies::Update.new(params: company_params)

    if service.execute.success?
      render json: Companies::Dashboard.new.execute.result
    else
      render json: { errors: service.errors }, status: :unprocessable_entity
    end
  end

  def synchronize_sftp
    Companies::SynchronizeSftp.new.execute

    head :ok
  end

  private def company_params
    params.require(:company).permit(:logo)
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
